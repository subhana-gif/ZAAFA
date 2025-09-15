import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import BrandCarousel from "./BrandSlider";
import CategoryCarousel from "./Category";
import ProductListPage from "./ProductList";
import Footer from "./footer";

export default function HomePage() {
  const { categoryId } = useParams(); // ✅ from route

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const productsRef = useRef(null);

  // ✅ When URL param changes, set selectedCategory
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
      setSelectedBrand(null);
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategory || selectedBrand) {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCategory, selectedBrand]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
              setSelectedCategory(null);
            }}
          />
        </section>

        {/* Category Section */}
        <section className="py-10 bg-gray-50 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shop by Category
          </h2>
          <CategoryCarousel onCategorySelect={(id) => setSelectedCategory(id)} />
        </section>

        {/* Products Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Shop by Products
        </h2>

        <section className="py-10 bg-white w-full" ref={productsRef}>
          {selectedCategory || selectedBrand ? (
            <ProductListPage categoryId={selectedCategory} brandId={selectedBrand} />
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg font-medium">
              Select a category or brand to see products
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
