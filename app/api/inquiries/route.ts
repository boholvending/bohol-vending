import { NextRequest, NextResponse } from "next/server";
import { readInquiries, saveInquiry } from "@/lib/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (limited(ip)) return NextResponse.json({ success: false, message: "Too many submissions" }, { status: 429 });
  const form = await request.formData();
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
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Submission failed" }, { status: 400 });
  }
}

export async function GET() {
  const inquiries = await readInquiries();
  return NextResponse.json({ inquiries });
}
