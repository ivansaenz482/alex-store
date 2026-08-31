"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Badge } from "./ui";
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      onClick={onView}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-surface transition-all hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative">
        <ProductImageCarousel
          images={product.images}
          alt={product.name}
          emoji={cat.emoji}
          aspect="aspect-[4/5]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <Badge className="bg-volt text-background border-volt">{product.badge}</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-volt text-background border-volt">-{discount}%</Badge>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-background px-4 py-1.5 text-sm font-bold text-white/70">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-white/40">{cat.name}</p>
        <h3 className="mt-1 line-clamp-2 font-bold leading-snug">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold brand-text">
              {formatPrice(product.price, product.currency)}
            </span>
            {originalPrice(product) && (
              <span className="text-sm text-white/40 line-through">
                {originalPrice(product)}
              </span>
            )}
          </div>
          <Heart className="text-white/30 transition-colors group-hover:text-volt" size={18} />
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
