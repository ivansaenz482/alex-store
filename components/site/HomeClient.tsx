"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { Product, StoreData } from "@/lib/types";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { CategoriesSection } from "./CategoriesSection";
import { PromotionsSection } from "./PromotionsSection";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { ProductGrid } from "./ProductGrid";
import { ProductModal } from "./ProductModal";
import { WhatsappFloat } from "./WhatsappFloat";
import { Footer } from "./Footer";

export function HomeClient({ data }: { data: StoreData }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const featured = useMemo(
    () => data.products.filter((p) => p.featured),
    [data.products]
  );

  const track = useCallback(
    (payload: object) => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },
    []
  );

  useEffect(() => {
    track({ kind: "visit" });
  }, [track]);

  const openProduct = useCallback(
    (p: Product) => {
      setActiveProduct(p);
      track({ kind: "product", productId: p.id });
    },
    [track]
  );

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <Navbar
        announcement={data.store.announcement}
        whatsapp={data.whatsapp}
      />

      <Hero
        storeName={data.store.name}
        slogan={data.store.slogan}
        whatsapp={data.whatsapp}
      />

      <CategoriesSection categories={data.categories} onSelect={selectCategory} />

      {data.promotions.length > 0 && (
        <PromotionsSection promotions={data.promotions} onSelectCategory={selectCategory} />
      )}

      {featured.length > 0 && (
        <FeaturedCarousel
          products={featured}
          categories={data.categories}
          onView={openProduct}
        />
      )}

      <ProductGrid
        products={data.products}
        categories={data.categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onView={openProduct}
      />

      <Footer data={data} />

      <AnimatePresence>
        {activeProduct && (
          <ProductModal
            key={activeProduct.id}
            product={activeProduct}
            category={data.categories.find(
              (c) => c.id === activeProduct.categoryId
            )}
            whatsappNumber={data.whatsapp.number}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </AnimatePresence>

      <WhatsappFloat
        number={data.whatsapp.number}
        message={data.whatsapp.message}
      />
    </div>
  );
}
