import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiries";
import { sameOrigin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function clientIp(request: NextRequest) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10000) hits.clear();
  return recent.length > 6;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  const ip = clientIp(request);
  if (limited(ip)) return NextResponse.json({ success: false, message: "Too many submissions" }, { status: 429 });
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return NextResponse.json({ success: false, message: "Unsupported form" }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 32768) return NextResponse.json({ success: false, message: "Form too large" }, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ success: false, message: "Empty form" }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 32768) {
      await reader.cancel();
      return NextResponse.json({ success: false, message: "Form too large" }, { status: 413 });
    }
    chunks.push(value);
  }
  const form = await new Request(request.url, { method: "POST", headers: { "content-type": request.headers.get("content-type") || "" }, body: Buffer.concat(chunks) }).formData();
  if (String(form.get("botcheck") || "")) return NextResponse.json({ success: true });
  const value = (...names: string[]) => {
    for (const name of names) {
      const entry = form.get(name);
      if (typeof entry === "string") return entry;
    }
    return "";
  };
  try {
    const inquiry = await saveInquiry({
      source: value("Source") === "chat-contact" ? "chat-contact" : "quote-form",
      name: value("Name", "name"),
      email: value("Email", "email"),
      company: value("Company"),
      market: value("Market"),
      machine: value("Machine"),
      quantity: value("Quantity"),
      timeline: value("Timeline"),
      message: value("Requirements", "message"),
      pageUrl: value("Page URL"),
      pageTitle: value("Page title"),
      product: value("Product"),
      previousPage: value("Previous page"),
      entryPage: value("First landing page"),
      referrer: value("External referrer"),
      userAgent: request.headers.get("user-agent") || "",
      ip,
    });
    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    if (error instanceof Error && ["Missing required fields", "Invalid email"].includes(error.message)) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    console.error("Inquiry storage failed", error);
    return NextResponse.json({ success: false, message: "Submission failed" }, { status: 500 });
  }
}
