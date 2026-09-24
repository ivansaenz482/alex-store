"use client";
import { Music2, Mail, ShieldCheck, Truck, BadgeCheck, MessageCircle, ArrowUpRight } from "lucide-react";
import type { StoreData } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";
import { PushButton } from "./PushButton";
import { ShareQr } from "./ShareQr";
import { Button } from "./ui";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const benefits = [
  { icon: ShieldCheck, title: "Productos originales", desc: "Calidad garantizada" },
  { icon: Truck, title: "Envíos rápidos", desc: "A todo el país" },
  { icon: BadgeCheck, title: "Pago seguro", desc: "Transferencia, depósito y más" },
];

export function Footer({ data }: { data: StoreData }) {
  const { store, whatsapp } = data;

  return (
    <footer className="relative mt-10 border-t border-white/8 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-background/40 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-volt/10 text-volt">
                <b.icon size={22} />
              </div>
              <div>
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-white/50">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 border-t border-white/8 pt-12 md:grid-cols-3">
          <div>
            <div className="flex items-center text-xl font-extrabold">
              <span className="text-volt">A</span><span className="brand-text">LEX.STORE</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/55">{store.description}</p>
            <div className="mt-5 flex gap-3">
              {store.instagram && (
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-volt hover:text-volt"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {store.tiktok && (
                <a
                  href={`https://tiktok.com/@${store.tiktok}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-volt hover:text-volt"
                  aria-label="TikTok"
                >
                  <Music2 size={18} />
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-volt hover:text-volt"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-white/50">
              Navegación
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <a href="#inicio" className="hover:text-white">Inicio</a>
              <a href="#categorias" className="hover:text-white">Categorías</a>
              <a href="#destacados" className="hover:text-white">Destacados</a>
              <a href="#catalogo" className="hover:text-white">Catálogo</a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-white/50">
              Contacto
            </p>
            <a
              href={whatsappLink(whatsapp.number, whatsapp.message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 px-4 py-2.5 text-sm font-semibold text-[#25D366]"
            >
              <MessageCircle size={16} /> WhatsApp: {whatsapp.number}
            </a>
            {store.email && (
              <p className="mt-3 text-sm text-white/55">{store.email}</p>
            )}
            <div className="mt-4">
              <PushButton />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/8 bg-background/40 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-volt">
              Comparte
            </p>
            <p className="mt-2 text-lg font-extrabold">Comparte esta tienda</p>
            <p className="mt-1 text-sm text-white/55">
              Descarga el QR para imprimir o comparte el enlace con tus clientes.
            </p>
            <div className="mt-4">
              <ShareQr storeName={store.name} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-volt/20 bg-volt/5 p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-volt/20 blur-2xl" />
            <p className="relative text-xs font-bold uppercase tracking-widest text-volt">
              Desarrollador
            </p>
            <p className="relative mt-2 text-lg font-extrabold">Ivan Tenet</p>
            <p className="relative mt-1 text-sm text-white/55">
              Creador de esta tienda y de otras páginas web.
            </p>
            <a
              href="https://ivansaenz482.github.io/ivan-teneta-web/"
              target="_blank"
              rel="noreferrer"
              className="relative mt-4 inline-block"
            >
              <Button variant="volt" className="px-5 py-2.5 text-xs">
                Ver mi portafolio <ArrowUpRight size={15} />
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {store.name}. Todos los derechos reservados.</p>
          <p>
            Hecho con <span className="text-volt">♥</span> · {store.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
