import { Routes, Route, Navigate } from 'react-router-dom';
import HeaderLayout from './pages/User/Header.jsx';
import HomePage from './pages/User/Home.jsx';
import ProductDetailPage from './pages/User/ProductDetails.jsx';
import Admin from './pages/Admin/Admin.jsx';

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
