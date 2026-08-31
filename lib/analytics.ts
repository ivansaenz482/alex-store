import "server-only";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "analytics.json");

export interface AnalyticsModel {
  visits: Record<string, number>;
  productViews: Record<string, number>;
  daily: Record<string, Record<string, number>>;
}

const empty: AnalyticsModel = { visits: {}, productViews: {}, daily: {} };

async function read(): Promise<AnalyticsModel> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const p = JSON.parse(raw) as Partial<AnalyticsModel>;
    return {
      visits: p.visits ?? {},
      productViews: p.productViews ?? {},
      daily: p.daily ?? {},
    };
  } catch {
    return empty;
  }
}

async function write(a: AnalyticsModel): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(a, null, 2), "utf8");
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
