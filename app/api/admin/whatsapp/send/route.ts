import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookie, adminUrl, sameOrigin, validSession } from "@/lib/admin-auth";
import { whatsappConfig } from "@/lib/social-integrations";
import { saveWhatsappMessage } from "@/lib/whatsapp-messages";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!validSession((await cookies()).get(adminCookie)?.value)) return new Response("Unauthorized", { status: 401 });
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const form = await request.formData();
  const to = String(form.get("to") || "").replace(/\D/g, "").slice(0, 20);
  const body = String(form.get("message") || "").trim().slice(0, 4000);
  const config = whatsappConfig();
  if (!config.configured || !to || !body) return NextResponse.redirect(adminUrl(request, "/bohol-control-7e9c2f/social?whatsapp=invalid"), 303);
  const response = await fetch(`https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body } }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("WhatsApp send failed", response.status, (await response.text()).slice(0, 1000));
    return NextResponse.redirect(adminUrl(request, "/bohol-control-7e9c2f/social?whatsapp=failed"), 303);
  }
  const result = await response.json() as { messages?: { id?: string }[] };
  await saveWhatsappMessage({ id: result.messages?.[0]?.id, direction: "outgoing", contact: to, type: "text", text: body, status: "accepted" });
  return NextResponse.redirect(adminUrl(request, "/bohol-control-7e9c2f/social?whatsapp=sent"), 303);
}
