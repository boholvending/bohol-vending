import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";
import { gscStatus } from "@/lib/google-search-console";
export async function GET() {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json(await gscStatus(), { headers: { "Cache-Control": "private, no-store" } });
}
