"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { DownloadCloud, Upload, Loader2, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/site/ui";

export function BackupPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setRestoring(true);
    setStatus(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/backup/restore", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ ok: true, msg: "Backup restaurado. Recargando la tienda..." });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setStatus({ ok: false, msg: data.error ?? "No se pudo restaurar" });
      }
    } catch {
      setStatus({ ok: false, msg: "Error de conexión al restaurar" });
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Respaldo de la tienda</h2>
        <p className="mt-1 text-sm text-white/50">
          Descarga una copia de tus productos, estadísticas y fotos, o restaura una guardada.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-2xl border border-white/8 bg-white/3 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold">Descargar backup</h3>
            <p className="mt-1 text-sm text-white/50">
              Genera un archivo <code className="text-volt">.tar.gz</code> con todo y guárdalo.
            </p>
          </div>
          <Button
            variant="volt"
            className="shrink-0 px-4 py-2.5 text-xs"
            onClick={() => setDownloading(true)}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <DownloadCloud size={15} />
            )}
            Descargar
          </Button>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold">Restaurar backup</h3>
            <p className="mt-1 text-sm text-white/50">
              Sube un <code className="text-volt">.tar.gz</code> previamente descargado para
              restablecer productos, fotos y estadísticas.
            </p>
            <p className="mt-2 text-xs text-amber-300/80">
              ⚠️ Reemplazará el contenido actual de la tienda.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 px-4 py-2.5 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={restoring}
          >
            {restoring ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            Subir backup
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".tar.gz,.tgz,application/gzip"
          hidden
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {status && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              status.ok
                ? "bg-volt/10 text-volt"
                : "bg-magenta/10 text-magenta"
            }`}
          >
            {status.ok ? <Check size={16} /> : <AlertTriangle size={16} />}
            {status.msg}
          </div>
        )}
      </motion.div>

      <p className="text-xs text-white/35">
        Los backups también se crean automáticamente cada día en tu GitHub (workflow “Backup”).
      </p>
    </div>
  );
}
