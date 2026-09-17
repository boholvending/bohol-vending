import { createHmac, pbkdf2 as pbkdf2Callback, randomBytes, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { chmod, mkdir, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const pbkdf2 = promisify(pbkdf2Callback);
export const adminCookie = "bohol_admin_session";
export const sessionSeconds = 8 * 60 * 60;
const configFile = process.env.BOHOL_ADMIN_CONFIG_FILE || join(homedir(), ".config", "bohol-vending", "admin.env");

function adminConfig() {
  let raw: string;
  try {
    raw = readFileSync(/*turbopackIgnore: true*/ configFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") return { hash: "", secret: "" };
    return { hash: process.env.BOHOL_ADMIN_PASSWORD_HASH || "", secret: process.env.BOHOL_ADMIN_SESSION_SECRET || "" };
  }
  const hash = raw.match(/^BOHOL_ADMIN_PASSWORD_HASH='([^']+)'$/m)?.[1] || "";
  const secret = raw.match(/^BOHOL_ADMIN_SESSION_SECRET='([a-f0-9]{64})'$/m)?.[1] || "";
  return { hash, secret };
}

export function adminConfigured() {
  const { hash, secret } = adminConfig();
  return Boolean(hash && secret);
}

export async function validPassword(password: string) {
  const stored = adminConfig().hash;
  const [algorithm, roundsText, saltHex, expectedHex] = stored.split(":");
  const rounds = Number(roundsText);
  if (!adminConfigured() || algorithm !== "pbkdf2-sha256" || rounds < 600000 || rounds > 2000000 || !/^[a-f0-9]{32}$/.test(saltHex || "") || !/^[a-f0-9]{64}$/.test(expectedHex || "") || password.length > 1024) return false;
  const actual = await pbkdf2(password, Buffer.from(saltHex, "hex"), rounds, 32, "sha256");
  return timingSafeEqual(actual, Buffer.from(expectedHex, "hex"));
}

function signature(payload: string) {
  return createHmac("sha256", adminConfig().secret).update(payload).digest("hex");
}

export function createSession() {
  if (!adminConfigured()) throw new Error("Admin login is not configured");
  const payload = `${Math.floor(Date.now() / 1000) + sessionSeconds}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}

export function validSession(value?: string) {
  if (!adminConfigured() || !value) return false;
  const [expiresText, nonce, supplied] = value.split(".");
  if (!/^\d{10}$/.test(expiresText || "") || !/^[a-f0-9]{32}$/.test(nonce || "") || !/^[a-f0-9]{64}$/.test(supplied || "")) return false;
  const expires = Number(expiresText);
  const now = Math.floor(Date.now() / 1000);
  if (expires <= now || expires > now + sessionSeconds) return false;
  return timingSafeEqual(Buffer.from(signature(`${expiresText}.${nonce}`), "hex"), Buffer.from(supplied, "hex"));
}

export async function changeAdminPassword(password: string) {
  if (password.length < 8 || password.length > 12) throw new Error("Invalid password length");
  const salt = randomBytes(16);
  const hash = await pbkdf2(password, salt, 600000, 32, "sha256");
  const passwordHash = `pbkdf2-sha256:600000:${salt.toString("hex")}:${hash.toString("hex")}`;
  const secret = randomBytes(32).toString("hex");
  const directory = dirname(configFile);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = `${configFile}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temporary, `BOHOL_ADMIN_PASSWORD_HASH='${passwordHash}'\nBOHOL_ADMIN_SESSION_SECRET='${secret}'\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
  await chmod(temporary, 0o600);
  await rename(temporary, configFile);
}

export async function requireAdmin() {
  const session = (await cookies()).get(adminCookie)?.value;
  if (!validSession(session)) redirect("/login");
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const url = new URL(origin);
    return url.host === host && (process.env.NODE_ENV !== "production" || url.protocol === "https:");
  } catch { return false; }
}

export function adminUrl(request: Request, path: string) {
  return new URL(path, process.env.NODE_ENV === "production" ? "https://boholvending.com" : request.url);
}
