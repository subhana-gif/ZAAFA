import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Construct URL
      let url = `${API_BASE_URL}/products?limit=${limit}&page=${page}`;
      if (categoryId) url += `&category=${categoryId}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchQuery, page]);

  const getImageUrl = (base64String) =>
    base64String ? `data:image/jpeg;base64,${base64String}` : null;

  const goToProduct = (productId) => navigate(`/product/${productId}`);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-600 mb-8">
          {categoryId ? "Category Products" : searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-md">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <p className="text-gray-600">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => goToProduct(product._id)}
                    className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-md bg-white hover:shadow-lg"
                  >
                    <div className="p-6 text-center">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-yellow-200 flex items-center justify-center">
                          <span className="text-yellow-600 text-2xl font-bold">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h4 className="text-lg font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                        {product.name}
                      </h4>
                      {product.price && <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-200"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
