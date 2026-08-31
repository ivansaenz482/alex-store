import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./db";

const FILE = path.join(process.cwd(), "data", "analytics.json");

export interface AnalyticsModel {
  visits: Record<string, number>;
  productViews: Record<string, number>;
  daily: Record<string, Record<string, number>>;
}

const empty: AnalyticsModel = { visits: {}, productViews: {}, daily: {} };

async function localRead(): Promise<AnalyticsModel> {
  try {
    const p = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<AnalyticsModel>;
    return {
      visits: p.visits ?? {},
      productViews: p.productViews ?? {},
      daily: p.daily ?? {},
    };
  } catch {
    return empty;
  }
}

async function localWrite(a: AnalyticsModel): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(a, null, 2), "utf8");
}

async function cloudRead(): Promise<AnalyticsModel> {
  const { data, error } = await supabase()
    .from("analytics_state")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const a = (data?.data as AnalyticsModel) ?? empty;
  return { visits: a.visits ?? {}, productViews: a.productViews ?? {}, daily: a.daily ?? {} };
}

async function cloudWrite(a: AnalyticsModel): Promise<void> {
  const { error } = await supabase()
    .from("analytics_state")
    .upsert({ id: 1, data: a }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

function read(): Promise<AnalyticsModel> {
  return isSupabaseConfigured ? cloudRead() : localRead();
}
function write(a: AnalyticsModel): Promise<void> {
  return isSupabaseConfigured ? cloudWrite(a) : localWrite(a);
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getAnalyticsModel(): Promise<AnalyticsModel> {
  return read();
}

export async function trackVisit(): Promise<void> {
  const a = await read();
  const today = isoDate(new Date());
  a.visits[today] = (a.visits[today] ?? 0) + 1;
  await write(a);
}

export async function trackProduct(productId: string): Promise<void> {
  const a = await read();
  const today = isoDate(new Date());
  a.productViews[productId] = (a.productViews[productId] ?? 0) + 1;
  a.daily[today] = a.daily[today] ?? {};
  a.daily[today][productId] = (a.daily[today][productId] ?? 0) + 1;
  await write(a);
}

export async function clearAnalytics(): Promise<void> {
  await write({ visits: {}, productViews: {}, daily: {} });
}
