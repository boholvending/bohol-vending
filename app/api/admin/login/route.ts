import { NextRequest, NextResponse } from "next/server";
import { adminCookie, adminUrl, createSession, sameOrigin, sessionSeconds, validPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
const attempts = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.redirect(adminUrl(request, "/login?error=limit"), 303);
  attempts.set(ip, [...recent, now]);
  if (Number(request.headers.get("content-length") || 0) > 4096) return new Response("Too large", { status: 413 });
  const form = await request.formData();
  const password = form.get("password");
  if (typeof password !== "string" || !(await validPassword(password))) {
    const reason = process.env.BOHOL_ADMIN_PASSWORD_HASH && process.env.BOHOL_ADMIN_SESSION_SECRET ? "invalid" : "setup";
    return NextResponse.redirect(adminUrl(request, `/login?error=${reason}`), 303);
  }
  attempts.delete(ip);
  const response = NextResponse.redirect(adminUrl(request, "/admin"), 303);
  response.cookies.set(adminCookie, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: sessionSeconds });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
