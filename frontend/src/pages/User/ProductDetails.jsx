import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Footer from "./footer";

const ownerNumber = "7736062779";
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://zaafa-backend.onrender.com/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!product);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center",
    transform: "scale(1)",
  });

  const [lastDistance, setLastDistance] = useState(null);

  useEffect(() => {
    if (!product && id) {
      fetchProduct();
    }
  }, [id, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
      setSelectedImage(data.images?.[0] || null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product?.category?._id) {
      fetchRelatedProducts(product.category._id, product._id);
    }
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const fetchRelatedProducts = async (categoryId, excludeProductId) => {
    try {
      setLoadingRelated(true);
      const response = await fetch(
        `${API_BASE_URL}/products?limit=4&category=${categoryId}`
      );
      if (!response.ok) throw new Error("Failed to fetch related products");
      const data = await response.json();
      const filtered = data.products.filter((p) => p._id !== excludeProductId);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRelated(false);
    }
  };

  const properPrice = (() => {
    if (!product || !product.offer) return product?.price || 0;
    const { price, offer } = product;
    if (!offer.isActive) return price;
    switch (offer.discountType) {
      case "fixed":
        return price - (offer.discountValue || 0);
      case "percentage":
        return price - ((offer.discountValue || 0) / 100) * price;
      default:
        return price;
    }
  })();

  const getImageUrl = (base64String) =>
    base64String ? `data:image/jpeg;base64,${base64String}` : null;

  const handleBuyOnWhatsApp = (product) => {
    const productUrl = `https://zaafa.vercel.app/product/${product._id}`;
    const message = `Hello, I want to buy:\n\n${product.name}\nPrice: AED ${properPrice.toFixed(
      0
    )}\n\nCheck it here: ${productUrl}`;
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const goToProductDetail = (p) => {
    window.scrollTo(0, 0);
    setProduct(p);
    setRelatedProducts([]);
  };

  // Desktop hover zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
  };

  // Mobile pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastDistance) {
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      let scale = newDistance / lastDistance;
      const currentScale =
        parseFloat(
          zoomStyle.transform.replace("scale(", "").replace(")", "")
        ) || 1;
      let nextScale = Math.min(3, Math.max(1, currentScale * scale));
      setZoomStyle({
        transformOrigin: "center",
        transform: `scale(${nextScale})`,
      });
      setLastDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
  };

  const getDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{error || "Product not found"}</p>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">


{/* ---------------- MOBILE VIEW ---------------- */}
<div className="block lg:hidden w-full">
  {/* Main Image */}
  <div
    className="relative rounded-xl shadow-lg bg-gray-50 overflow-hidden touch-none w-full"
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {selectedImage ? (
      <img
  src={getImageUrl(selectedImage)}
  alt={product.name}
  className="w-full max-w-full h-auto object-contain transition-transform duration-150"
  style={zoomStyle}
/>

    ) : (
      <div className="w-full h-[350px] bg-yellow-100 flex items-center justify-center">
        <span className="text-yellow-600 text-6xl font-bold">
          {product.name.charAt(0)}
        </span>
      </div>
    )}
  </div>

  {/* Thumbnails under main image - horizontal scroll */}
  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
    {product.images?.map((img, idx) => (
      <img
        key={idx}
        src={getImageUrl(img)}
        alt={`thumb-${idx}`}
        onClick={() => setSelectedImage(img)}
        className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 border ${
          selectedImage === img
            ? "border-yellow-500 ring-2 ring-yellow-400"
            : "border-gray-200"
        }`}
      />
    ))}
  </div>
</div>

{/* ---------------- DESKTOP VIEW ---------------- */}
<div className="hidden lg:flex gap-4">
  {/* Thumbnails (left) */}
  <div className="flex flex-col gap-3">
    {product.images?.map((img, idx) => (
      <img
        key={idx}
        src={getImageUrl(img)}
        alt={`thumb-${idx}`}
        onClick={() => setSelectedImage(img)}
        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
          selectedImage === img
            ? "border-yellow-500 ring-2 ring-yellow-400"
            : "border-gray-200"
        }`}
      />
    ))}
  </div>

  {/* Main Image (right) */}
  <div
    className="flex-1 relative rounded-xl shadow-lg bg-gray-50 overflow-hidden touch-none"
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {selectedImage ? (
      <img
        src={getImageUrl(selectedImage)}
        alt={product.name}
        className="w-full h-[600px] object-contain transition-transform duration-150"
        style={zoomStyle}
      />
    ) : (
      <div className="w-full h-[600px] bg-yellow-100 flex items-center justify-center">
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="text-4xl font-bold text-yellow-600 mb-6">
                  {product.offer ? (
                    <>
                      <span className="line-through mr-2 text-gray-500">
                        AED {product.price}
                      </span>
                      <span>AED {properPrice.toFixed(0)}</span>
                    </>
                  ) : (
                    <>AED {properPrice.toFixed(0)}</>
                  )}
                </div>
              </div>
              {product.category && (
                <div>
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                    {product.category.name}
                  </span>
                </div>
              )}
              <div className="space-y-4 pt-6">
                <button
                  onClick={() => handleBuyOnWhatsApp(product)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Buy Now on WhatsApp
                </button>
                {product.description ? (
                  <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
                    {product.description.split("\n").map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    No description available for this product.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
{relatedProducts.length > 0 && (
  <div className="mt-16">
    <h2 className="text-3xl font-bold text-yellow-600 mb-6">
      Related Products
    </h2>

    {loadingRelated ? (
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="min-w-[220px] bg-white rounded-xl p-6 animate-pulse shadow-md flex-shrink-0"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((p) => (
          <div
            key={p._id}
            onClick={() => goToProductDetail(p)}
            className="min-w-[220px] group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-md bg-white hover:shadow-lg flex-shrink-0"
          >
            <div className="p-4 text-center">
              {p.images?.[0] ? (
                <img
                  src={getImageUrl(p.images[0])}
                  alt={p.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-yellow-200 flex items-center justify-center">
                  <span className="text-yellow-600 text-2xl font-bold">
                    {p.name.charAt(0)}
                  </span>
                </div>
              )}
              <h4 className="text-lg font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                {p.name}
              </h4>
              <p className="text-sm text-gray-500 mt-1">AED {p.price}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        </div>
      </section>
      <Footer />
    </div>
  );
}
