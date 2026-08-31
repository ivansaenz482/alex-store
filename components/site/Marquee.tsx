"use client";
import type { ReactNode } from "react";

export function Marquee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const doubled = (
    <div
      className="flex shrink-0 items-center"
      aria-hidden="true"
    >
      {children}
    </div>
  );

  return (
    <div className={`relative flex overflow-hidden ${className ?? ""}`}>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled}
        {doubled}
      </div>
    </div>
  );
}
