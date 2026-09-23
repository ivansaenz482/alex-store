"use client";
import { useEffect, useState } from "react";
import { Bell, BellRing, BellOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "loading" | "unsupported" | "disabled" | "off" | "on" | "denied";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

export function PushButton({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setStatus("denied");
        return;
      }

      const res = await fetch("/api/push/public-key")
        .then((r) => r.json())
        .catch(() => null);
      if (cancelled) return;
      if (!res?.enabled || !res.publicKey) {
        setStatus("disabled");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (!cancelled) setStatus(existing ? "on" : "off");
      } catch {
        if (!cancelled) setStatus("off");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const res = await fetch("/api/push/public-key").then((r) => r.json());
      if (!res?.publicKey) {
        setStatus("disabled");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(res.publicKey) as BufferSource,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
      setStatus("on");
    } catch {
      setStatus("off");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("off");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || status === "unsupported" || status === "disabled") {
    return null;
  }

  const active = status === "on";
  const denied = status === "denied";

  return (
    <button
      type="button"
      disabled={busy || denied}
      onClick={() => (active ? disable() : enable())}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.97] disabled:opacity-60",
        active
          ? "border-volt/40 bg-volt/10 text-volt hover:bg-volt hover:text-background"
          : "border-white/15 bg-white/5 text-white/75 hover:border-volt hover:text-volt",
        className
      )}
    >
      {busy ? (
        <Loader2 size={15} className="animate-spin" />
      ) : denied ? (
        <BellOff size={15} />
      ) : active ? (
        <BellRing size={15} />
      ) : (
        <Bell size={15} />
      )}
      {denied
        ? "Notificaciones bloqueadas"
        : active
          ? "Notificaciones activadas"
          : "Recibir ofertas"}
    </button>
  );
}
