import { readStore } from "@/lib/store";
import { HomeClient } from "@/components/site/HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await readStore();
  return <HomeClient data={data} />;
}
