"use client";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { Button } from "./ui";
import { formatPrice } from "@/lib/utils";

export function FeaturedCarousel({
  products,
  categories,
  onView,
}: {
  products: Product[];
  categories: Category[];
  onView: (product: Product) => void;
}) {
  const autoplay = useCallback(
    () => Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    autoplay(),
  ]);

  const cats = (id: string) => categories.find((c) => c.id === id);

  return (
    <section
      id="destacados"
      className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6"
    >
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-volt">
            Lo más pedido
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">
            Destacados <span className="brand-text">de la semana</span>
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-volt hover:text-volt"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-volt hover:text-volt"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {products.map((p) => {
            const cat = cats(p.categoryId);
            return (
              <div
                key={p.id}
                className="embla__slide mr-5 flex-[0_0_85%] sm:flex-[0_0_46%] lg:flex-[0_0_31.5%]"
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-surface p-3 transition-all hover:border-white/20"
                  onClick={() => onView(p)}
                >
                  <ProductImageCarousel
                    images={p.images}
                    alt={p.name}
                    emoji={cat?.emoji ?? "🛍️"}
                    aspect="aspect-[4/5]"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/40">
                          {cat?.name ?? "Producto"}
                        </p>
                        <h3 className="mt-1 font-bold leading-snug">{p.name}</h3>
                      </div>
                      <ArrowUpRight className="shrink-0 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-volt" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold brand-text">
                          {formatPrice(p.price, p.currency)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-sm text-white/40 line-through">
                            {formatPrice(p.originalPrice, p.currency)}
                          </span>
                        )}
                      </div>
                      <Button variant="volt" className="px-4 py-2 text-xs">
                        Ver más
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
