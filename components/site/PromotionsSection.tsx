"use client";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Promotion } from "@/lib/types";

export function PromotionsSection({
  promotions,
  onSelectCategory,
}: {
  promotions: Promotion[];
  onSelectCategory: (id: string) => void;
}) {
  const active = promotions.filter((p) => p.active);

  const autoplay = useCallback(
    () => Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay()]);

  if (active.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-volt">
          Ofertas
        </p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">
          Promociones <span className="brand-text">que se agotan</span>
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {active.map((promo) => {
            const cat = promo.categoryId && promo.categoryId !== "todos"
              ? promo.categoryId
              : undefined;
            return (
              <div
                key={promo.id}
                className="embla__slide mr-4 flex-[0_0_88%] sm:flex-[0_0_55%] lg:flex-[0_0_42%]"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8"
                  style={{
                    background: `linear-gradient(135deg, ${promo.color}1f, ${promo.color}08 60%, transparent)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full opacity-25 blur-3xl"
                    style={{ background: promo.color }}
                  />
                  {promo.image && (
                    <div className="relative mb-5 h-36 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="relative flex flex-1 flex-col">
                    {promo.badge && (
                      <span
                        className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-background"
                        style={{ background: promo.color }}
                      >
                        {promo.badge}
                      </span>
                    )}
                    <h3 className="mt-5 text-2xl font-extrabold">{promo.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-white/65">
                      {promo.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      {promo.discount ? (
                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-4xl font-extrabold"
                            style={{ color: promo.color }}
                          >
                            -{promo.discount}%
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}
                      <button
                        onClick={() => onSelectCategory(cat ?? "todos")}
                        className="inline-flex items-center gap-2 rounded-full bg-background/80 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white"
                      >
                        Ver productos <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
