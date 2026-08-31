import type { NextConfig } from "next";

// `output: "standalone"` es SOLO para self-hosting (Docker/VPS).
// En Vercel NO debe activarse (rompe el .nft del build), así que se controla por env:
//   Docker:   NEXT_OUTPUT_STANDALONE=true  -> build standalone (server.js)
//   Vercel:   (sin variable)               -> output por defecto de Vercel
const nextConfig: NextConfig =
  process.env.NEXT_OUTPUT_STANDALONE === "true" ? { output: "standalone" } : {};

export default nextConfig;
