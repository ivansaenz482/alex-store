import { type NextRequest } from "next/server";
import { getAnalyticsModel, clearAnalytics } from "@/lib/analytics";
import { readStore } from "@/lib/store";
import { validateToken, COOKIE_NAME } from "@/lib/auth";

const pad = (n: number) => String(n).padStart(2, "0");
function iso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!validateToken(token)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const [model, store] = await Promise.all([getAnalyticsModel(), readStore()]);

  const now = new Date();
  const today = iso(now);
  const month = today.slice(0, 7);
  const year = today.slice(0, 4);

  const visits = model.visits ?? {};
  const total = Object.values(visits).reduce((a, b) => a + b, 0);
  const thisMonth = Object.entries(visits)
    .filter(([k]) => k.startsWith(month))
    .reduce((a, [, v]) => a + v, 0);
  const thisYear = Object.entries(visits)
    .filter(([k]) => k.startsWith(year))
    .reduce((a, [, v]) => a + v, 0);

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = daysAgo(13 - i);
    return { date: d, count: visits[d] ?? 0 };
  });

  const productViews = model.productViews ?? {};
  const daily = model.daily ?? {};

  const weekKeys = new Set(
    Array.from({ length: 7 }, (_, i) => daysAgo(i))
  );
  const weekCounts: Record<string, number> = {};
  for (const [date, map] of Object.entries(daily)) {
    if (!weekKeys.has(date)) continue;
    for (const [pid, c] of Object.entries(map)) {
      weekCounts[pid] = (weekCounts[pid] ?? 0) + c;
    }
  }

  const nameOf = (id: string) =>
    store.products.find((p) => p.id === id)?.name ?? "Producto eliminado";

  const topProducts = Object.entries(productViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([id, count]) => ({ id, name: nameOf(id), count, weekly: weekCounts[id] ?? 0 }));

  const topProductsWeek = Object.entries(weekCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({ id, name: nameOf(id), count }));

  const catTotals: Record<string, number> = {};
  const catName: Record<string, string> = {};
  for (const p of store.products) {
    catTotals[p.categoryId] = (catTotals[p.categoryId] ?? 0) + (productViews[p.id] ?? 0);
    const cat = store.categories.find((c) => c.id === p.categoryId);
    if (cat) catName[p.categoryId] = cat.emoji + " " + cat.name;
  }
  const topCategories = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, name: catName[id] ?? "Sin categoría", count }));

  return Response.json({
    visitors: { today: visits[today] ?? 0, month: thisMonth, year: thisYear, total },
    views: { total: Object.values(productViews).reduce((a, b) => a + b, 0) },
    last14,
    topProducts,
    topProductsWeek,
    topCategories,
  });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!validateToken(token)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  await clearAnalytics();
  return Response.json({ ok: true });
}
