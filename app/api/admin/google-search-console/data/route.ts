import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";
import { getGscPerformance } from "@/lib/google-search-console";
const dimensions = new Set(["query", "page", "country", "device", "date"]);
export async function GET(request: Request) {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(request.url); const days = [7, 28, 90].includes(Number(url.searchParams.get("days"))) ? Number(url.searchParams.get("days")) : 28; const dimension = dimensions.has(url.searchParams.get("dimension") || "") ? url.searchParams.get("dimension")! : "query";
  try { return Response.json(await getGscPerformance(days, dimension), { headers: { "Cache-Control": "private, no-store" } }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "failed" }, { status: 502 }); }
}
