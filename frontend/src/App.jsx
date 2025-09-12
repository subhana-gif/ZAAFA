import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import HeaderLayout from './pages/Header.jsx';
import HomePage from './pages/Home.jsx';
import ProductsPage from './pages/ProductList.jsx';
import ProductDetailPage from './pages/ProductDetails.jsx';
import Admin from './pages/Admin';
import Products from "./pages/Products.jsx"

export default function App() {
  return (
    <Routes>
      {/* Shop routes with HeaderLayout */}
      <Route path="/" element={<HeaderLayout><HomePage /></HeaderLayout>} />
      <Route path="/products" element={<HeaderLayout><Products /></HeaderLayout>} />
      <Route path="/products/:categoryId" element={<HeaderLayout><ProductsPage /></HeaderLayout>} />
      <Route path="/product/:id" element={<HeaderLayout><ProductDetailPage /></HeaderLayout>} />
      {/* Admin dashboard */}
      <Route path="/admin" element={<Admin/> } />

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
