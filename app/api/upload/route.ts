import { type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

function sanitize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!validateToken(token)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No hay archivo" }, { status: 400 });
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return Response.json(
      { error: "Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF." },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "La imagen supera 8MB" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}-${sanitize(file.name.replace(/\.\w+$/, ""))}${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, name), buffer);

  return Response.json({ url: `/uploads/${name}` });
}
