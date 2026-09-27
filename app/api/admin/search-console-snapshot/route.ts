import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cookies } from "next/headers";
import { adminCookie, validSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = (await cookies()).get(adminCookie)?.value;
  if (!validSession(session)) return new Response("Unauthorized", { status: 401 });

  try {
    const image = await readFile(join(process.cwd(), "private-assets", "admin", "google-search-console-performance-2026-09-24.png"));
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Snapshot unavailable", { status: 404 });
  }
}
