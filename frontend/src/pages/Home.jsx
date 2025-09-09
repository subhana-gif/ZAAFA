import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://zaafa-backend.onrender.com/api";

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to convert base64 to data URL
  const getImageUrl = (base64String) => {
    if (!base64String) return null;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const goToProducts = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  const goToAllProducts = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 my-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
              Premium
            </span>
            <br />
            <span className="text-gray-900">Collection</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover luxury products with exceptional quality and style
          </p>
          <button 
            onClick={goToAllProducts}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-yellow-600">Shop by Category</h3>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-md">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => goToProducts(category._id)}
                  className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-md bg-white hover:shadow-lg"
                >
                  <div className="p-6 text-center">
                    {category.image ? (
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        className="w-24 h-24 mx-auto mb-4 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-yellow-200 flex items-center justify-center">
                        <span className="text-yellow-600 text-2xl font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h4 className="text-lg font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-2">{category.description}</p>
                    )}
                    <div className="flex items-center justify-center mt-3 text-yellow-600">
                      <span className="text-sm">View Products</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}