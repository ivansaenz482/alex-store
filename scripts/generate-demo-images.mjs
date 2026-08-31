import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const store = JSON.parse(
  await fs.readFile(path.join(root, "data", "store.json"), "utf8")
);
const outDir = path.join(root, "public", "demo");
await fs.mkdir(outDir, { recursive: true });

const hex2rgb = (hex) => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};
const rgba = (hex, a) => `rgba(${hex2rgb(hex).join(",")},${a})`;
const mix = (a, b, t) => {
  const [r1, g1, b1] = hex2rgb(a);
  const [r2, g2, b2] = hex2rgb(b);
  return `rgb(${[
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ].join(",")})`;
};

const stripes = (color, id) => `
  <pattern id="st${id}" width="60" height="60" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <rect width="60" height="60" fill="none"/>
    <rect width="14" height="60" fill="${rgba(color, 0.09)}"/>
  </pattern>`;

function svgLogo(x, y, scale = 1) {
  return `
    <g transform="translate(${x},${y}) scale(${scale})" font-family="Arial,sans-serif" font-weight="800">
      <text y="0" font-size="26" fill="#ccff00">A</text>
      <text x="16" y="0" font-size="26" fill="url(#logo)">LEX.STORE</text>
    </g>`;
}

function productSVG(img, product, category) {
  const accent = category.accent || "#ccff00";
  const w = 800, h = 1000;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b10"/>
      <stop offset="1" stop-color="#16161f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="${rgba(accent, 0.55)}"/>
      <stop offset="1" stop-color="${rgba(accent, 0)}"/>
    </radialGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ccff00"/>
      <stop offset="0.5" stop-color="#7c5cff"/>
      <stop offset="1" stop-color="#ff2e9a"/>
    </linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${rgba(accent, 0.0)}"/>
      <stop offset="0.5" stop-color="${rgba(accent, 0.9)}"/>
      <stop offset="1" stop-color="${rgba(accent, 0.0)}"/>
    </linearGradient>
    ${stripes(accent, img)}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#st${img})"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${svgLogo(40, 60)}
  <circle cx="${w / 2}" cy="${h * 0.40}" r="150" fill="none" stroke="${rgba(accent, 0.14)}" stroke-width="2"/>
  <text x="${w / 2}" y="${h * 0.42}" font-size="230" text-anchor="middle">${category.emoji}</text>
  <rect x="60" y="${h * 0.60}" width="${w - 120}" height="4" rx="2" fill="url(#band)"/>
  <text x="${w / 2}" y="${h * 0.72}" font-family="Arial,sans-serif" font-weight="800" font-size="42" text-anchor="middle" fill="#ffffff">${escapeXml(product.name)}</text>
  <text x="${w / 2}" y="${h * 0.79}" font-family="Arial,sans-serif" font-size="22" text-anchor="middle" fill="${rgba(accent, 1)}" letter-spacing="4" text-transform="uppercase">${escapeXml(category.name)}</text>
</svg>`;
}

function categorySVG(img, category) {
  const accent = category.accent || "#ccff00";
  const w = 1200, h = 900;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bgc" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b10"/>
      <stop offset="1" stop-color="#16161f"/>
    </linearGradient>
    <radialGradient id="glowc" cx="0.5" cy="0.5" r="0.55">
      <stop offset="0" stop-color="${rgba(accent, 0.5)}"/>
      <stop offset="1" stop-color="${rgba(accent, 0)}"/>
    </radialGradient>
    <linearGradient id="bandc" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${rgba(accent, 0.0)}"/>
      <stop offset="0.5" stop-color="${rgba(accent, 0.9)}"/>
      <stop offset="1" stop-color="${rgba(accent, 0.0)}"/>
    </linearGradient>
    ${stripes(accent, img)}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgc)"/>
  <rect width="${w}" height="${h}" fill="url(#st${img})"/>
  <rect width="${w}" height="${h}" fill="url(#glowc)"/>
  ${svgLogo(50, 70, 1.2)}
  <text x="${w / 2}" y="${h * 0.52}" font-size="260" text-anchor="middle">${category.emoji}</text>
  <text x="${w / 2}" y="${h * 0.70}" font-family="Arial,sans-serif" font-weight="800" font-size="64" text-anchor="middle" fill="#ffffff">${escapeXml(category.name)}</text>
  <rect x="240" y="${h * 0.78}" width="${w - 480}" height="4" rx="2" fill="url(#bandc)"/>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const files = [];
const catById = Object.fromEntries(store.categories.map((c) => [c.id, c]));

for (const category of store.categories) {
  const name = `cat-${category.id}.svg`;
  await fs.writeFile(path.join(outDir, name), categorySVG(name, category));
  files.push({ type: "category", id: category.id, file: `/demo/${name}` });
}

for (const product of store.products) {
  const category = catById[product.categoryId] || { emoji: "🛍️", name: "Producto", accent: "#ccff00" };
  const name = `${product.id}.svg`;
  await fs.writeFile(path.join(outDir, name), productSVG(name, product, category));
  files.push({ type: "product", id: product.id, file: `/demo/${name}` });
}

console.log(JSON.stringify(files, null, 2));
