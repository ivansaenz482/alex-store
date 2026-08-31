"use client";
import Image from "next/image";
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
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={cn("object-cover", imgClassName)}
        onError={() => setError(true)}
      />
    </div>
  );
}
