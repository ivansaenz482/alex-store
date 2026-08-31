import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import AdminLogin from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Acceso Admin | ALEX.STORE" };

export default async function AdminLoginPage() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (validateToken(token)) {
    redirect("/admin");
  }
  return <AdminLogin />;
}
