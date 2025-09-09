import { useState } from "react";
import ProductManagement from "./ProductManagement";
import CategoryManagement from "./CategoryManagement";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products"); // default tab

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  activeTab === "products"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                Product Management
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  activeTab === "categories"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                Category Management
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "categories" && <CategoryManagement />}
      </div>
    </div>
  );
}
