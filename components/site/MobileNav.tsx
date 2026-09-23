"use client";
import { useEffect, useState } from "react";
import { Home, FolderTree, Flame, LayoutGrid, MessageCircle } from "lucide-react";
import { cn, whatsappLink } from "@/lib/utils";

const items = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "categorias", label: "Categorías", icon: FolderTree },
  { id: "destacados", label: "Top", icon: Flame },
  { id: "catalogo", label: "Catálogo", icon: LayoutGrid },
];

export function MobileNav({
  whatsapp,
}: {
  whatsapp: { number: string; message: string };
}) {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/10 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegación inferior"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1.5 pb-1 pt-1.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors",
                isActive ? "text-volt" : "text-white/55"
              )}
            >
              <item.icon size={20} />
              {item.label}
              <span
                className={cn(
                  "absolute -top-1.5 h-1 w-6 rounded-full transition-all",
                  isActive ? "bg-volt" : "bg-transparent"
                )}
              />
            </a>
          );
        })}

        <a
          href={whatsappLink(whatsapp.number, whatsapp.message)}
          target="_blank"
          rel="noreferrer"
          className="relative flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold text-[#25D366]"
        >
          <span className="flex h-5 items-center">
            <MessageCircle size={20} />
          </span>
          Pedir
        </a>
      </div>
    </nav>
  );
}
