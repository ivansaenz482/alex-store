"use client";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Field, TextInput } from "./fields";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/site/ui";
import { slugify } from "@/lib/utils";

interface Props {
  categories: Category[];
  onChange: (categories: Category[]) => void;
  onDeleteProductsFor: (categoryId: string) => void;
}

const empty: Category = {
  id: "",
  name: "",
  emoji: "🛍️",
  image: "",
  accent: "#39ff14",
  description: "",
};

export function CategoryEditor({ categories, onChange, onDeleteProductsFor }: Props) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openNew() {
    setEditing({ ...empty });
    setIsNew(true);
  }
  function openEdit(c: Category) {
    setEditing({ ...c });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    const normalized: Category = {
      ...editing,
      id: editing.id || slugify(editing.name) || `c-${Date.now()}`,
    };
    const updated = isNew
      ? [...categories, normalized]
      : categories.map((c) => (c.id === normalized.id ? normalized : c));
    onChange(updated);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar categoría? También se eliminarán sus productos.")) return;
    onDeleteProductsFor(id);
    onChange(categories.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Categorías ({categories.length})</h2>
        <Button variant="volt" onClick={openNew} className="px-4 py-2.5 text-xs">
          <Plus size={16} /> Nueva categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <motion.div
            key={c.id}
            layout
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${c.accent}22` }}>
              {c.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{c.name}</p>
              <p className="truncate text-xs text-white/50">{c.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(c)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:border-volt hover:text-volt"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => remove(c.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-white/70 hover:border-magenta hover:text-magenta"
                aria-label="Eliminar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
        {categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-white/40">
            No hay categorías.
          </p>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal onClose={() => setEditing(null)}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {isNew ? "Nueva categoría" : "Editar categoría"}
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
                <Field label="Nombre">
                  <TextInput
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Camisas de Fútbol"
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <TextInput
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>

              <Field label="Color de acento" hint="Color de la categoría en la tienda.">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editing.accent}
                    onChange={(e) => setEditing({ ...editing, accent: e.target.value })}
                    className="h-11 w-16 cursor-pointer rounded-lg border border-white/12 bg-transparent"
                  />
                  <TextInput
                    value={editing.accent}
                    onChange={(e) => setEditing({ ...editing, accent: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </Field>

              <Field label="Imagen de portada (opcional)">
                <ImageUploader
                  value={editing.image ? [editing.image] : []}
                  onChange={(urls) =>
                    setEditing({ ...editing, image: urls[0] ?? "" })
                  }
                  max={1}
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)} className="border border-white/10">
                Cancelar
              </Button>
              <Button variant="volt" onClick={save}>
                Guardar categoría
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
