"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
  imgClassName?: string;
  fit?: "contain" | "cover";
}

export function ProductImage({
  src,
  alt,
  emoji,
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
        <span className="relative text-6xl opacity-50">{emoji}</span>
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
