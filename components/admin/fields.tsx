"use client";
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const inputCls =
  "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-volt";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-white/35">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-24 resize-y`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} appearance-none`} />;
}
