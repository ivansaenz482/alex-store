"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  category,
  index,
  onView,
}: {
  product: Product;
  category?: Category;
  index: number;
  onView: () => void;
}) {
  const cat = category ?? { emoji: "🛍️", name: "Producto" };
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min((index % 4) * 0.05, 0.2) }}
      onClick={onView}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-surface transition-all hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative">
        <ProductImageCarousel
          images={product.images}
          alt={product.name}
          emoji={cat.emoji}
          aspect="aspect-[4/5]"
          autoplay={false}
        />

        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-volt px-2 py-0.5 text-[10px] font-extrabold text-background shadow-md">
            -{discount}%
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-background px-4 py-1.5 text-sm font-bold text-white/70">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
            {cat.name}
          </p>
          {product.badge && (
            <span className="truncate rounded-full border border-volt/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-volt">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug sm:text-base">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold brand-text sm:text-xl">
              {formatPrice(product.price, product.currency)}
            </span>
            {originalPrice(product) && (
              <span className="text-xs text-white/40 line-through sm:text-sm">
                {originalPrice(product)}
              </span>
            )}
          </div>
          <Heart
            className="hidden text-white/30 transition-colors group-hover:text-volt sm:block"
            size={18}
          />
        </div>
      </div>
    </motion.div>
  );
}

function originalPrice(product: Product): string | null {
  if (product.originalPrice && product.originalPrice > product.price) {
    return formatPrice(product.originalPrice, product.currency);
  }
  return null;
}
