"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fit?: "contain" | "cover";
}

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  fit = "contain",
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const isContain = fit === "contain";

  if (!src || error) {
    return (
      <div
        className={cn(
          "product-media relative flex items-center justify-center overflow-hidden",
          className
        )}
      >
        <div className="absolute inset-0 grid-bg opacity-50" />
        <ShoppingBag
          className="relative text-white/25"
          size={56}
          strokeWidth={1.4}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isContain && "product-media",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full",
          isContain ? "object-contain p-4 sm:p-5" : "object-cover",
          imgClassName
        )}
        onError={() => setError(true)}
      />
    </div>
  );
}
