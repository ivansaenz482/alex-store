"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImagePlus, Loader2, Maximize2 } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  max = 8,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (uploaded.length + value.length >= max) break;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error ?? "No se pudo subir la imagen");
          continue;
        }
        const { url } = await res.json();
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url) => (
          <motion.div
            key={url}
            layout
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-surface-2"
          >
            <button
              type="button"
              onClick={() => setPreview(url)}
              className="block h-full w-full"
              aria-label="Ver imagen completa"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-contain p-1.5"
              />
              <span className="absolute inset-x-0 bottom-0 hidden items-center justify-center gap-1 bg-background/70 py-1 text-[10px] font-semibold text-white/80 backdrop-blur group-hover:flex">
                <Maximize2 size={11} /> Ver
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-white transition-colors hover:bg-magenta"
              aria-label="Eliminar"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 text-white/60 transition-colors hover:border-volt hover:text-volt"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin text-volt" />
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-[11px] font-semibold">Subir</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
        <Upload size={12} /> JPG, PNG, WEBP, GIF o AVIF · máx 8MB · toca una
        imagen para verla completa
      </p>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-white hover:bg-magenta"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              src={preview}
              alt="Vista previa"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-full rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
