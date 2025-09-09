import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";

const ownerNumber = "7736062779";
const API_BASE_URL = "https://zaafa-backend.onrender.com/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState("");

  // Fetch product if not passed via state
  useEffect(() => {
    if (!product && id) {
      fetchProduct();
    }
  }, [id, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert base64 to data URL
  const getImageUrl = (base64String) => {
    if (!base64String) return null;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleBuyOnWhatsApp = (product) => {
    const productUrl = `${window.location.origin}/product/${product._id}`;
    const message = `Hello, I want to buy:\n\n*${product.name}*\nPrice: Rs.${product.price}\n\nCheck it here: ${productUrl}`;
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Product</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Product Detail Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-96 lg:h-[500px] bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-6xl font-bold">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="text-4xl font-bold text-yellow-600 mb-6">
                  ₹{product.price}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {product.category && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Category</h3>
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                    {product.category.name}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-6">
                <button
                  onClick={() => handleBuyOnWhatsApp(product)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Buy Now on WhatsApp
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </button>
              </div>

              {/* Product Info */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3">Why Choose This Product?</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Premium quality guaranteed</li>
                  <li>• Fast and secure delivery</li>
                  <li>• Customer satisfaction assured</li>
                  <li>• Easy WhatsApp ordering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}