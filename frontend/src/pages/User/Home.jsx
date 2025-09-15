import { useState, useRef, useEffect } from "react";
import HeroSlider from "./HeroSlider";
import BrandCarousel from "./BrandSlider";
import CategoryCarousel from "./Category";
import ProductListPage from "./ProductList";
import Footer from "./footer";

export default function HomePage({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
}) {

  // ✅ Ref for the products section
  const productsRef = useRef(null);

  // ✅ Scroll when brand or category changes
  useEffect(() => {
    if (selectedCategory || selectedBrand) {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCategory, selectedBrand]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSlider />

      <main className="flex-grow">
        {/* Brand Section */}
        <section className="py-10 bg-gray-50 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shop by Brand
          </h2>
          <BrandCarousel
            onBrandSelect={(brandId) => {
              setSelectedBrand(brandId);
              setSelectedCategory(null); // clear category if brand selected
            }}
          />
        </section>

        {/* Category Section */}
        <section className="py-10 bg-gray-50 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shop by Category
          </h2>
          <CategoryCarousel
            onCategorySelect={(categoryId) => setSelectedCategory(categoryId)}
          />
        </section>

        {/* Products Section */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shop by Products
          </h2>

        <section
          className="py-10 bg-white w-full"
          ref={productsRef} // ✅ attach ref here
        >
          {selectedCategory || selectedBrand ? (
            <ProductListPage
              categoryId={selectedCategory}
              brandId={selectedBrand}
            />
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg font-medium">
              Select a category or brand to see products
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
