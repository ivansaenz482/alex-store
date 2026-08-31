import "server-only";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "alexstore";
const SECRET = process.env.ADMIN_SECRET || "alex-store-secret-2026";
export const COOKIE_NAME = "alex_admin";

function hash(value: string): string {
  return crypto.createHash("sha256").update(`${value}::${SECRET}`).digest("hex");
}

export function verifyPassword(password: string): boolean {
  if (!password) return false;
  return hash(password) === hash(ADMIN_PASSWORD);
}

export function adminToken(): string {
  return hash(ADMIN_PASSWORD);
}

export function validateToken(token: string | null | undefined): boolean {
  return !!token && token === adminToken();
}
