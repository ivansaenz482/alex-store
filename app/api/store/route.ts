import { type NextRequest } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import type { StoreData } from "@/lib/types";

export async function GET() {
  const data = await readStore();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!validateToken(token)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: StoreData;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body || !Array.isArray(body.products) || !Array.isArray(body.categories)) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await writeStore(body);
  return Response.json({ ok: true });
}
