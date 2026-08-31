"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, MessageCircle } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Button, Badge } from "./ui";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";

export function ProductModal({
  product,
  category,
  whatsappNumber,
  onClose,
}: {
  product: Product | null;
  category?: Category;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const [size, setSize] = useState<string>("");

  if (!product) return null;
  const cat = category ?? { emoji: "🛍️", name: "Producto" };

  const orderMessage = `Hola ALEX.STORE 👋, quiero pedir:\n\n🛒 *${product.name}*\n${formatPrice(
    product.price,
    product.currency
  )}${size ? `\n📏 Talla: ${size}` : ""}\n\n¿Me confirman disponibilidad?`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-white/10 bg-surface sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-white backdrop-blur hover:bg-background"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <ProductImageCarousel
          images={product.images}
          alt={product.name}
          emoji={cat.emoji}
          aspect="aspect-square"
        />

        <div className="p-6">
          {product.badge && (
            <Badge className="mb-3 border-volt/40 text-volt">{product.badge}</Badge>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">{cat.name}</p>
              <h3 className="mt-1 text-2xl font-extrabold">{product.name}</h3>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold brand-text">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-white/40 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/65">
            {product.description}
          </p>

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                Talla
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                      size === s
                        ? "border-volt bg-volt text-background"
                        : "border-white/15 text-white/70 hover:border-white/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <a
            href={whatsappLink(whatsappNumber, orderMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 block"
          >
            <Button variant="volt" className="w-full">
              <MessageCircle size={18} /> Pedir por WhatsApp
            </Button>
          </a>

          {size && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Check size={14} className="text-volt" /> Talla seleccionada: {size}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
