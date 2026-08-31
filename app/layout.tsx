import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ALEX.STORE | Camisas de Fútbol y Perfumes",
  description:
    "Camisas de fútbol y perfumes originales. Estilo que se nota, precio que se agradece. Envíos a todo el país.",
  keywords: ["camisas de fútbol", "perfumes", "ALEX.STORE", "jerseys de futbol"],
  openGraph: {
    title: "ALEX.STORE",
    description:
      "Camisas de fútbol y perfumes originales. Estilo que se nota, precio que se agradece.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
