"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { Field, TextInput, TextArea, Select } from "./fields";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/site/ui";
import { slugify, formatPrice } from "@/lib/utils";

interface Props {
  products: Product[];
  categories: Category[];
  onChange: (products: Product[]) => void;
}

const emptyProduct = (categoryId: string): Product => ({
  id: "",
  name: "",
  categoryId,
  price: 0,
  currency: "$",
  description: "",
  badge: "",
  featured: false,
  sizes: [],
  images: [],
  inStock: true,
});

export function ProductEditor({ products, categories, onChange }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openNew() {
    setEditing(emptyProduct(categories[0]?.id ?? ""));
    setIsNew(true);
  }
  function openEdit(p: Product) {
    setEditing({ ...p });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    const normalized: Product = {
      ...editing,
      id: editing.id || slugify(editing.name) || `p-${Date.now()}`,
      sizes: editing.sizes.filter(Boolean),
      badge: editing.badge || undefined,
      originalPrice:
        editing.originalPrice && editing.originalPrice > 0
          ? editing.originalPrice
          : undefined,
    };
    const updated = isNew
      ? [...products, normalized]
      : products.map((p) => (p.id === normalized.id ? normalized : p));
    onChange(updated);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    onChange(products.filter((p) => p.id !== id));
  }

  const cats = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Productos ({products.length})</h2>
        <Button variant="volt" onClick={openNew} className="px-4 py-2.5 text-xs">
          <Plus size={16} /> Agregar producto
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <motion.div
            key={p.id}
            layout
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-3"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-surface-2">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">
                  🛍️
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{p.name}</p>
              <p className="text-xs text-white/50">
                {cats(p.categoryId)} · {p.sizes.join(", ") || "Sin tallas"}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-extrabold brand-text">
                {formatPrice(p.price, p.currency)}
              </p>
              <p className="text-xs text-white/40">
                {p.featured ? "⭐ Destacado" : p.inStock ? "En stock" : "Agotado"}
              </p>
            </div>
            <div className="flex gap-2">
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
        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-white/40">
            No hay productos todavía. Agrega el primero.
          </p>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal onClose={() => setEditing(null)}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {isNew ? "Nuevo producto" : "Editar producto"}
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
              <Field label="Nombre">
                <TextInput
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Camisa Real Madrid 24/25"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Categoría">
                  <Select
                    value={editing.categoryId}
                    onChange={(e) =>
                      setEditing({ ...editing, categoryId: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-surface">
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Etiqueta (badge)">
                  <TextInput
                    value={editing.badge ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, badge: e.target.value })
                    }
                    placeholder="Nuevo, Top ventas..."
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Precio">
                  <TextInput
                    type="number"
                    inputMode="decimal"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Precio antes (opcional)">
                  <TextInput
                    type="number"
                    inputMode="decimal"
                    value={editing.originalPrice ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        originalPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </Field>
                <Field label="Moneda">
                  <TextInput
                    value={editing.currency}
                    onChange={(e) =>
                      setEditing({ ...editing, currency: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <TextArea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Describe el producto..."
                />
              </Field>

              <Field label="Tallas (separadas por coma)">
                <TextInput
                  value={editing.sizes.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sizes: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="S, M, L, XL"
                />
              </Field>

              <Field label="Imágenes" hint="Sube varias fotos para el carrusel de ángulos.">
                <ImageUploader
                  value={editing.images}
                  onChange={(urls) => setEditing({ ...editing, images: urls })}
                />
              </Field>

              <div className="flex items-center gap-8 rounded-2xl border border-white/8 bg-white/3 p-4">
                <Toggle
                  label="Destacado"
                  checked={editing.featured}
                  onChange={(v) => setEditing({ ...editing, featured: v })}
                  icon={<Star size={14} className="text-volt" />}
                />
                <Toggle
                  label="En stock"
                  checked={editing.inStock}
                  onChange={(v) => setEditing({ ...editing, inStock: v })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)} className="border border-white/10">
                Cancelar
              </Button>
              <Button variant="volt" onClick={save}>
                Guardar producto
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
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
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-6 sm:max-w-2xl sm:rounded-3xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm font-semibold"
    >
      {icon}
      <span>{label}</span>
      <span
        className={`relative ml-1 h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-volt" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
