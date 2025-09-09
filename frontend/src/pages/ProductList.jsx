import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, Star, Heart, Search, User, Phone, Mail, MapPin, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

const ownerNumber = "7736062779";
const API_BASE_URL = "https://zaafa-backend.onrender.com/api"; // Update with your backend URL

export default function ZaafaStore() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'products', 'product-detail'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

const handleBuyOnWhatsApp = (product) => {
  const message = `Hello, I want to buy:\n\n*${product.name}*\nPrice: Rs.${product.price}\n\nPlease share details.`;
  const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

const handleDirectWhatsApp = () => {
  const message = "Hello, I’d like to know more about your products.";
  const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

  // Helper function to convert base64 to data URL
  const getImageUrl = (base64String) => {
    if (!base64String) return null;
    return `data:image/jpeg;base64,${base64String}`;
  };

  // Navigation functions
  const goToProducts = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage('products');
  };

  const goToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const goToHome = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const goBack = () => {
    if (currentPage === 'product-detail') {
      setCurrentPage('products');
      setSelectedProduct(null);
    } else if (currentPage === 'products') {
      setCurrentPage('home');
      setSelectedCategory(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || (product.category && product.category._id === selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-yellow-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={goToHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-600">ZAAFA</h1>
              <p className="text-xs text-gray-600">Online Store</p>
            </div>
          </div>

          {/* Back Button for non-home pages */}
          {currentPage !== 'home' && (
            <button
              onClick={goBack}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-600 font-medium">Back</span>
            </button>
          )}

          {/* Search Bar - Only show on products page */}
          {currentPage === 'products' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:bg-white text-gray-900"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}

        </div>

        {/* Mobile Search - Only show on products page */}
        {currentPage === 'products' && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:bg-white text-gray-900"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Home Page Component
  const HomePage = () => (
    <>
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
            onClick={() => setCurrentPage('products')}
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
    </>
  );

  // Products Page Component
  const ProductsPage = () => {
    const categoryName = categories.find(c => c._id === selectedCategory)?.name || 'All';
    
    return (
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-yellow-600 mb-2">
              {categoryName} Products
            </h3>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse shadow-md border">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => goToProductDetail(product)}
                  className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 text-4xl font-bold">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">({product.rating || '4.0'})</span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-yellow-600">₹{product.price}</span>
                      <div className="flex items-center text-yellow-600">
                        <span className="text-sm">View Details</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or browse other categories</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Product Detail Page Component
  const ProductDetailPage = () => {
    if (!selectedProduct) return null;

    return (
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl">
                {selectedProduct.image ? (
                  <img
                    src={getImageUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-96 lg:h-[500px] bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-6xl font-bold">
                      {selectedProduct.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(selectedProduct.rating || 4) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-3">({selectedProduct.rating || '4.0'}) Reviews</span>
                </div>

                <div className="text-4xl font-bold text-yellow-600 mb-6">
                  ₹{selectedProduct.price}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProduct.description || 'No description available for this product.'}
                </p>
              </div>

              {selectedProduct.category && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Category</h3>
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                    {selectedProduct.category.name}
                  </span>
                </div>
              )}

              <div className="space-y-4 pt-6">
                <button
                  onClick={() => handleBuyOnWhatsApp(selectedProduct)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-md"
                >
                  Buy Now on WhatsApp
                </button>
                
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  };

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-600">ZAAFA</h1>
                <p className="text-sm text-gray-600">Online Store</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Your trusted partner for premium quality products. We deliver excellence with every purchase.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 {ownerNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-600 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Shipping Info'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:text-yellow-600 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-600 mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category._id}>
                  <button
                    onClick={() => goToProducts(category._id)}
                    className="text-gray-600 hover:text-yellow-600 transition-colors text-left"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 ZAAFA Online Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      
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

      {/* Page Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'product-detail' && <ProductDetailPage />}

      {/* Floating WhatsApp Button */}
      {currentPage !== 'product-detail' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleDirectWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}