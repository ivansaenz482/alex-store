"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoriesSection({
  categories,
  onSelect,
}: {
  categories: Category[];
  onSelect: (id: string) => void;
}) {
  return (
    <section id="categorias" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex items-end justify-between sm:mb-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-volt">
            Explora
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">
            Categorías <span className="brand-text">de la tienda</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onClick={() => onSelect(cat.id)}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-surface p-6 text-left transition-all hover:border-white/20"
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
              style={{ background: cat.accent }}
            />
            {cat.image && (
              <div className="relative mb-5 h-40 w-full overflow-hidden rounded-xl border border-white/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/10 to-transparent" />
              </div>
            )}
            <div className="relative flex items-center justify-between">
              <span className={cat.image ? "text-3xl" : "text-5xl"}>{cat.emoji}</span>
              <ArrowUpRight className="text-white/40 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <div className="relative mt-5">
              <h3 className="text-xl font-bold">{cat.name}</h3>
              <p className="mt-1 text-sm text-white/60">{cat.description}</p>
              <span
                className="mt-4 inline-block h-1 w-10 rounded-full"
                style={{ background: cat.accent }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
