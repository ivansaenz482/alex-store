import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { StoreData } from "./types";
import { supabase, isSupabaseConfigured } from "./db";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

async function localRead(): Promise<StoreData> {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as Partial<StoreData>;
  return parsed as StoreData;
}

async function localWrite(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function cloudRead(): Promise<StoreData> {
  const { data, error } = await supabase()
    .from("app_state")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (data?.data) return data.data as StoreData;

  // Primera vez: se siembra desde el archivo local (datos de muestra)
  const seed = await localRead();
  await cloudWrite(seed);
  return seed;
}

async function cloudWrite(data: StoreData): Promise<void> {
  const { error } = await supabase()
    .from("app_state")
    .upsert({ id: 1, data }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function readStore(): Promise<StoreData> {
  if (isSupabaseConfigured) return cloudRead();
  return localRead();
}

export async function writeStore(data: StoreData): Promise<void> {
  if (isSupabaseConfigured) {
    await cloudWrite(data);
    return;
  }
  await localWrite(data);
}
