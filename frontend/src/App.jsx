import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin.jsx'; // create this page for login form

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
    <Router>
      <Routes>
        {/* Shop route */}
        <Route path="/" element={<ProductList />} />

        {/* Admin login */}
        <Route 
          path="/admin/login" 
          element={
            isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />
          } 
        />

        {/* Admin dashboard */}
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? <Admin onLogout={handleLogout} /> : <Navigate to="/admin/login" />
          } 
        />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
