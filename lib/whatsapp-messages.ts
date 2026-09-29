import { appendFile, mkdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export type WhatsappMessage = {
  id: string;
  createdAt: string;
  direction: "incoming" | "outgoing";
  contact: string;
  contactName: string;
  type: string;
  text: string;
  status: string;
};

export type WhatsappMessageStore = {
  messages: WhatsappMessage[];
  hasMore: boolean;
  skippedRecords: number;
  readError: string;
};

const storageFile = process.env.BOHOL_WHATSAPP_MESSAGES_FILE || join(homedir(), ".local", "share", "bohol-vending", "whatsapp-messages.jsonl");

function clean(value: unknown, max = 4000) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

export async function saveWhatsappMessage(input: Partial<WhatsappMessage>) {
  const message: WhatsappMessage = {
    id: clean(input.id, 220) || crypto.randomUUID(),
    createdAt: input.createdAt || new Date().toISOString(),
    direction: input.direction === "outgoing" ? "outgoing" : "incoming",
    contact: clean(input.contact, 40),
    contactName: clean(input.contactName, 160),
    type: clean(input.type, 40) || "text",
    text: clean(input.text),
    status: clean(input.status, 40),
  };
  if (!message.contact) throw new Error("Missing WhatsApp contact");
  await enqueueWrite(async () => {
    await mkdir(dirname(storageFile), { recursive: true, mode: 0o700 });
    let existing = "";
    try { existing = await readFile(/*turbopackIgnore: true*/ storageFile, "utf8"); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const duplicate = existing.split(/\r?\n/).some((line) => {
      if (!line) return false;
      try { const saved = JSON.parse(line) as WhatsappMessage; return saved.id === message.id && saved.type !== "__status__"; } catch { return false; }
    });
    if (!duplicate) await appendFile(/*turbopackIgnore: true*/ storageFile, `${JSON.stringify(message)}\n`, { encoding: "utf8", mode: 0o600 });
  });
  return message;
}

let writeQueue = Promise.resolve();
function enqueueWrite(task: () => Promise<void>) {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

export async function saveWhatsappStatus(input: { id: string; contact: string; status: string; createdAt?: string }) {
  const record: WhatsappMessage = { id: clean(input.id, 220), createdAt: input.createdAt || new Date().toISOString(), direction: "outgoing", contact: clean(input.contact, 40), contactName: "", type: "__status__", text: "", status: clean(input.status, 40) };
  if (!record.id || !record.contact || !record.status) return;
  await enqueueWrite(async () => {
    await mkdir(dirname(storageFile), { recursive: true, mode: 0o700 });
    let existing = "";
    try { existing = await readFile(/*turbopackIgnore: true*/ storageFile, "utf8"); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const duplicate = existing.split(/\r?\n/).some((line) => {
      if (!line) return false;
      try { const saved = JSON.parse(line) as WhatsappMessage; return saved.id === record.id && saved.type === "__status__" && saved.status === record.status; } catch { return false; }
    });
    if (!duplicate) await appendFile(/*turbopackIgnore: true*/ storageFile, `${JSON.stringify(record)}\n`, { encoding: "utf8", mode: 0o600 });
  });
}

export async function readWhatsappMessages(limit = 5000): Promise<WhatsappMessageStore> {
  try {
    const text = await readFile(/*turbopackIgnore: true*/ storageFile, "utf8");
    const messages = new Map<string, WhatsappMessage>();
    const statuses = new Map<string, { status: string; createdAt: string }>();
    const statusPriority: Record<string, number> = { sent: 1, delivered: 2, read: 3, failed: 4 };
    let skippedRecords = 0;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      try {
        const record = JSON.parse(line) as WhatsappMessage;
        if (!record.id || !record.contact) { skippedRecords++; continue; }
        if (record.type === "__status__") {
          const current = statuses.get(record.id);
          const currentTime = current ? Date.parse(current.createdAt) || 0 : -1;
          const recordTime = Date.parse(record.createdAt) || 0;
          if (!current || recordTime > currentTime || (recordTime === currentTime && (statusPriority[record.status] || 0) > (statusPriority[current.status] || 0))) {
            statuses.set(record.id, { status: record.status, createdAt: record.createdAt });
          }
        }
        else if (!messages.has(record.id)) messages.set(record.id, record);
      } catch { skippedRecords++; }
    }
    const all = [...messages.values()].map((message) => statuses.has(message.id) ? { ...message, status: statuses.get(message.id)?.status || message.status } : message).reverse();
    return { messages: all.slice(0, limit), hasMore: all.length > limit, skippedRecords, readError: "" };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { messages: [], hasMore: false, skippedRecords: 0, readError: "" };
    console.error("WhatsApp message storage read failed", error);
    return { messages: [], hasMore: false, skippedRecords: 0, readError: "无法读取 WhatsApp 聊天记录，请检查服务器存储权限。" };
  }
}
