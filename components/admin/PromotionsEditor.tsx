"use client";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Promotion, Category } from "@/lib/types";
import { Field, TextInput, TextArea, Select } from "./fields";
import { Button } from "@/components/site/ui";
import { slugify } from "@/lib/utils";
import { Toggle } from "./ProductEditor";

interface Props {
  promotions: Promotion[];
  categories: Category[];
  onChange: (promotions: Promotion[]) => void;
}

const empty: Promotion = {
  id: "",
  title: "",
  description: "",
  emoji: "🎁",
  color: "#ccff00",
  discount: undefined,
  badge: "",
  categoryId: "todos",
  active: true,
};

export function PromotionsEditor({ promotions, categories, onChange }: Props) {
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openNew() {
    setEditing({ ...empty });
    setIsNew(true);
  }
  function openEdit(p: Promotion) {
    setEditing({ ...p });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    const normalized: Promotion = {
      ...editing,
      id: editing.id || slugify(editing.title) || `promo-${Date.now()}`,
      badge: editing.badge || undefined,
      discount: editing.discount && editing.discount > 0 ? editing.discount : undefined,
      categoryId: editing.categoryId || "todos",
    };
    const updated = isNew
      ? [...promotions, normalized]
      : promotions.map((p) => (p.id === normalized.id ? normalized : p));
    onChange(updated);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar esta promoción?")) return;
    onChange(promotions.filter((p) => p.id !== id));
  }

  function toggle(id: string) {
    onChange(
      promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Promociones ({promotions.length})</h2>
        <Button variant="volt" onClick={openNew} className="px-4 py-2.5 text-xs">
          <Plus size={16} /> Nueva promoción
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {promotions.map((p) => (
          <motion.div
            key={p.id}
            layout
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-4"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: `${p.color}22` }}
            >
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-bold">{p.title}</p>
                {!p.active && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/50">
                    oculta
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-white/50">
                {p.discount ? `-${p.discount}% · ` : ""}
                {p.badge ?? "Sin etiqueta"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(p.id)}
                className={`flex h-9 items-center rounded-lg border px-3 text-xs font-semibold transition-colors ${
                  p.active
                    ? "border-volt/50 text-volt"
                    : "border-white/12 text-white/50"
                }`}
              >
                {p.active ? "Activa" : "Activar"}
              </button>
              <button
                onClick={() => openEdit(p)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:border-volt hover:text-volt"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => remove(p.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:border-magenta hover:text-magenta"
                aria-label="Eliminar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
        {promotions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-white/40">
            No hay promociones. Crea la primera para destacar tus ofertas.
          </p>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal onClose={() => setEditing(null)}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {isNew ? "Nueva promoción" : "Editar promoción"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <Field label="Emoji">
                  <TextInput
                    value={editing.emoji}
                    onChange={(e) => setEditing({ ...editing, emoji: e.target.value })}
                    className="text-center text-xl"
                  />
                </Field>
                <Field label="Título">
                  <TextInput
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Edición Mundial 2026"
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <TextArea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Descuento %">
                  <TextInput
                    type="number"
                    inputMode="decimal"
                    value={editing.discount ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        discount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="20"
                  />
                </Field>
                <Field label="Etiqueta">
                  <TextInput
                    value={editing.badge ?? ""}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                    placeholder="Temporada"
                  />
                </Field>
                <Field label="Categoría destino">
                  <Select
                    value={editing.categoryId ?? "todos"}
                    onChange={(e) =>
                      setEditing({ ...editing, categoryId: e.target.value })
                    }
                  >
                    <option value="todos" className="bg-surface">Todas</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-surface">
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field label="Color de acento">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="h-11 w-16 cursor-pointer rounded-lg border border-white/12 bg-transparent"
                  />
                  <TextInput
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </Field>

              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <Toggle
                  label="Activa (mostrar en la tienda)"
                  checked={editing.active}
                  onChange={(v) => setEditing({ ...editing, active: v })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)} className="border border-white/10">
                Cancelar
              </Button>
              <Button variant="volt" onClick={save}>
                Guardar promoción
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-6 sm:max-w-xl sm:rounded-3xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
