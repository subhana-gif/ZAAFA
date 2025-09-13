import { useState, useEffect } from "react";
import axios from "axios";
import CropModal from "../Component/Cropper";
import { useAlert } from "../Component/AlertContext";

const PRODUCT_API = "http://localhost:5000/api/products";
const CATEGORY_API = "http://localhost:5000/api/categories";
const OFFER_API = "http://localhost:5000/api/offers";
const BRAND_API = "http://localhost:5000/api/brands";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    offer: "",
    brand: "",
    existingImages: [],
  });
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showAlert } = useAlert();

  // crop modal
  const [cropImageFile, setCropImageFile] = useState(null);
  const [cropReplaceIndex, setCropReplaceIndex] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOffers();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(PRODUCT_API);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching products");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching categories");
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await axios.get(OFFER_API);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching offers");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(BRAND_API);
      setBrands(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching brands");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      offer: "",
      brand: "",
      existingImages: [],
    });
    setImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((form.existingImages?.length || 0) + images.length !== 4) {
      showAlert("Product must have exactly 4 images");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    if (form.category) data.append("categoryId", form.category);
    if (form.offer) data.append("offerId", form.offer);
    if (form.brand) data.append("brandId", form.brand);

    (form.existingImages || []).forEach((imgBase64, idx) => {
      data.append(`existingImages[${idx}]`, imgBase64);
    });

    images.forEach((fileOrBlob) => {
      data.append("images", fileOrBlob);
    });

    try {
      if (editingId) {
        await axios.put(`${PRODUCT_API}/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Product updated successfully!");
      } else {
        await axios.post(PRODUCT_API, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Product added successfully!");
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Error saving product";
      showAlert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      category: product.category?._id || "",
      offer: product.offer?._id || "",
      brand: product.brand?._id || "",
      existingImages: product.images || [],
    });
    setEditingId(product._id);
    setImages([]);
    setShowForm(true);
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      const newStatus = isBlocked ? "active" : "blocked";
      await axios.patch(`${PRODUCT_API}/${id}/status`, { status: newStatus });
      showAlert(`✅ Product ${isBlocked ? "unblocked" : "blocked"} successfully!`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error updating product status");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (fetchLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search & Add Button */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Brand</th>
              <th className="px-6 py-4 text-left">Offer</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  {product.images?.[0] ? (
                    <img
                      src={`data:image/jpeg;base64,${product.images[0]}`}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category?.name || "—"}</td>
                <td className="px-6 py-4">{product.brand?.name || "—"}</td>
                <td className="px-6 py-4">{product.offer?.title || "—"}</td>
                <td className="px-6 py-4">AED {product.price.toFixed(2)}</td>
                <td className="px-6 py-4">{product.description || "—"}</td>
                <td className="px-6 py-4">
                  {product.status === "blocked" ? "Blocked" : "Active"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="mr-3 text-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleToggleBlock(product._id, product.status === "blocked")
                    }
                    className={`${
                      product.status === "blocked"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status === "blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={resetForm}>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Brand *
              </label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Select Brand --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Offer (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Offer (Optional)
              </label>
              <select
                name="offer"
                value={form.offer}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- No Offer --</option>
                {offers.map((offer) => (
                  <option key={offer._id} value={offer._id}>
                    {offer.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg resize-none"
              />
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Images (exactly 4)
              </label>

              {/* Existing Images */}
              {form.existingImages?.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {form.existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={`data:image/jpeg;base64,${img}`}
                        alt="preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs font-medium cursor-pointer rounded">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setCropImageFile(file);
                            setCropReplaceIndex(idx);
                          }}
                          className="hidden"
                        />
                      </label>
                      <span
                        onClick={() => {
                          const newImages = form.existingImages.filter(
                            (_, i) => i !== idx
                          );
                          setForm({ ...form, existingImages: newImages });
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs cursor-pointer"
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                      <span
                        onClick={() => {
                          const newFiles = images.filter((_, i) => i !== idx);
                          setImages(newFiles);
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs cursor-pointer"
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setCropImageFile(file);
                  setCropReplaceIndex(null);
                }}
                className="w-full px-3 py-2 border rounded-lg mt-3"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Crop Modal */}
      {cropImageFile && (
        <CropModal
          isOpen={!!cropImageFile}
          imageFile={cropImageFile}
          onClose={() => {
            setCropImageFile(null);
            setCropReplaceIndex(null);
          }}
          onCropComplete={async (blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result.split(",")[1];
              if (
                cropReplaceIndex !== null &&
                cropReplaceIndex < form.existingImages.length
              ) {
                const newImages = [...form.existingImages];
                newImages[cropReplaceIndex] = base64String;
                setForm({ ...form, existingImages: newImages });
              } else {
                setImages([...images, blob]);
              }

              setCropImageFile(null);
              setCropReplaceIndex(null);
            };
            reader.readAsDataURL(blob);
          }}
        />
      )}
    </div>
  );
}
