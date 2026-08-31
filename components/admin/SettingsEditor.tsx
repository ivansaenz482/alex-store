"use client";
import { useState } from "react";
import { Save, Store, MessageCircle } from "lucide-react";
import type { StoreData, StoreSettings, WhatsAppSettings } from "@/lib/types";
import { Field, TextInput, TextArea } from "./fields";
import { Button } from "@/components/site/ui";

export function SettingsEditor({
  data,
  onChange,
}: {
  data: StoreData;
  onChange: (data: Partial<StoreData>) => void;
}) {
  const [store, setStore] = useState<StoreSettings>({ ...data.store });
  const [whatsapp, setWhatsapp] = useState<WhatsAppSettings>({ ...data.whatsapp });

  function save() {
    onChange({ store, whatsapp });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Store size={20} className="text-volt" /> Datos de la tienda
        </h2>
        <div className="space-y-4 rounded-2xl border border-white/8 bg-white/3 p-5">
          <Field label="Nombre">
            <TextInput
              value={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
            />
          </Field>
          <Field label="Eslogan">
            <TextInput
              value={store.slogan}
              onChange={(e) => setStore({ ...store, slogan: e.target.value })}
            />
          </Field>
          <Field label="Anuncio (barra superior)">
            <TextInput
              value={store.announcement}
              onChange={(e) => setStore({ ...store, announcement: e.target.value })}
            />
          </Field>
          <Field label="Descripción (footer)">
            <TextArea
              value={store.description}
              onChange={(e) => setStore({ ...store, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram">
              <TextInput
                value={store.instagram ?? ""}
                onChange={(e) => setStore({ ...store, instagram: e.target.value })}
              />
            </Field>
            <Field label="TikTok">
              <TextInput
                value={store.tiktok ?? ""}
                onChange={(e) => setStore({ ...store, tiktok: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Email">
            <TextInput
              value={store.email ?? ""}
              onChange={(e) => setStore({ ...store, email: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <MessageCircle size={20} className="text-[#25D366]" /> WhatsApp
        </h2>
        <div className="space-y-4 rounded-2xl border border-white/8 bg-white/3 p-5">
          <Field label="Número (con código de país)">
            <TextInput
              value={whatsapp.number}
              onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })}
              placeholder="+521234567890"
            />
          </Field>
          <Field label="Mensaje predeterminado">
            <TextArea
              value={whatsapp.message}
              onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="volt" onClick={save}>
          <Save size={16} /> Guardar cambios
        </Button>
      </div>
    </div>
  );
}
