import { type NextRequest } from "next/server";
import { saveSubscription } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const sub = body?.subscription;

  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return Response.json({ error: "Suscripción inválida" }, { status: 400 });
  }

  await saveSubscription({
    endpoint: String(sub.endpoint),
    keys: {
      p256dh: String(sub.keys.p256dh),
      auth: String(sub.keys.auth),
    },
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return Response.json({ ok: true });
}
