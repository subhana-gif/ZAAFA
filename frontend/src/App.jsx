import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HeaderLayout from "./pages/User/Header.jsx";
import HomePage from "./pages/User/Home.jsx";
import ProductDetailPage from "./pages/User/ProductDetails.jsx";
import Admin from "./pages/Admin/Admin.jsx";

function HomePageWrapper() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <HeaderLayout onCategorySelect={(id) => {
      setSelectedCategory(id);
      setSelectedBrand(null); // reset brand if category clicked from header
    }}>
      <HomePage
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    </HeaderLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageWrapper />} />
      <Route path="/product/:id" element={<HeaderLayout><ProductDetailPage /></HeaderLayout>} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
