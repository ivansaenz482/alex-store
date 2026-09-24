"use client";
import { useEffect, useState } from "react";
import { BellRing, Send, Loader2, Users } from "lucide-react";
import { Field, TextInput, TextArea } from "./fields";
import { Button } from "@/components/site/ui";

interface PushInfo {
  enabled: boolean;
  subscribers: number;
}

export function NotificationsPanel() {
  const [info, setInfo] = useState<PushInfo | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/#catalogo");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/push/send")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setInfo(data as PushInfo);
      })
      .catch(() => undefined);
  }, []);

  async function send() {
    setSending(true);
    setMessage("");
    const res = await fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, url }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMessage(`Enviada a ${data.sent ?? 0} dispositivo(s)`);
      setTitle("");
      setBody("");
    } else {
      setMessage(`${data.error ?? "No se pudo enviar"}`);
    }
    setSending(false);
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <BellRing size={20} className="text-volt" /> Notificaciones push
      </h2>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Users size={15} className="text-volt" />
          {info
            ? `${info.subscribers} dispositivo(s) suscrito(s)`
            : "Cargando suscriptores..."}
        </div>

        {info && !info.enabled && (
          <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
            Las notificaciones están desactivadas: configura{" "}
            <code>VAPID_PUBLIC_KEY</code> y <code>VAPID_PRIVATE_KEY</code> (o usa
            un servidor con disco para generarlas solas).
          </p>
        )}

        <Field label="Título">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nuevos ingresos en ALEX.STORE"
          />
        </Field>

        <Field label="Mensaje">
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Llegaron camisas nuevas. ¡Míralas antes que nadie!"
          />
        </Field>

        <Field label="Enlace al abrir (opcional)">
          <TextInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/#catalogo"
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-white/45">
            {message || "Se envía a todos los suscritos."}
          </span>
          <Button
            variant="volt"
            onClick={send}
            disabled={sending || !title.trim() || !body.trim()}
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Enviar notificación
          </Button>
        </div>
      </div>
    </div>
  );
}
