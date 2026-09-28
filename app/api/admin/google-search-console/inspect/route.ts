import { cookies } from "next/headers";
import { adminCookie, sameOrigin, validSession } from "@/lib/admin-auth";
import { inspectGscUrl } from "@/lib/google-search-console";

export async function POST(request: Request) {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "invalid_origin" }, { status: 403 });
  const body = await request.json().catch(() => null) as { url?: unknown } | null;
  if (typeof body?.url !== "string" || body.url.length > 2048) return Response.json({ error: "invalid_url" }, { status: 400 });
  let url: URL;
  try { url = new URL(body.url); } catch { return Response.json({ error: "invalid_url" }, { status: 400 }); }
  if (url.protocol !== "https:" || !["boholvending.com", "www.boholvending.com"].includes(url.hostname)) return Response.json({ error: "outside_property" }, { status: 400 });
  try {
    return Response.json(await inspectGscUrl(url.href), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "failed" }, { status: 502 });
  }
}
