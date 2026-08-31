import { type NextRequest } from "next/server";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return Response.json({ authenticated: validateToken(token) });
}
