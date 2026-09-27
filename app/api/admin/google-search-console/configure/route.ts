import { cookies } from "next/headers";
import { adminCookie, sameOrigin, validSession } from "@/lib/admin-auth";
import { saveGscConfig } from "@/lib/google-search-console";
export async function POST(request: Request) {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "origin" }, { status: 403 });
  const form = await request.formData(); const file = form.get("credentials");
  if (!(file instanceof File) || file.size > 20_000) return Response.json({ error: "file" }, { status: 400 });
  try { await saveGscConfig(await file.text()); return Response.json({ ok: true }); } catch { return Response.json({ error: "invalid" }, { status: 400 }); }
}
