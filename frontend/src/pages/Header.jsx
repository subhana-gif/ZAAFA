import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ownerNumber = "7736062779";

export default function HeaderLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleDirectWhatsApp = () => {
    const message = "Hello, I'd like to know more about your products.";
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const goToHome = () => {
    navigate('/');
  };

  const goBack = () => {
    window.history.back();
  };

  const isHomePage = currentPath === '/';
  const isProductDetailPage = currentPath.startsWith('/product/');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
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
            {!isHomePage && (
              <button
                onClick={goBack}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Back</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>{children}</main>

      {/* Floating WhatsApp Button - Hide on product detail page */}
      {!isProductDetailPage && (
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

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">Z</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-yellow-600">ZAAFA</h1>
                  <p className="text-sm text-gray-600">Online Store</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Your trusted partner for premium quality products. We deliver excellence with every purchase.
              </p>
              <div className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
                <span>📞 +91 {ownerNumber}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-600 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'All Products', path: '/products' },
                  { name: 'Contact Us', action: handleDirectWhatsApp }
                ].map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-gray-600 hover:text-yellow-600 transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <button
                        onClick={link.action}
                        className="text-gray-600 hover:text-yellow-600 transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-600 mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Have questions? We're here to help!
                </p>
                <button
                  onClick={handleDirectWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 ZAAFA Online Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}