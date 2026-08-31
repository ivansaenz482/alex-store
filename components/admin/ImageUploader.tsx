"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";

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
            className="relative aspect-square overflow-hidden rounded-xl border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
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
        <Upload size={12} /> JPG, PNG, WEBP, GIF o AVIF · máx 8MB
      </p>
    </div>
  );
}
