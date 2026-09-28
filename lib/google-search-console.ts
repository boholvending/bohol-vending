import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const configPath = process.env.BOHOL_GSC_CONFIG_FILE || join(homedir(), ".config", "bohol-vending", "google-search-console.json");
const tokenPath = process.env.BOHOL_GSC_TOKEN_FILE || join(homedir(), ".local", "share", "bohol-vending", "google-search-console-token.json");
export const gscRedirectUri = "https://www.boholvending.com/api/admin/google-search-console/callback";
export const gscProperty = "sc-domain:boholvending.com";

type OAuthConfig = { client_id: string; client_secret: string; redirect_uris: string[] };
type TokenData = { access_token?: string; refresh_token?: string; expires_in?: number; expires_at?: number };

async function privateWrite(path: string, value: unknown) {
  const directory = dirname(path);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = `${path}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temporary, JSON.stringify(value), { encoding: "utf8", mode: 0o600, flag: "wx" });
  await chmod(temporary, 0o600);
  await rename(temporary, path);
}

export async function readGscConfig(): Promise<OAuthConfig | null> {
  try {
    const parsed = JSON.parse(await readFile(configPath, "utf8"));
    const value = parsed.web || parsed;
    if (!value.client_id || !value.client_secret || !Array.isArray(value.redirect_uris)) return null;
    return value;
  } catch { return null; }
}

export async function saveGscConfig(raw: string) {
  const parsed = JSON.parse(raw);
  const value = parsed.web || parsed;
  if (typeof value.client_id !== "string" || typeof value.client_secret !== "string" || !Array.isArray(value.redirect_uris) || !value.redirect_uris.includes(gscRedirectUri)) throw new Error("invalid_config");
  await privateWrite(configPath, parsed);
}

async function readToken(): Promise<TokenData | null> {
  try { return JSON.parse(await readFile(tokenPath, "utf8")); } catch { return null; }
}

export async function gscStatus() {
  return { configured: Boolean(await readGscConfig()), connected: Boolean((await readToken())?.refresh_token) };
}

export async function exchangeGscCode(code: string) {
  const config = await readGscConfig();
  if (!config) throw new Error("not_configured");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: config.client_id, client_secret: config.client_secret, redirect_uri: gscRedirectUri, grant_type: "authorization_code" }) });
  if (!response.ok) throw new Error("token_exchange_failed");
  const token = await response.json() as TokenData;
  if (!token.refresh_token) throw new Error("missing_refresh_token");
  await privateWrite(tokenPath, { ...token, expires_at: Date.now() + (token.expires_in || 3600) * 1000 });
}

async function accessToken() {
  const [config, token] = await Promise.all([readGscConfig(), readToken()]);
  if (!config || !token?.refresh_token) throw new Error("not_connected");
  if (token.access_token && (token.expires_at || 0) > Date.now() + 60_000) return token.access_token;
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: config.client_id, client_secret: config.client_secret, refresh_token: token.refresh_token, grant_type: "refresh_token" }) });
  if (!response.ok) throw new Error("refresh_failed");
  const refreshed = await response.json() as TokenData;
  const next = { ...token, ...refreshed, expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000 };
  await privateWrite(tokenPath, next);
  return next.access_token!;
}

function isoDate(date: Date) { return date.toISOString().slice(0, 10); }

async function query(token: string, body: object) {
  const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscProperty)}/searchAnalytics/query`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  if (!response.ok) throw new Error(`gsc_${response.status}`);
  return response.json();
}

async function googleJson(url: string, token: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`gsc_${response.status}`);
  return response.json();
}

export async function getGscPerformance(days: number, dimension: string) {
  const token = await accessToken();
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - days + 1);
  const base = { startDate: isoDate(start), endDate: isoDate(end), type: "web", dataState: "final" };
  const [summary, detail] = await Promise.all([query(token, { ...base, rowLimit: 1 }), query(token, { ...base, dimensions: [dimension], rowLimit: 250 })]);
  return { range: base, totals: summary.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 }, rows: detail.rows || [] };
}

export async function getGscSitemaps() {
  const token = await accessToken();
  const data = await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscProperty)}/sitemaps`, token) as { sitemap?: unknown[] };
  return { property: gscProperty, sitemaps: data.sitemap || [] };
}

export async function inspectGscUrl(inspectionUrl: string) {
  const token = await accessToken();
  return googleJson("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token, {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl: gscProperty, languageCode: "zh-CN" }),
  });
}
