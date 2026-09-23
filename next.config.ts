import type { NextConfig } from "next";

// `output: "standalone"` es SOLO para self-hosting (Docker/VPS).
// En Vercel NO debe activarse (rompe el .nft del build), así que se controla por env:
//   Docker:   NEXT_OUTPUT_STANDALONE=true  -> build standalone (server.js)
//   Vercel:   (sin variable)               -> output por defecto de Vercel
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // El Service Worker siempre debe revalidarse para recibir actualizaciones.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

if (process.env.NEXT_OUTPUT_STANDALONE === "true") {
  nextConfig.output = "standalone";
}

export default nextConfig;
