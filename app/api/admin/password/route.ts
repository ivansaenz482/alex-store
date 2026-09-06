import { type NextRequest } from "next/server";
import { validateToken, verifyPassword, setAdminPassword, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!(await validateToken(token))) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { current, next } = await request.json().catch(() => ({ current: "", next: "" }));

  if (typeof current !== "string" || typeof next !== "string") {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }
  if (!next || next.length < 6) {
    return Response.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }
  if (!(await verifyPassword(current))) {
    return Response.json({ error: "La contraseña actual es incorrecta" }, { status: 401 });
  }

  try {
    await setAdminPassword(next);
  } catch (e) {
    return Response.json({ error: "No se pudo guardar: " + (e as Error).message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
