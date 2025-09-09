import { useEffect, useState } from "react";
import axios from "axios";

const ownerNumber = "9745370909"; // replace with your WhatsApp number

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://zaafa-backend.onrender.com/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleBuyOnWhatsApp = (product) => {
    const message = `Hello, I want to buy:\n\n*${product.name}*\nPrice: Rs.${product.price}\n\nPlease share details.`;
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border p-4 rounded-xl shadow-md flex flex-col items-center"
        >
<img
  src={`data:image/jpeg;base64,${product.image}`}
  alt={product.name}
  className="w-40 h-40 object-cover rounded-lg"
/>
          <h2 className="text-lg font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-green-600 font-semibold mt-2">₹{product.price}</p>
          <button
            onClick={() => handleBuyOnWhatsApp(product)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Buy on WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
}
