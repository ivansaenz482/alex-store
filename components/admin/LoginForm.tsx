"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/site/ui";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
    } else {
      setError("Contraseña incorrecta");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-volt/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-magenta/20 blur-[130px]" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-surface p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-volt/10 text-volt">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-extrabold">Acceso de administrador</h1>
          <p className="mt-1 text-sm text-white/50">
            Ingresa la contraseña para continuar
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
            Contraseña
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-volt"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="mt-3 text-sm text-magenta">{error}</p>}

        <Button variant="volt" className="mt-5 w-full" type="submit" disabled={loading}>
          <LogIn size={16} /> {loading ? "Entrando..." : "Iniciar sesión"}
        </Button>

        <p className="mt-5 text-center text-xs text-white/35">
          ¿No sabes la contraseña? Revisa la variable{" "}
          <code className="text-volt">ADMIN_PASSWORD</code> en{" "}
          <code className="text-volt">.env</code>.
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-xs text-white/40 hover:text-white">
            ← Volver a la tienda
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
