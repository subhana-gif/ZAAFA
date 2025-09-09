import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import HeaderLayout from './pages/Header.jsx';
import HomePage from './pages/Home.jsx';
import ProductsPage from './pages/ProductList.jsx';
import ProductDetailPage from './pages/ProductDetails.jsx';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin.jsx';

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin123") {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <Routes>
      {/* Shop routes with HeaderLayout */}
      <Route path="/" element={<HeaderLayout><HomePage /></HeaderLayout>} />
      <Route path="/products" element={<HeaderLayout><ProductsPage /></HeaderLayout>} />
      <Route path="/products/:categoryId" element={<HeaderLayout><ProductsPage /></HeaderLayout>} />
      <Route path="/product/:id" element={<HeaderLayout><ProductDetailPage /></HeaderLayout>} />

      {/* Admin login */}
      <Route 
        path="/admin/login" 
        element={isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />} 
      />

      {/* Admin dashboard */}
      <Route 
        path="/admin" 
        element={isAdminAuthenticated ? <Admin onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
      />

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
