import { createReadStream, promises as fs } from "fs";
import os from "os";
import path from "path";
import { Readable } from "stream";
import { type NextRequest } from "next/server";
import { c as create } from "tar";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!validateToken(token)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const file = path.join(os.tmpdir(), `alex-store-backup-${Date.now()}.tar.gz`);

  await create(
    { gzip: true, file, cwd: process.cwd(), portable: true },
    ["data", "public/uploads"]
  );

  const stream = createReadStream(file);
  stream.on("close", () => fs.unlink(file).catch(() => {}));
  stream.on("end", () => fs.unlink(file).catch(() => {}));

  return new Response(Readable.toWeb(stream) as BodyInit, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="alex-store-backup-${stamp}.tar.gz"`,
    },
  });
}
