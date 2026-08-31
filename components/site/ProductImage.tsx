"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
  imgClassName?: string;
}

export function ProductImage({
  src,
  alt,
  emoji,
  className,
  imgClassName,
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 to-background",
          className
        )}
      >
        <div className="absolute inset-0 grid-bg opacity-60" />
        <span className="relative text-6xl opacity-40">{emoji}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={() => setError(true)}
      />
    </div>
  );
}
