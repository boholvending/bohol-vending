import { mkdir, readFile, appendFile } from "node:fs/promises";
import { dirname } from "node:path";

export type Inquiry = {
  id: string;
  createdAt: string;
  source: "quote-form" | "chat-contact";
  name: string;
  email: string;
  company: string;
  market: string;
  machine: string;
  quantity: string;
  timeline: string;
  message: string;
  pageUrl: string;
  pageTitle: string;
  product: string;
  previousPage: string;
  entryPage: string;
  referrer: string;
  userAgent: string;
  ip: string;
};

const storageFile = process.env.BOHOL_INQUIRIES_FILE || "/var/lib/bohol-vending/inquiries.jsonl";

function clean(value: unknown, max = 3000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function saveInquiry(input: Partial<Inquiry>) {
  const inquiry: Inquiry = {
    id: `${Date.now().toString(36)}-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    source: input.source === "chat-contact" ? "chat-contact" : "quote-form",
    name: clean(input.name, 120),
    email: clean(input.email, 180).toLowerCase(),
    company: clean(input.company, 160),
    market: clean(input.market, 120),
    machine: clean(input.machine, 160),
    quantity: clean(input.quantity, 80),
    timeline: clean(input.timeline, 120),
    message: clean(input.message),
    pageUrl: clean(input.pageUrl, 500),
    pageTitle: clean(input.pageTitle, 220),
    product: clean(input.product, 160),
    previousPage: clean(input.previousPage, 500),
    entryPage: clean(input.entryPage, 500),
    referrer: clean(input.referrer, 500),
    userAgent: clean(input.userAgent, 500),
    ip: clean(input.ip, 80),
  };
  if (!inquiry.name || !inquiry.email || !inquiry.message) throw new Error("Missing required fields");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) throw new Error("Invalid email");
  await mkdir(dirname(storageFile), { recursive: true });
  await appendFile(/*turbopackIgnore: true*/ storageFile, `${JSON.stringify(inquiry)}\n`, "utf8");
  return inquiry;
}

export async function readInquiries(limit = 80) {
  try {
    const text = await readFile(/*turbopackIgnore: true*/ storageFile, "utf8");
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as Inquiry).reverse().slice(0, limit);
  } catch {
    return [];
  }
}
