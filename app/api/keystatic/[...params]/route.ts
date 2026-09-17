import config from "../../../../keystatic.config";
import { makeRouteHandler } from "@keystatic/next/route-handler";
import { adminCookie, sameOrigin, validSession } from "@/lib/admin-auth";

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
  return handler.POST(request);
}
