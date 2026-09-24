"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { cn, formatPrice } from "@/lib/utils";

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
    () => Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" },
    [autoplay()]
  );

  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setSelected(emblaApi.selectedScrollSnap());
      setProgress(emblaApi.scrollProgress());
      setSnaps(emblaApi.scrollSnapList());
    };
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onScroll = () => setProgress(emblaApi.scrollProgress());

    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", sync);

    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  const cats = (id: string) => categories.find((c) => c.id === id);

  return (
    <section
      id="destacados"
      className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-volt/10 blur-[90px]" />

      <div className="relative mb-8 flex items-end justify-between gap-4 sm:mb-10">
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-volt hover:text-volt"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-volt hover:text-volt"
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-12" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y pb-2">
            {products.map((p) => {
              const cat = cats(p.categoryId);
              const discount =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round((1 - p.price / p.originalPrice) * 100)
                  : 0;
              return (
                <div
                  key={p.id}
                  className="embla__slide mr-3 flex-[0_0_64%] sm:mr-4 sm:flex-[0_0_42%] md:flex-[0_0_31%] lg:flex-[0_0_23.5%]"
                >
                  <motion.div
                    role="button"
                    tabIndex={0}
                    onClick={() => onView(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onView(p);
                      }
                    }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/8 bg-surface text-left transition-colors hover:border-white/20"
                  >
                    <div className="relative overflow-hidden">
                      <ProductImageCarousel
                        images={p.images}
                        alt={p.name}
                        aspect="aspect-[4/5]"
                        showControls={false}
                        autoplay={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                      {discount > 0 && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-volt px-2 py-0.5 text-[10px] font-extrabold text-background shadow-md">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">
                          {cat?.name ?? "Producto"}
                        </p>
                        {p.badge && (
                          <span className="truncate rounded-full border border-volt/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-volt">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug">
                        {p.name}
                      </h3>

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex flex-col">
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[11px] text-white/40 line-through">
                              {formatPrice(p.originalPrice, p.currency)}
                            </span>
                          )}
                          <span className="text-lg font-extrabold brand-text">
                            {formatPrice(p.price, p.currency)}
                          </span>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all group-hover:bg-volt group-hover:text-background">
                          <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <div
            className="h-full rounded-full bg-volt transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="hidden gap-1.5 sm:flex">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Ir al destacado ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === selected ? "w-5 bg-volt" : "w-1.5 bg-white/25 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
