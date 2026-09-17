import { createHmac, pbkdf2 as pbkdf2Callback, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const pbkdf2 = promisify(pbkdf2Callback);
export const adminCookie = "bohol_admin_session";
export const sessionSeconds = 8 * 60 * 60;

function configured() {
  return Boolean(process.env.BOHOL_ADMIN_PASSWORD_HASH && process.env.BOHOL_ADMIN_SESSION_SECRET);
}

export async function validPassword(password: string) {
  const stored = process.env.BOHOL_ADMIN_PASSWORD_HASH || "";
  const [algorithm, roundsText, saltHex, expectedHex] = stored.split(":");
  const rounds = Number(roundsText);
  if (!configured() || algorithm !== "pbkdf2-sha256" || rounds < 600000 || rounds > 2000000 || !/^[a-f0-9]{32}$/.test(saltHex || "") || !/^[a-f0-9]{64}$/.test(expectedHex || "") || password.length > 1024) return false;
  const actual = await pbkdf2(password, Buffer.from(saltHex, "hex"), rounds, 32, "sha256");
  return timingSafeEqual(actual, Buffer.from(expectedHex, "hex"));
}

function signature(payload: string) {
  return createHmac("sha256", process.env.BOHOL_ADMIN_SESSION_SECRET || "").update(payload).digest("hex");
}

export function createSession() {
  if (!configured()) throw new Error("Admin login is not configured");
  const payload = `${Math.floor(Date.now() / 1000) + sessionSeconds}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}

export function validSession(value?: string) {
  if (!configured() || !value) return false;
  const [expiresText, nonce, supplied] = value.split(".");
  if (!/^\d{10}$/.test(expiresText || "") || !/^[a-f0-9]{32}$/.test(nonce || "") || !/^[a-f0-9]{64}$/.test(supplied || "")) return false;
  const expires = Number(expiresText);
  const now = Math.floor(Date.now() / 1000);
  if (expires <= now || expires > now + sessionSeconds) return false;
  return timingSafeEqual(Buffer.from(signature(`${expiresText}.${nonce}`), "hex"), Buffer.from(supplied, "hex"));
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
  const url = new URL(path, request.url);
  if (process.env.NODE_ENV === "production") url.protocol = "https:";
  return url;
}
