"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePwaInstall } from "./usePwaInstall";
import { IosInstallHelp } from "./IosInstallHelp";

export function InstallPwaButton({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const { canInstall, isIos, install } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (!canInstall) return null;

  async function handleClick() {
    if (isIos) {
      setShowHelp(true);
      return;
    }
    await install();
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
