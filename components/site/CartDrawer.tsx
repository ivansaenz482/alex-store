"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useCart } from "./CartContext";
import { Button } from "./ui";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-volt";

export function CartDrawer({
  storeName,
  whatsapp,
  paymentMethods,
  shippingNote,
}: {
  storeName: string;
  whatsapp: { number: string; message: string };
  paymentMethods: string[];
  shippingNote?: string;
}) {
  const { items, count, subtotal, currency, open, setOpen, remove, setQty, clear } =
    useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState(paymentMethods[0] ?? "Transferencia");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => setStep("cart"), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const orderLines = items.map((item, index) => {
    const size = item.size ? ` (Talla ${item.size})` : "";
    return `${index + 1}. ${item.name}${size} x${item.qty} — ${formatPrice(
      item.price * item.qty,
      item.currency
    )}`;
  });

  const message = [
    `Hola ${storeName}, quiero hacer este pedido:`,
    "",
    "*Pedido*",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(subtotal, currency)}`,
    "",
    `Nombre: ${name.trim() || "—"}`,
    phone.trim() ? `Teléfono: ${phone.trim()}` : null,
    `Pago: ${method}`,
    notes.trim() ? `Notas: ${notes.trim()}` : null,
    "",
    "¿Me confirman disponibilidad y datos de pago? ¡Gracias!",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const canCheckout = items.length > 0;
  const canSend = canCheckout && name.trim().length > 0;

  function handleSent() {
    window.setTimeout(() => {
      clear();
      setOpen(false);
    }, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-3xl border border-white/10 bg-surface sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[430px] sm:rounded-none sm:border-l"
            aria-label="Carrito de compras"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2">
                {step === "checkout" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/70 hover:text-white"
                    aria-label="Volver"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <ShoppingBag size={18} className="text-volt" />
                <h2 className="font-extrabold">
                  {step === "cart" ? "Tu carrito" : "Finalizar pedido"}
                  {count > 0 && step === "cart" && (
                    <span className="ml-2 text-sm font-semibold text-white/45">
                      {count} art.
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={17} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                  <ShoppingBag size={44} className="text-white/25" strokeWidth={1.4} />
                  <p className="font-bold">Tu carrito está vacío</p>
                  <p className="text-sm text-white/50">
                    Agrega productos y arma tu pedido.
                  </p>
                  <Button
                    variant="volt"
                    onClick={() => {
                      setOpen(false);
                      document
                        .getElementById("catalogo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Ver catálogo
                  </Button>
                </div>
              ) : step === "cart" ? (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-white/8 bg-white/3 p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/25">
                            <ShoppingBag size={20} strokeWidth={1.6} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{item.name}</p>
                        <p className="text-xs text-white/50">
                          {item.categoryName ?? "Producto"}
                          {item.size ? ` · Talla ${item.size}` : ""}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 rounded-full border border-white/12 px-1">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                              aria-label="Quitar uno"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-5 text-center text-sm font-bold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                              aria-label="Agregar uno"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-extrabold brand-text">
                            {formatPrice(item.price * item.qty, item.currency)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(item.id)}
                        className="self-start text-white/35 transition-colors hover:text-magenta"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={clear}
                    className="w-full py-2 text-center text-xs font-semibold text-white/40 hover:text-magenta"
                  >
                    Vaciar carrito
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                      Tu nombre *
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className={inputCls}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                      Teléfono (opcional)
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      placeholder="Ej. +52 123 456 7890"
                      className={inputCls}
                    />
                  </label>

                  <div>
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                      Forma de pago
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {paymentMethods.map((option) => (
                        <button
                          key={option}
                          onClick={() => setMethod(option)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                            method === option
                              ? "border-volt bg-volt text-background"
                              : "border-white/15 text-white/70 hover:border-white/40"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                      Notas / dirección (opcional)
                    </span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dirección de envío, color, referencia..."
                      className={`${inputCls} min-h-24 resize-y`}
                    />
                  </label>

                  {shippingNote && (
                    <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/55">
                      {shippingNote}
                    </p>
                  )}

                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-sm">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 py-1 text-white/70"
                      >
                        <span className="truncate">
                          {item.qty}× {item.name}
                          {item.size ? ` (${item.size})` : ""}
                        </span>
                        <span className="shrink-0 font-semibold">
                          {formatPrice(item.price * item.qty, item.currency)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-base font-extrabold">
                      <span>Subtotal</span>
                      <span className="brand-text">
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-white/8 px-5 py-4">
                {step === "cart" ? (
                  <>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-white/60">Subtotal</span>
                      <span className="text-lg font-extrabold brand-text">
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>
                    <Button
                      variant="volt"
                      className="w-full"
                      disabled={!canCheckout}
                      onClick={() => setStep("checkout")}
                    >
                      Finalizar pedido <Check size={16} />
                    </Button>
                  </>
                ) : (
                  <a
                    href={whatsappLink(whatsapp.number, message)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleSent}
                    className="block"
                  >
                    <Button variant="volt" className="w-full" disabled={!canSend}>
                      <MessageCircle size={18} /> Enviar pedido por WhatsApp
                    </Button>
                  </a>
                )}
                {step === "checkout" && !canSend && (
                  <p className="mt-2 text-center text-xs text-white/45">
                    Escribe tu nombre para continuar.
                  </p>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
