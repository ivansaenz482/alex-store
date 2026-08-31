"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

export function ProductImageCarousel({
  images,
  alt,
  emoji,
  aspect = "aspect-square",
  showControls = true,
}: {
  images: string[];
  alt: string;
  emoji: string;
  aspect?: string;
  showControls?: boolean;
}) {
  const slides = images.length ? images : [""];
  const isPlaceholder = images.length === 0;

  const autoplay = useCallback(
    () =>
      Autoplay({
        delay: 3200,
        stopOnInteraction: !isPlaceholder,
        stopOnMouseEnter: true,
      }),
    [isPlaceholder]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 }, [
    autoplay(),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSelected(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((src, i) => (
            <div className="embla__slide" key={i}>
              <ProductImage
                src={isPlaceholder ? undefined : src}
                alt={alt}
                emoji={emoji}
                className={cn("w-full", aspect)}
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {showControls && !isPlaceholder && slides.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-white backdrop-blur transition-colors hover:bg-volt hover:text-background"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-white backdrop-blur transition-colors hover:bg-volt hover:text-background"
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === selected ? "w-5 bg-volt" : "w-1.5 bg-white/40"
              )}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
