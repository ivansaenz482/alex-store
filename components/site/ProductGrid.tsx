"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Category } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  onView,
}: {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  onView: (product: Product) => void;
}) {
  const filters = [
    { id: "todos", name: "Todos", emoji: "✨" },
    ...categories.map((c) => ({ id: c.id, name: c.name, emoji: c.emoji })),
  ];

  const visible =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  return (
    <section id="catalogo" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-volt">
          Catálogo completo
        </p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">
          Todo lo que <span className="brand-text">tenemos para ti</span>
        </h2>
      </div>

      <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectCategory(f.id)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
              activeCategory === f.id
                ? "border-volt bg-volt text-background"
                : "border-white/12 bg-white/5 text-white/70 hover:border-white/30"
            )}
          >
            {f.emoji} {f.name}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-white/50">
          No hay productos en esta categoría todavía. Muy pronto...
        </p>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div layout key={p.id} exit={{ opacity: 0, scale: 0.9 }}>
                <ProductCard
                  product={p}
                  category={categories.find((c) => c.id === p.categoryId)}
                  index={i}
                  onView={() => onView(p)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
