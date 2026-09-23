import { getVapidKeys } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function GET() {
  const keys = await getVapidKeys();
  return Response.json({
    enabled: Boolean(keys),
    publicKey: keys?.publicKey ?? null,
  });
}
