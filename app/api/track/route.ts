import { type NextRequest } from "next/server";
import { trackVisit, trackProduct } from "@/lib/analytics";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const admin = request.cookies.get(COOKIE_NAME)?.value;
  if (validateToken(admin)) {
    return Response.json({ ok: true });
  }

  const body = await request.json().catch(() => ({}));

  if (body?.kind === "product" && typeof body.productId === "string") {
    try {
      await trackProduct(body.productId);
    } catch {
      /* no romper la navegación por un error de tracking */
    }
  } else if (body?.kind === "visit") {
    try {
      await trackVisit();
    } catch {
      /* no romper la navegación */
    }
  }

  return Response.json({ ok: true });
}
