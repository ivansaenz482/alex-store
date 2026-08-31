import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { type NextRequest } from "next/server";
import { x as extract } from "tar";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function replaceDir(src: string, dst: string): Promise<void> {
  await fs.rm(dst, { recursive: true, force: true });
  await fs.cp(src, dst, { recursive: true, force: true });
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

  const id = Date.now();
  const staging = path.join(os.tmpdir(), `alex-restore-${id}`);
  const tmpFile = path.join(os.tmpdir(), `alex-restore-${id}.tar.gz`);

  await fs.mkdir(staging, { recursive: true });
  await fs.writeFile(tmpFile, Buffer.from(await file.arrayBuffer()));

  try {
    await extract({ file: tmpFile, cwd: staging });

    const srcData = path.join(staging, "data");
    const srcUploads = path.join(staging, "public", "uploads");
    const hasData = await exists(srcData);
    const hasUploads = await exists(srcUploads);

    if (!hasData && !hasUploads) {
      return Response.json(
        { error: "El archivo no es un backup válido de ALEX.STORE" },
        { status: 400 }
      );
    }

    if (hasData) {
      const storeJson = path.join(srcData, "store.json");
      if (await exists(storeJson)) {
        JSON.parse(await fs.readFile(storeJson, "utf8")); // valida que sea un JSON correcto
      }
      await replaceDir(srcData, path.join(process.cwd(), "data"));
    }

    if (hasUploads) {
      await replaceDir(srcUploads, path.join(process.cwd(), "public", "uploads"));
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: "No se pudo restaurar el backup: " + (e as Error).message },
      { status: 400 }
    );
  } finally {
    await fs.rm(staging, { recursive: true, force: true }).catch(() => {});
    await fs.rm(tmpFile, { force: true }).catch(() => {});
  }
}
