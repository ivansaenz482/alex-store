"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "./ui";
import { whatsappLink } from "@/lib/utils";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Categorías", href: "#categorias" },
  { label: "Destacados", href: "#destacados" },
  { label: "Catálogo", href: "#catalogo" },
];

export function Navbar({
  announcement,
  whatsapp,
}: {
  announcement?: string;
  whatsapp: { number: string; message: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {announcement && (
        <div className="brand-bg bg-[length:200%_200%] px-4 py-2 text-center text-xs font-bold text-background sm:text-sm">
          {announcement}
        </div>
      )}
      <div className="glass border-b border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#inicio" className="flex items-center gap-1.5 text-xl font-extrabold">
            <span className="text-volt">A</span>
            <span className="brand-text">LEX.STORE</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href={whatsappLink(whatsapp.number, whatsapp.message)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="volt" className="px-5 py-2.5 text-xs">
                📲 Pedir ahora
              </Button>
            </a>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass border-b border-white/8 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={whatsappLink(whatsapp.number, whatsapp.message)}
                target="_blank"
                rel="noreferrer"
                className="mt-2"
              >
                <Button variant="volt" className="w-full">
                  📲 Pedir por WhatsApp
                </Button>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
