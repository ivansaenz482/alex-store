import { type NextRequest, NextResponse } from "next/server";
import { verifyPassword, adminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const forwarded = request.headers.get("x-forwarded-proto") ?? "";
  const isHttps = request.url.startsWith("https") || forwarded.includes("https");

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isHttps,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
