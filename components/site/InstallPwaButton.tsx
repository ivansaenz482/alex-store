"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaButton({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const ua = window.navigator.userAgent;
    const iosDevice =
      /iphone|ipad|ipod/i.test(ua) ||
      (ua.includes("Macintosh") && "ontouchend" in document);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const timer = window.setTimeout(() => {
      setIsIos(iosDevice);
      if (standalone) setInstalled(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = !installed && (promptEvent !== null || isIos);
  if (!canInstall) return null;

  async function handleClick() {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
      return;
    }
    setShowHelp(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-4 py-2.5 text-xs font-bold text-volt transition-all hover:bg-volt hover:text-background active:scale-[0.97]",
          fullWidth && "w-full",
          className
        )}
      >
        <Download size={15} /> Instalar app
      </button>

      <AnimatePresence>
        {showHelp && <IosInstallHelp onClose={() => setShowHelp(false)} />}
      </AnimatePresence>
    </>
  );
}

function IosInstallHelp({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-white/10 bg-surface p-6 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">Instalar ALEX.STORE</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <ol className="space-y-4 text-sm text-white/75">
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-volt/15 text-volt">
              <Share size={15} />
            </span>
            <span>
              Toca el botón <b>Compartir</b> en la barra de Safari.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-volt/15 text-volt">
              <PlusSquare size={15} />
            </span>
            <span>
              Elige <b>“Añadir a pantalla de inicio”</b>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-volt/15 text-volt">
              <Download size={15} />
            </span>
            <span>
              Confirma con <b>“Añadir”</b> y abrirás la tienda como una app.
            </span>
          </li>
        </ol>
      </motion.div>
    </motion.div>
  );
}
