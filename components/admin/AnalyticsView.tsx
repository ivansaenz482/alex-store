"use client";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Flame,
  CalendarDays,
  Users,
  Trophy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/site/ui";

interface Aggregates {
  visitors: { today: number; month: number; year: number; total: number };
  views: { total: number };
  last14: { date: string; count: number }[];
  topProducts: { id: string; name: string; count: number; weekly: number }[];
  topProductsWeek: { id: string; name: string; count: number }[];
  topCategories: { id: string; name: string; count: number }[];
}

function fmt(n: number) {
  return n.toLocaleString("es-MX");
}

export function AnalyticsView() {
  const [data, setData] = useState<Aggregates | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const res = await fetch("/api/analytics");
    if (!res.ok) {
      setError("No autorizado");
      return;
    }
    const json: Aggregates = await res.json();
    setData(json);
    setError("");
  };

  useEffect(() => {
    let active = true;
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (active) setData(json as Aggregates);
      })
      .catch(() => {
        if (active) setError("No autorizado");
      });
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-volt" />
      </div>
    );
  }

  const max14 = Math.max(1, ...data.last14.map((d) => d.count));
  const maxViews = Math.max(1, ...data.topProducts.map((p) => p.count));

  const stats = [
    { label: "Visitas hoy", value: data.visitors.today, icon: Eye, color: "#ccff00" },
    { label: "Este mes", value: data.visitors.month, icon: CalendarDays, color: "#7c5cff" },
    { label: "Este año", value: data.visitors.year, icon: Users, color: "#ff2e9a" },
    { label: "Visitas totales", value: data.visitors.total, icon: Flame, color: "#25D366" },
    { label: "Atención de productos", value: data.views.total, icon: Eye, color: "#ccff00" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Estadísticas de la tienda</h2>
        <Button
          variant="ghost"
          className="border border-white/10 text-sm"
          onClick={async () => {
            if (!confirm("¿Reiniciar todos los contadores?")) return;
            await fetch("/api/analytics", { method: "DELETE" });
            refresh();
          }}
        >
          <Trash2 size={15} className="text-magenta" /> Reiniciar
        </Button>
      </div>

      {error && <p className="text-magenta">Error: {error}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/8 bg-white/3 p-5"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${s.color}1f`, color: s.color }}
            >
              <s.icon size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold">{fmt(s.value)}</p>
            <p className="mt-1 text-xs text-white/50">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Visitas · últimos 14 días" icon={CalendarDays}>
          <div className="flex h-40 items-end gap-1.5">
            {data.last14.map((d) => (
              <div key={d.date} className="group relative flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-volt/50 to-volt transition-all"
                  style={{ height: `${(d.count / max14) * 140}px` }}
                />
                <span className="mt-1 text-[9px] text-white/30">{d.date.slice(8)}</span>
                <div className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-md bg-background px-2 py-1 text-[10px] font-bold group-hover:block">
                  {fmt(d.count)}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Productos más vistos · totales" icon={Trophy}>
          <div className="space-y-3">
            {data.topProducts.length === 0 && (
              <p className="py-6 text-center text-sm text-white/40">
                Aún no hay datos de productos.
              </p>
            )}
            {data.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-white/40">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <span className="text-xs text-white/50">
                      {fmt(p.count)} · <span className="text-volt">+{fmt(p.weekly)} semana</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full brand-bg"
                      style={{ width: `${(p.count / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Más vistos esta semana" icon={Flame}>
          <div className="space-y-2.5">
            {data.topProductsWeek.length === 0 && (
              <p className="py-6 text-center text-sm text-white/40">Sin datos esta semana.</p>
            )}
            {data.topProductsWeek.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-4 py-3">
                <span className="text-sm font-bold text-white/40">{i + 1}</span>
                <p className="min-w-0 flex-1 truncate text-sm">{p.name}</p>
                <span className="text-sm font-bold text-volt">{fmt(p.count)} vistas</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Categorías con más atención" icon={Users}>
          <div className="space-y-2.5">
            {data.topCategories.length === 0 && (
              <p className="py-6 text-center text-sm text-white/40">Sin datos aún.</p>
            )}
            {data.topCategories.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-4 py-3">
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</p>
                <span className="text-sm font-bold text-aqua">{fmt(c.count)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Users;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60">
        <Icon size={16} className="text-volt" /> {title}
      </h3>
      {children}
    </div>
  );
}
