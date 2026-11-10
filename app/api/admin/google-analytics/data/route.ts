import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";
import { getGa4Dashboard, gscStatus } from "@/lib/google-search-console";

export async function GET() {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const status = await gscStatus();
  if (!status.configured || !status.connected || !status.analyticsConnected) return Response.json({ error: "not_connected", status }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
  try {
    return Response.json(await getGa4Dashboard(), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "ga4_unknown";
    const statusCode = code === "ga4_403" ? 403 : code === "ga4_401" ? 401 : 502;
    return Response.json({ error: code }, { status: statusCode, headers: { "Cache-Control": "private, no-store" } });
  }
}
