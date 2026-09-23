import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALEX.STORE | Camisas de Fútbol y Perfumes",
    short_name: "ALEX.STORE",
    description:
      "Camisas de fútbol y perfumes originales. Estilo que se nota, precio que se agradece. Envíos a todo el país.",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#050507",
    theme_color: "#050507",
    lang: "es",
    dir: "ltr",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/pwa-icon?size=512&maskable=1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Ver catálogo",
        short_name: "Catálogo",
        description: "Explora camisas de fútbol, perfumes y accesorios",
        url: "/#catalogo",
        icons: [
          { src: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
        ],
      },
      {
        name: "Panel de administración",
        short_name: "Admin",
        description: "Administra productos, categorías y promociones",
        url: "/admin",
        icons: [
          { src: "/api/pwa-icon?size=192", sizes: "192x192", type: "image/png" },
        ],
      },
    ],
  };
}
