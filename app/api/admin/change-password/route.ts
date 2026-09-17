import { NextRequest, NextResponse } from "next/server";
import { adminCookie, adminUrl, changeAdminPassword, sameOrigin, validPassword, validSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const attempts = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  if (!validSession(request.cookies.get(adminCookie)?.value)) return new Response("Unauthorized", { status: 401 });
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 4096) return new Response("Too large", { status: 413 });
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.redirect(adminUrl(request, "/admin/security?error=limit"), 303);
  const form = await request.formData();
  const current = form.get("current");
  const next = form.get("next");
  const confirmation = form.get("confirmation");
  if (typeof current !== "string" || !(await validPassword(current))) {
    attempts.set(ip, [...recent, now]);
    return NextResponse.redirect(adminUrl(request, "/admin/security?error=current"), 303);
  }
  if (typeof next !== "string" || next.length < 8 || next.length > 12 || next !== confirmation) {
    return NextResponse.redirect(adminUrl(request, "/admin/security?error=new"), 303);
  }
  await changeAdminPassword(next);
  attempts.delete(ip);
  const response = NextResponse.redirect(adminUrl(request, "/login?changed=1"), 303);
  response.cookies.set(adminCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
