"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  FolderTree,
  Settings,
  LogOut,
  Eye,
  Save,
  Megaphone,
  BarChart3,
  DatabaseBackup,
} from "lucide-react";
import type { StoreData } from "@/lib/types";
import { ProductEditor } from "./ProductEditor";
import { CategoryEditor } from "./CategoryEditor";
import { SettingsEditor } from "./SettingsEditor";
import { PromotionsEditor } from "./PromotionsEditor";
import { AnalyticsView } from "./AnalyticsView";
import { BackupPanel } from "./BackupPanel";
import { cn } from "@/lib/utils";

type Tab =
  | "productos"
  | "categorias"
  | "promociones"
  | "estadisticas"
  | "backup"
  | "ajustes";

export function AdminApp() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [data, setData] = useState<StoreData | null>(null);
  const [tab, setTab] = useState<Tab>("productos");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/me");
      const { authenticated } = await res.json();
      if (!authenticated) {
        router.replace("/admin/login");
        return;
      }
      setAuthenticated(true);
      const store = await fetch("/api/store");
      setData(await store.json());
    })();
  }, [router]);

  const save = useCallback(async (next: StoreData) => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }, []);

  if (authenticated === null || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-volt" />
      </div>
    );
  }

  const onChange = (next: Partial<StoreData>) => {
    const merged = { ...data, ...next };
    setData(merged);
    save(merged);
  };

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "productos", label: "Productos", icon: Package },
    { id: "categorias", label: "Categorías", icon: FolderTree },
    { id: "promociones", label: "Promociones", icon: Megaphone },
    { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
    { id: "backup", label: "Backup", icon: DatabaseBackup },
    { id: "ajustes", label: "Ajustes", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-30 border-b border-white/8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center text-lg font-extrabold">
            <span className="text-volt">A</span><span className="brand-text">LEX.STORE</span>
            <span className="ml-2 rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-2 text-xs font-semibold text-white/70 hover:border-volt hover:text-volt"
            >
              <Eye size={14} /> Ver tienda
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                router.replace("/admin/login");
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-2 text-xs font-semibold text-white/70 hover:border-magenta hover:text-magenta"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Panel de control</h1>
            <p className="mt-1 text-sm text-white/50">
              Administra tus productos, categorías y ajustes.
            </p>
          </div>
          <span className="hidden items-center gap-2 text-xs font-semibold text-white/40 sm:flex">
            <Save size={14} className="text-volt" />
            {saving ? "Guardando..." : saved ? "✓ Guardado" : "Cambios se guardan al instante"}
          </span>
        </div>

        <div className="mb-8 flex gap-2 rounded-2xl border border-white/8 bg-white/3 p-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                tab === t.id
                  ? "bg-volt text-background"
                  : "text-white/60 hover:text-white"
              )}
            >
              <t.icon size={16} /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "productos" && (
          <ProductEditor
            products={data.products}
            categories={data.categories}
            onChange={(products) => onChange({ products })}
          />
        )}
        {tab === "categorias" && (
          <CategoryEditor
            categories={data.categories}
            onChange={(categories) => onChange({ categories })}
            onDeleteProductsFor={(categoryId) =>
              onChange({
                products: data.products.filter((p) => p.categoryId !== categoryId),
              })
            }
          />
        )}
        {tab === "promociones" && (
          <PromotionsEditor
            promotions={data.promotions}
            categories={data.categories}
            onChange={(promotions) => onChange({ promotions })}
          />
        )}
        {tab === "estadisticas" && <AnalyticsView />}
        {tab === "backup" && <BackupPanel />}
        {tab === "ajustes" && <SettingsEditor data={data} onChange={onChange} />}
      </main>
    </div>
  );
}
