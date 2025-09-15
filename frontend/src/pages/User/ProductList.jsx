import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductListPage({ categoryId, brandId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://zaafa-backend.onrender.com/api";

  const navigate = useNavigate();

  // Sync props
  useEffect(() => {
    setSelectedBrand(brandId || "all");
    setSelectedCategory(categoryId || "all");
  }, [brandId, categoryId]);

  // Fetch category info & brands under it
  useEffect(() => {
    const fetchCategoryAndBrands = async () => {
      if (categoryId && categoryId !== "all") {
        try {
          const categoryRes = await axios.get(
            `${API_BASE_URL}/categories/${categoryId}`
          );
          setCategory(categoryRes.data);

          const brandsRes = await axios.get(
            `${API_BASE_URL}/brands/user?category=${categoryId}`
          );
          setBrands(brandsRes.data || []);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchCategoryAndBrands();
  }, [categoryId]);

  // Fetch brand info & categories under it
  useEffect(() => {
    const fetchBrandAndCategories = async () => {
      if (brandId && brandId !== "all") {
        try {
          const brandRes = await axios.get(
            `${API_BASE_URL}/brands/${brandId}`
          );
          setBrand(brandRes.data);

          const categoriesRes = await axios.get(
            `${API_BASE_URL}/categories/user?brand=${brandId}`
          );
          setCategories(categoriesRes.data || []);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchBrandAndCategories();
  }, [brandId]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (
        (selectedCategory === "all" || !selectedCategory) &&
        (selectedBrand === "all" || !selectedBrand)
      ) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const params = { page, limit: 8 };
        if (selectedCategory && selectedCategory !== "all")
          params.category = selectedCategory;
        if (selectedBrand && selectedBrand !== "all") params.brand = selectedBrand;

        const res = await axios.get(
          `${API_BASE_URL}/products/user`,
          { params }
        );
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, page]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!loading && !products.length)
    return (
      <p className="text-center py-10 text-gray-500">No products found.</p>
    );

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      {/* Heading & Filter */}
      <div className="text-center mb-8">
        {category && selectedCategory !== "all" ? (
          <>
            <h1 className="text-5xl font-bold text-yellow-600">{category.name}</h1>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </>
        ) : brand && selectedBrand !== "all" ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800">{brand.name}</h2>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={
                product.images[0]
                  ? `data:image/jpeg;base64,${product.images[0]}`
                  : "https://via.placeholder.com/400"
              }
              alt={product.name}
              className="w-full aspect-square object-contain bg-gray-50"
            />
            <div className="p-4">
              <h1 className="font-semibold text-xl">{product.name}</h1>
<p className="text-yellow-600 mt-2 text-xl">
  {product.offer ? (
    <>
      {(() => {
        const finalPrice = Math.max(
          product.price -
            (product.offer.discountType === "percentage"
              ? (product.offer.discountValue / 100) * product.price
              : product.offer.discountValue),
          0
        ).toFixed(0);

        return (
          <>
            <span className="line-through text-gray-500 block">AED {product.price}</span>
            <span className="text-yellow-600 font-bold block">AED {finalPrice}</span>
          </>
        );
      })()}
    </>
  ) : (
    <span className="text-yellow-600 font-bold">AED {product.price}</span>
  )}
</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`w-3 h-3 rounded-full ${
                page === idx + 1 ? "bg-yellow-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
