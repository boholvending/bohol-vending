import config from "../../../../keystatic.config";
import { makeRouteHandler } from "@keystatic/next/route-handler";
import { adminCookie, sameOrigin, validSession } from "@/lib/admin-auth";
import { convertCmsImages } from "@/lib/webp-processor.mjs";

const handler = makeRouteHandler({ config });
function authorized(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${adminCookie}=`))?.slice(adminCookie.length + 1);
  return validSession(cookie);
}
export async function GET(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  return handler.GET(request);
}
export async function POST(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      const payload = await convertCmsImages(await request.json());
      const headers = new Headers(request.headers);
      headers.delete("content-length");
      return handler.POST(new Request(request.url, { method: "POST", headers, body: JSON.stringify(payload) }));
    } catch {
      return new Response("图片处理失败，请使用有效图片（最大 30 MB）后重新保存。", { status: 400 });
    }
  }
  return handler.POST(request);
}
