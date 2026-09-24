"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import { QrCode, X, Download, Share2, Link2, Check } from "lucide-react";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function ShareQr({
  storeName,
  className,
}: {
  storeName: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setUrl(`${window.location.origin}/`),
      0
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await QRCode.toCanvas(canvas, url, {
        width: 560,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#050507", light: "#ffffff" },
      });

      try {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = "/icons/icon-192.png";
        await logo.decode();
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const s = 104;
          const x = (canvas.width - s) / 2;
          const y = (canvas.height - s) / 2;
          ctx.fillStyle = "#ffffff";
          roundRect(ctx, x - 10, y - 10, s + 20, s + 20, 18);
          ctx.fill();
          ctx.drawImage(logo, x, y, s, s);
        }
      } catch {
        // si el logo no carga, el QR igual funciona
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, url]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "alex-store-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // sin portapapeles
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: `Mira ${storeName}`,
          url,
        });
        return;
      } catch {
        // cancelado por el usuario
      }
    }
    copy();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/80 transition-colors hover:border-volt hover:text-volt"
        }
      >
        <QrCode size={16} /> Compartir QR
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-t-3xl border border-white/10 bg-surface p-6 sm:rounded-3xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-extrabold">Comparte esta tienda</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="rounded-2xl bg-white p-3">
                  <canvas
                    ref={canvasRef}
                    className="h-auto w-full max-w-[260px] rounded-lg"
                  />
                </div>
                <p className="mt-3 max-w-full truncate text-center text-xs text-white/50">
                  {url}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={download}
                  disabled={!ready}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-3 text-sm font-bold text-background transition-all hover:bg-volt-soft disabled:opacity-50"
                >
                  <Download size={16} /> Descargar QR (para imprimir)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-volt hover:text-volt"
                  >
                    <Share2 size={16} /> Compartir
                  </button>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-volt hover:text-volt"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-volt" /> Copiado
                      </>
                    ) : (
                      <>
                        <Link2 size={16} /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-white/40">
                Imprímelo y pégalo donde quieras. Tus clientes lo escanean y
                entran a la tienda.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
