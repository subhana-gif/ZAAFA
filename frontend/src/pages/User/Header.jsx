import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle, Search, Instagram, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/484214536_457350320700957_1106175435430140761_n.jpg";

const ownerNumber = "7736062779";

export default function HeaderLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState({ categories: [], products: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://zaafa-backend.onrender.com/api/categories");
        if (!res.ok) {
          console.error("Failed to fetch categories", res.status);
          return;
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Click outside -> clear suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions({ categories: [], products: [] });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSuggestions = async (q) => {
    try {
      // quick debug log (open devtools > console)
      // remove or lower verbosity in production
      console.log("Fetching suggestions for:", q);

      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
      if (!res.ok) {
        console.warn("Search API error", res.status);
        setSuggestions({ categories: [], products: [] });
        return;
      }
      const data = await res.json();
      console.log("Search response:", data);

      // be defensive about structure. try common keys then fallback to empty arrays
      const cats =
        Array.isArray(data.categories) ? data.categories :
        Array.isArray(data.category) ? data.category :
        Array.isArray(data.categoriesList) ? data.categoriesList :
        [];
      const prods =
        Array.isArray(data.products) ? data.products :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.results) ? data.results :
        [];
      setSuggestions({ categories: cats, products: prods });
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setSuggestions({ categories: [], products: [] });
    }
  };

  const onChangeSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    // cancel previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setSuggestions({ categories: [], products: [] });
      return;
    }

    // debounce request (250ms)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val.trim());
    }, 250);
  };

  const handleDirectWhatsApp = () => {
    const message = "Hello, I'd like to know more about your products.";
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const goToHome = () => navigate("/");
  const goBack = () => window.history.back();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        console.warn("Search submit API error", res.status);
        return;
      }
      const data = await res.json();

      if (data.categories?.length > 0) navigate(`/products/${data.categories[0].id}`);
      else if (data.products?.length > 0) navigate(`/product/${data.products[0].id}`);
      else navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      console.error("Search error:", err);
    }
    // keep query visible after submit — remove the next line if you prefer clearing it
    // setSearchQuery("");
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
    setIsMobileMenuOpen(false);
    setSuggestions({ categories: [], products: [] });
  };

  const isHomePage = currentPath === "/";
  const isProductDetailPage = currentPath.startsWith("/product/");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-yellow-200">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Top row: Hamburger, Logo, Instagram, Search Icon */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-yellow-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <div className="flex items-center cursor-pointer" onClick={goToHome}>
                <div className="w-12 h-12">
                  <img
                    src={logo}
                    alt="Zaafa Logo"
                    className="w-full h-full object-cover rounded-full border-2 border-yellow-500"
                  />
                </div>
                <div className="ml-2">
                  <h1 className="text-xl font-bold text-yellow-600">ZAAFA</h1>
                  <p className="text-xs text-gray-600">Online Store</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/zaafa_onlinestore/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-pink-600 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>

                <button
                  onClick={() => setIsSearchOpen((s) => !s)}
                  className="p-2 text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search area (mobile) */}
            {isSearchOpen && (
              <div className="mt-4 flex justify-center relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="flex-1 max-w-lg flex items-center bg-gray-100 rounded-lg overflow-visible relative">
                  <input
                    type="text"
                    placeholder="Search products or categories..."
                    value={searchQuery}
                    onChange={onChangeSearch}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
                  />
                  <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Suggestions dropdown */}
                  {(suggestions?.categories?.length > 0 || suggestions?.products?.length > 0) && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-[60]">
                      {suggestions.categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCategoryClick(cat.id)}
                        >
                          {cat.name}
                        </div>
                      ))}
                      {suggestions.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate(`/product/${prod.id}`);
                            setSuggestions({ categories: [], products: [] });
                          }}
                        >
                          {prod.name}
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Mobile Categories Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
                <nav className="px-4 py-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="block w-full text-left py-3 px-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-semibold transition-colors text-lg border-b border-gray-100 last:border-b-0"
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between w-full mt-4">
              <div className="flex items-center cursor-pointer" onClick={goToHome}>
                <div className="w-20 h-20">
                  <img src={logo} alt="Zaafa Logo" className="w-full h-full object-contain rounded-full border-2 border-yellow-500 bg-black" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-yellow-600 tracking-widest">ZAAFA STORE</h1>
                </div>
              </div>

              <nav className="flex items-center gap-12">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    onClick={() => navigate(`/products/${cat.id}`)}
                    className="text-gray-700 hover:text-yellow-600 font-semibold cursor-pointer transition-colors text-lg md:text-xl lg:text-2xl font-serif"
                  >
                    {cat.name.toUpperCase()}
                  </span>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/zaafa_onlinestore/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-500 transition-colors">
                  <Instagram className="h-10 w-10" />
                </a>

                <button onClick={() => setIsSearchOpen((s) => !s)} className="text-gray-700 hover:text-yellow-600 transition-colors">
                  <Search className="h-10 w-10" />
                </button>
              </div>
            </div>

            {/* Desktop Search */}
            {isSearchOpen && (
              <div className="mt-4 flex justify-center relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="flex-1 max-w-lg flex items-center bg-gray-100 rounded-lg overflow-visible relative">
                  <input
                    type="text"
                    placeholder="Search products or categories..."
                    value={searchQuery}
                    onChange={onChangeSearch}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
                  />
                  <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Suggestions dropdown (desktop) */}
                  {(suggestions?.categories?.length > 0 || suggestions?.products?.length > 0) && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50">
                      {suggestions.categories.map((cat) => (
                        <div key={cat.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => handleCategoryClick(cat.id)}>
                          {cat.name}
                        </div>
                      ))}
                      {suggestions.products.map((prod) => (
                        <div key={prod.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate(`/product/${prod.id}`); setSuggestions({ categories: [], products: [] }); }}>
                          {prod.name}
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Page Content */}
      <main>{children}</main>

      {/* Floating WhatsApp */}
      {!isProductDetailPage && (
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={handleDirectWhatsApp} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2" title="Chat on WhatsApp">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
