import "server-only";
import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "alexstore";
const SECRET = process.env.ADMIN_SECRET || "alex-store-secret-2026";
export const COOKIE_NAME = "alex_admin";

const LOCAL_FILE = path.join(process.cwd(), "data", "admin-hash.txt");

function hash(value: string): string {
  return crypto.createHash("sha256").update(`${value}::${SECRET}`).digest("hex");
}

async function getStoredHash(): Promise<string | null> {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase()
        .storage.from("config")
        .download("admin-hash.txt");
      if (error) return null;
      return (await data.text()).trim() || null;
    }
    const txt = await fs.readFile(LOCAL_FILE, "utf8");
    return txt.trim() || null;
  } catch {
    return null;
  }
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const h = hash(newPassword);
  if (isSupabaseConfigured) {
    const { error } = await supabase()
      .storage.from("config")
      .upload("admin-hash.txt", h, { contentType: "text/plain", upsert: true });
    if (error) throw new Error(error.message);
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, h, "utf8");
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const expected = (await getStoredHash()) ?? hash(ADMIN_PASSWORD);
  return hash(password) === expected;
}

export async function currentAdminToken(): Promise<string> {
  return (await getStoredHash()) ?? hash(ADMIN_PASSWORD);
}

export async function validateToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  return token === (await currentAdminToken());
}
