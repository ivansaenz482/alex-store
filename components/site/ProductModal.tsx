"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, MessageCircle, Ruler } from "lucide-react";
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

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const orderMessage = `Hola ALEX.STORE 👋, quiero pedir:\n\n🛒 *${product.name}*\n${formatPrice(
    product.price,
    product.currency
  )}${size ? `\n📏 Talla: ${size}` : ""}\n\n¿Me confirman disponibilidad?`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-surface sm:max-h-[88dvh] sm:max-w-3xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-white shadow-lg backdrop-blur transition-colors hover:bg-magenta"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto sm:grid-cols-2 sm:overflow-hidden">
          <div className="relative flex items-center justify-center sm:bg-surface-2">
            <div className="w-full">
              <ProductImageCarousel
                images={product.images}
                alt={product.name}
                emoji={cat.emoji}
                aspect="aspect-[4/3] sm:aspect-square"
              />
            </div>
          </div>

          <div className="p-5 sm:min-h-0 sm:overflow-y-auto sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && (
                <Badge className="border-volt/40 text-volt">{product.badge}</Badge>
              )}
              {discount > 0 && (
                <Badge className="border-volt bg-volt text-background">
                  -{discount}% OFF
                </Badge>
              )}
            </div>

            <p className="mt-3 text-xs uppercase tracking-widest text-white/50">
              {cat.name}
            </p>
            <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">
              {product.name}
            </h3>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold brand-text sm:text-3xl">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-white/40 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {product.description}
            </p>

            {product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/50">
                  <Ruler size={13} className="text-volt" /> Elige tu talla
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "min-w-12 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(whatsappNumber, orderMessage)}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="volt" className="w-full">
                  <MessageCircle size={18} /> Pedir por WhatsApp
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={onClose}
                className="sm:w-auto"
              >
                Seguir viendo
              </Button>
            </div>

            {size ? (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/50">
                <Check size={14} className="text-volt" /> Talla seleccionada: {size}
              </p>
            ) : (
              product.sizes.length > 0 && (
                <p className="mt-3 text-center text-xs text-white/40">
                  Toca una talla para incluirla en tu pedido
                </p>
              )
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
