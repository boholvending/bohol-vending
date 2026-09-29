import { createHmac, timingSafeEqual } from "node:crypto";
import { whatsappConfig } from "@/lib/social-integrations";
import { saveWhatsappMessage, saveWhatsappStatus } from "@/lib/whatsapp-messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WaContact = { wa_id?: unknown; profile?: { name?: unknown } };
type WaMessage = { id?: unknown; from?: unknown; timestamp?: unknown; type?: unknown; text?: { body?: unknown } } & Record<string, unknown>;
type WaStatus = { id?: unknown; recipient_id?: unknown; status?: unknown; timestamp?: unknown };
type WaValue = { contacts?: WaContact[]; messages?: WaMessage[]; statuses?: WaStatus[] };
type WaPayload = { entry?: { changes?: { value?: WaValue }[] }[] };

export async function GET(request: Request) {
  const { verifyToken } = whatsappConfig();
  const url = new URL(request.url);
  if (verifyToken && url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === verifyToken) {
    return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

function validSignature(body: string, supplied: string | null, secret: string) {
  if (!supplied?.startsWith("sha256=") || !secret) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const actual = supplied.slice(7);
  return /^[a-f0-9]{64}$/.test(actual) && timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 1024 * 1024) return new Response("Payload too large", { status: 413 });
  const body = await request.text();
  const { appSecret } = whatsappConfig();
  if (!validSignature(body, request.headers.get("x-hub-signature-256"), appSecret)) return new Response("Forbidden", { status: 403 });
  let payload: WaPayload;
  try { payload = JSON.parse(body) as WaPayload; } catch { return new Response("Invalid JSON", { status: 400 }); }
  const changes = Array.isArray(payload.entry) ? payload.entry.flatMap((entry) => Array.isArray(entry.changes) ? entry.changes : []) : [];
  for (const change of changes) {
    const value = change?.value;
    const contacts = new Map<string, string>((value?.contacts || []).map((contact) => [String(contact.wa_id || ""), String(contact.profile?.name || "")]));
    for (const message of value?.messages || []) {
      const type = String(message?.type || "unknown");
      const typedContent = message[type] as { caption?: unknown } | undefined;
      const text = type === "text" ? String(message.text?.body || "") : String(typedContent?.caption || `[${type}]`);
      await saveWhatsappMessage({
        id: String(message.id || ""),
        createdAt: message?.timestamp ? new Date(Number(message.timestamp) * 1000).toISOString() : new Date().toISOString(),
        direction: "incoming",
        contact: String(message.from || ""),
        contactName: contacts.get(String(message?.from || "")) || "",
        type,
        text,
        status: "received",
      });
    }
    for (const status of value?.statuses || []) {
      await saveWhatsappStatus({ id: String(status?.id || ""), contact: String(status?.recipient_id || ""), status: String(status?.status || ""), createdAt: status?.timestamp ? new Date(Number(status.timestamp) * 1000).toISOString() : new Date().toISOString() });
    }
  }
  return new Response("EVENT_RECEIVED", { status: 200 });
}
