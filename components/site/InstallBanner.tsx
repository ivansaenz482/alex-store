"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Sparkles } from "lucide-react";
import { usePwaInstall } from "./usePwaInstall";
import { IosInstallHelp } from "./IosInstallHelp";

const DISMISS_KEY = "pwa-install-dismissed-at";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function InstallBanner() {
  const { canInstall, isIos, install } = usePwaInstall();
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!canInstall) return;
    let dismissed = 0;
    try {
      dismissed = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    } catch {
      dismissed = 0;
    }
    if (Date.now() - dismissed < WEEK) return;
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, [canInstall]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // sin localStorage
    }
  }

  async function handleInstall() {
    if (isIos) {
      setShowHelp(true);
      return;
    }
    const outcome = await install();
    if (outcome !== "unavailable") dismiss();
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-x-3 bottom-[84px] z-40 md:inset-x-auto md:bottom-6 md:left-6 md:w-[360px]"
          >
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-volt/25 bg-surface/95 p-3.5 shadow-[0_20px_60px_-20px_rgba(57,255,20,0.55)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-volt/20 blur-2xl" />

              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-volt/30 bg-volt/10 text-volt">
                <Download size={20} />
              </span>

              <div className="relative min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-extrabold">
                  Instala ALEX.STORE
                  <Sparkles size={13} className="text-volt" />
                </p>
                <p className="mt-0.5 text-xs leading-snug text-white/60">
                  {isIos
                    ? "Añádela a tu pantalla de inicio y úsala como app."
                    : "Úsala como app nativa, más rápida y sin abrir el navegador."}
                </p>
                <button
                  onClick={handleInstall}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-volt px-4 py-1.5 text-xs font-bold text-background transition-colors hover:bg-volt-soft"
                >
                  <Download size={13} /> Instalar ahora
                </button>
              </div>

              <button
                onClick={dismiss}
                className="relative flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && <IosInstallHelp onClose={() => setShowHelp(false)} />}
      </AnimatePresence>
    </>
  );
}
