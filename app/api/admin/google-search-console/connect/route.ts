import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";
import { gscRedirectUri, readGscConfig } from "@/lib/google-search-console";
export async function GET() {
  const jar = await cookies();
  if (!validSession(jar.get(adminCookie)?.value)) return new Response("Unauthorized", { status: 401 });
  const config = await readGscConfig(); if (!config) return new Response("Not configured", { status: 409 });
  const state = randomBytes(24).toString("hex");
  jar.set("bohol_gsc_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: config.client_id, redirect_uri: gscRedirectUri, response_type: "code", scope: "https://www.googleapis.com/auth/webmasters.readonly", access_type: "offline", prompt: "consent", state }).toString();
  return Response.redirect(url);
}
