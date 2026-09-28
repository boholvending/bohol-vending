import { cookies } from "next/headers";
import { adminUrl } from "@/lib/admin-auth";
import { exchangeGscCode } from "@/lib/google-search-console";
export async function GET(request: Request) {
  const jar = await cookies();
  const url = new URL(request.url); const code = url.searchParams.get("code"); const state = url.searchParams.get("state");
  if (!code || !state || state !== jar.get("bohol_gsc_oauth_state")?.value) return Response.redirect(adminUrl(request, "/bohol-control-7e9c2f/indexing?gsc=error"));
  try { await exchangeGscCode(code); jar.delete("bohol_gsc_oauth_state"); return Response.redirect(adminUrl(request, "/bohol-control-7e9c2f/indexing?gsc=connected")); } catch { return Response.redirect(adminUrl(request, "/bohol-control-7e9c2f/indexing?gsc=error")); }
}
