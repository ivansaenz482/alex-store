import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/site/ServiceWorkerRegister";

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
  applicationName: "ALEX.STORE",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ALEX.STORE",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/api/pwa-icon?size=32", sizes: "32x32", type: "image/png" },
      { url: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/api/pwa-icon?size=512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/api/pwa-icon?size=180", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ALEX.STORE",
    description:
      "Camisas de fútbol y perfumes originales. Estilo que se nota, precio que se agradece.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
