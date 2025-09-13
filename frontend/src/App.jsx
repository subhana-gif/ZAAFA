import { Routes, Route, Navigate } from 'react-router-dom';
import HeaderLayout from './pages/Header.jsx';
import HomePage from './pages/Home.jsx';
import ProductDetailPage from './pages/ProductDetails.jsx';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      {/* Shop routes with HeaderLayout */}
      <Route path="/" element={<HeaderLayout><HomePage /></HeaderLayout>} />
      <Route path="/product/:id" element={<HeaderLayout><ProductDetailPage /></HeaderLayout>} />
      {/* Admin dashboard */}
      <Route path="/admin" element={<Admin/> } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
