import "server-only";
import { promises as fs } from "fs";
import path from "path";
import webpush from "web-push";
import { supabase, isSupabaseConfigured } from "./db";

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: string;
  userAgent?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}

const FILE = path.join(process.cwd(), "data", "push-subscriptions.json");
const VAPID_FILE = path.join(process.cwd(), "data", "vapid.json");
const BUCKET = "config";

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

let cachedKeys: VapidKeys | null = null;

function subject(): string {
  return process.env.VAPID_SUBJECT || "mailto:ventas@alexstore.com";
}

// ── Claves VAPID (env → Supabase Storage → archivo local → generar) ──────

async function readVapidCloud(): Promise<VapidKeys | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase().storage.from(BUCKET).download("vapid.json");
    if (error) return null;
    const parsed = JSON.parse(await data.text()) as VapidKeys;
    return parsed.publicKey && parsed.privateKey ? parsed : null;
  } catch {
    return null;
  }
}

async function writeVapidCloud(keys: VapidKeys): Promise<void> {
  const { error } = await supabase()
    .storage.from(BUCKET)
    .upload("vapid.json", JSON.stringify(keys), {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw new Error(error.message);
}

export async function getVapidKeys(): Promise<VapidKeys | null> {
  const envPublic = process.env.VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;
  if (envPublic && envPrivate) return { publicKey: envPublic, privateKey: envPrivate };

  if (cachedKeys) return cachedKeys;

  const cloud = await readVapidCloud();
  if (cloud) {
    cachedKeys = cloud;
    return cloud;
  }

  try {
    const raw = JSON.parse(await fs.readFile(VAPID_FILE, "utf8")) as VapidKeys;
    if (raw.publicKey && raw.privateKey) {
      cachedKeys = raw;
      return raw;
    }
  } catch {
    // sin archivo todavía
  }

  const generated = webpush.generateVAPIDKeys();
  if (isSupabaseConfigured) {
    try {
      await writeVapidCloud(generated);
    } catch {
      return null;
    }
  } else {
    try {
      await fs.mkdir(path.dirname(VAPID_FILE), { recursive: true });
      await fs.writeFile(VAPID_FILE, JSON.stringify(generated, null, 2), "utf8");
    } catch {
      return null;
    }
  }
  cachedKeys = generated;
  return generated;
}

// ── Suscriptores (Supabase Storage o archivo local) ─────────────────────

async function localRead(): Promise<PushSubscriptionRecord[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed) ? (parsed as PushSubscriptionRecord[]) : [];
  } catch {
    return [];
  }
}

async function localWrite(list: PushSubscriptionRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

async function cloudRead(): Promise<PushSubscriptionRecord[]> {
  try {
    const { data, error } = await supabase()
      .storage.from(BUCKET)
      .download("push-subscriptions.json");
    if (error) return [];
    const parsed = JSON.parse(await data.text());
    return Array.isArray(parsed) ? (parsed as PushSubscriptionRecord[]) : [];
  } catch {
    return [];
  }
}

async function cloudWrite(list: PushSubscriptionRecord[]): Promise<void> {
  const { error } = await supabase()
    .storage.from(BUCKET)
    .upload("push-subscriptions.json", JSON.stringify(list), {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw new Error(error.message);
}

function read(): Promise<PushSubscriptionRecord[]> {
  return isSupabaseConfigured ? cloudRead() : localRead();
}

function write(list: PushSubscriptionRecord[]): Promise<void> {
  return isSupabaseConfigured ? cloudWrite(list) : localWrite(list);
}

export async function countSubscriptions(): Promise<number> {
  return (await read()).length;
}

export async function saveSubscription(
  record: Omit<PushSubscriptionRecord, "createdAt">
): Promise<void> {
  const list = await read();
  const index = list.findIndex((item) => item.endpoint === record.endpoint);
  if (index >= 0) {
    list[index] = { ...list[index], ...record, createdAt: list[index].createdAt };
  } else {
    list.push({ ...record, createdAt: new Date().toISOString() });
  }
  await write(list);
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const list = await read();
  await write(list.filter((item) => item.endpoint !== endpoint));
}

export async function sendToAll(
  payload: PushPayload
): Promise<{ sent: number; failed: number; total: number }> {
  const keys = await getVapidKeys();
  if (!keys) throw new Error("Notificaciones push no configuradas");

  webpush.setVapidDetails(subject(), keys.publicKey, keys.privateKey);

  const subscriptions = await read();
  let sent = 0;
  let failed = 0;
  const dead: string[] = [];

  await Promise.all(
    subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(
          { endpoint: item.endpoint, keys: item.keys },
          JSON.stringify(payload)
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) dead.push(item.endpoint);
      }
    })
  );

  if (dead.length > 0) {
    const current = await read();
    await write(current.filter((item) => !dead.includes(item.endpoint)));
  }

  return { sent, failed, total: subscriptions.length };
}
