"use client";
import { motion } from "framer-motion";
import { X, Share, PlusSquare, Download } from "lucide-react";

export function IosInstallHelp({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
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
