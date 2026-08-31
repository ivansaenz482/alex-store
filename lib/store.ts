import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { StoreData } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

const seed: StoreData = {
  store: {
    name: "ALEX.STORE",
    slogan: "Estilo que se nota, precio que se agradece.",
    announcement:
      "🔥 Envíos a todo el país · Camisas de fútbol y perfumes originales · Aceptamos pagos por transferencia 💳",
    description: "Tu tienda de camisas de fútbol y perfumes.",
    instagram: "alex.store",
    tiktok: "alex.store",
    email: "ventas@alexstore.com",
  },
  whatsapp: {
    number: "+521234567890",
    message: "Hola ALEX.STORE 👋, quiero más información sobre sus productos.",
  },
  categories: [],
  promotions: [],
  products: [],
};

export async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      store: { ...seed.store, ...(parsed.store ?? {}) },
      whatsapp: { ...seed.whatsapp, ...(parsed.whatsapp ?? {}) },
      categories: parsed.categories ?? [],
      promotions: parsed.promotions ?? [],
      products: parsed.products ?? [],
    };
  } catch {
    return seed;
  }
}

export async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}
