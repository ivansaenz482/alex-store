import { type NextRequest } from "next/server";
import { removeSubscription } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (body?.endpoint) {
    await removeSubscription(String(body.endpoint));
  }
  return Response.json({ ok: true });
}
