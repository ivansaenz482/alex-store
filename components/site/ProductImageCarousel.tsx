"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

const HOVER_ZOOM = "transition-transform duration-700 group-hover:scale-105";

interface Props {
  images: string[];
  alt: string;
  aspect?: string;
  showControls?: boolean;
  fit?: "contain" | "cover";
  autoplay?: boolean;
}

export function ProductImageCarousel({
  images,
  alt,
  aspect = "aspect-square",
  showControls = true,
  fit = "contain",
  autoplay = true,
}: Props) {
  // Optimización: con 0 o 1 imagen NO montamos Embla (ni autoplay).
  // La mayoría de productos tienen 1 foto, así evitamos decenas de carruseles.
  if (images.length <= 1) {
    return (
      <div className={cn("relative", aspect)}>
        <ProductImage
          src={images[0]}
          alt={alt}
          fit={fit}
          className="h-full w-full"
          imgClassName={HOVER_ZOOM}
        />
      </div>
    );
  }

  return (
    <MultiImageCarousel
      images={images}
      alt={alt}
      aspect={aspect}
      showControls={showControls}
      fit={fit}
      autoplay={autoplay}
    />
  );
}

function MultiImageCarousel({
  images,
  alt,
  aspect,
  showControls,
  fit,
  autoplay,
}: {
  images: string[];
  alt: string;
  aspect: string;
  showControls: boolean;
  fit: "contain" | "cover";
  autoplay: boolean;
}) {
  const autoplayPlugin = useCallback(
    () => Autoplay({ delay: 3600, stopOnInteraction: true, stopOnMouseEnter: true }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplay ? [autoplayPlugin()] : []);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const raf = requestAnimationFrame(() => setSelected(emblaApi.selectedScrollSnap()));
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, i) => (
            <div className="embla__slide" key={i}>
              <ProductImage
                src={src}
                alt={alt}
                fit={fit}
                className={cn("w-full", aspect)}
                imgClassName={HOVER_ZOOM}
              />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi?.scrollPrev();
            }}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-white backdrop-blur transition-colors hover:bg-volt hover:text-background"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              emblaApi?.scrollNext();
            }}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-white backdrop-blur transition-colors hover:bg-volt hover:text-background"
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              emblaApi?.scrollTo(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === selected ? "w-5 bg-volt" : "w-1.5 bg-white/40"
            )}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
