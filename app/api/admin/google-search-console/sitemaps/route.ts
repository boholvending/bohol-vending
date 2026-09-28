import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";
import { getGscSitemaps } from "@/lib/google-search-console";

export async function GET() {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return Response.json(await getGscSitemaps(), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "failed" }, { status: 502 });
  }
}
