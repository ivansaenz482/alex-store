import { type NextRequest } from "next/server";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import { countSubscriptions, getVapidKeys, sendToAll } from "@/lib/push";

export const dynamic = "force-dynamic";

async function authorized(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return validateToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  const keys = await getVapidKeys();
  return Response.json({
    enabled: Boolean(keys),
    subscribers: await countSubscriptions(),
  });
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const message = String(body?.body ?? "").trim();
  const url = body?.url ? String(body.url) : "/";

  if (!title || !message) {
    return Response.json(
      { error: "El título y el mensaje son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const result = await sendToAll({
      title,
      body: message,
      url,
      icon: "/api/pwa-icon?size=192",
      badge: "/api/pwa-icon?size=96",
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message ?? "No se pudo enviar" },
      { status: 500 }
    );
  }
}
