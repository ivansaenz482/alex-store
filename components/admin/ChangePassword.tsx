"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/site/ui";

export function ChangePassword() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (next !== confirm) {
      setStatus({ ok: false, msg: "Las contraseñas no coinciden." });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, next }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setStatus({ ok: true, msg: "Contraseña cambiada. Inicia sesión de nuevo..." });
      await fetch("/api/admin/logout", { method: "POST" });
      setTimeout(() => router.replace("/admin/login"), 1200);
    } else {
      setStatus({ ok: false, msg: data.error ?? "No se pudo cambiar la contraseña." });
    }
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <h3 className="mb-1 flex items-center gap-2 font-bold">
        <KeyRound size={18} className="text-volt" /> Cambiar contraseña de administrador
      </h3>
      <p className="mb-4 text-sm text-white/50">
        Se guarda en la nube (Supabase) y persiste en tu Vercel.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
            Contraseña actual
          </span>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-volt"
            placeholder="••••••••"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
              Nueva contraseña
            </span>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-volt"
              placeholder="Mínimo 6 caracteres"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
              Confirmar nueva
            </span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-volt"
              placeholder="Repite la contraseña"
            />
          </label>
        </div>

        {status && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              status.ok ? "bg-volt/10 text-volt" : "bg-magenta/10 text-magenta"
            }`}
          >
            {status.ok ? <Check size={16} /> : <AlertTriangle size={16} />}
            {status.msg}
          </div>
        )}

        <Button variant="volt" type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
          Cambiar contraseña
        </Button>
      </form>
    </div>
  );
}
