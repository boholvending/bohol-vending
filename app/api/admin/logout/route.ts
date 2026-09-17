import { NextRequest, NextResponse } from "next/server";
import { adminCookie, adminUrl, sameOrigin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const response = NextResponse.redirect(adminUrl(request, "/login"), 303);
  response.cookies.set(adminCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
