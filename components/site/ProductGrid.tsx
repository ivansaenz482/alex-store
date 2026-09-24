"use client";
import { useState } from "react";
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
  const [activeSub, setActiveSub] = useState("todos");

  const filters = [
    { id: "todos", name: "Todos" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const category = categories.find((c) => c.id === activeCategory);
  const subcategories = category?.subcategories ?? [];
  const validSub = subcategories.includes(activeSub) ? activeSub : "todos";

  let visible =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);
  if (validSub !== "todos") {
    visible = visible.filter((p) => p.subcategory === validSub);
  }

  return (
    <section id="catalogo" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-volt">
          Catálogo completo
        </p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">
          Todo lo que <span className="brand-text">tenemos para ti</span>
        </h2>
      </div>

      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-2 sm:mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              onSelectCategory(f.id);
              setActiveSub("todos");
            }}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
              activeCategory === f.id
                ? "border-volt bg-volt text-background"
                : "border-white/12 bg-white/5 text-white/70 hover:border-white/30"
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      {subcategories.length > 0 && (
        <div className="no-scrollbar mb-8 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-white/35">
            Filtrar:
          </span>
          {["todos", ...subcategories].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                validSub === sub
                  ? "border-volt bg-volt/15 text-volt"
                  : "border-white/12 text-white/60 hover:border-white/30"
              )}
            >
              {sub === "todos" ? "Todas" : sub}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-16 text-center text-white/50">
          No hay productos en esta categoría todavía. Muy pronto...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              category={categories.find((c) => c.id === p.categoryId)}
              index={i}
              onView={() => onView(p)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
