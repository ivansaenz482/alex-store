"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "volt" | "outline" | "ghost" | "magenta";

const variants: Record<Variant, string> = {
  volt: "bg-volt text-background shadow-[0_0_30px_-6px_rgba(204,255,0,0.7)] hover:bg-volt-soft",
  magenta:
    "bg-magenta text-white shadow-[0_0_30px_-6px_rgba(255,46,154,0.7)] hover:brightness-110",
  outline:
    "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40",
  ghost: "text-white/80 hover:text-white hover:bg-white/5",
};

export function Button({
  children,
  variant = "volt",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all active:scale-[0.97]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur",
        className
      )}
    >
      {children}
    </span>
  );
}
