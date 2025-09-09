import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import ProductList from "./pages/ProductList";

export default function App() {
  return (
    <Router>
      <div className="p-4 flex justify-between items-center bg-green-600 text-white">
        <h1 className="text-xl font-bold">WhatsApp Shop</h1>
        <div className="space-x-4">
          <Link to="/">Products</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
