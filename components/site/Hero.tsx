"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui";
import { Marquee } from "./Marquee";
import { whatsappLink } from "@/lib/utils";

export function Hero({
  storeName,
  slogan,
  whatsapp,
}: {
  storeName: string;
  slogan: string;
  whatsapp: { number: string; message: string };
}) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-28"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-volt/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-aqua/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-volt/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl text-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          <Sparkles size={14} className="text-volt" />
          {storeName}
        </span>

        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          CAMISAS Y{" "}
          <span className="brand-text">PERFUMES</span>{" "}
          QUE IMPACTAN
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 sm:text-xl">
          {slogan}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#catalogo">
            <Button variant="volt" className="w-full sm:w-auto">
              Ver catálogo <ArrowRight size={16} />
            </Button>
          </a>
          <a
            href={whatsappLink(whatsapp.number, whatsapp.message)}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              📲 Pedir por WhatsApp
            </Button>
          </a>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-background/60 py-4 backdrop-blur">
        <Marquee>
          {[
            "CAMISAS ORIGINALES",
            "PERFUMES DE LUJO",
            "TODAS LAS TALLAS",
            "ENVÍOS A TODO EL PAÍS",
            "MEJORES PRECIOS",
            "PAGO SEGURO",
          ].map((t) => (
            <span
              key={t}
              className="mx-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white/50"
            >
              {t} <span className="text-volt">✺</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
