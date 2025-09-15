import { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../../Component/AlertContext";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/brands"
    : "https://zaafa-backend.onrender.com/api/brands";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
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

export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: "", image: null });
  const [existingImage, setExistingImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(API_URL);
      setBrands(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching brands");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Brand updated!");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Brand added!");
      }

      fetchBrands();
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error saving brand");
    }
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, image: null });
    setExistingImage(brand.image || null);
    setEditingId(brand._id);
    setShowModal(true);
  };

  const handleToggleBlock = async (brand) => {
    try {
      const newStatus = brand.status === "blocked" ? "active" : "blocked";
      await axios.patch(`${API_URL}/${brand._id}/status`, { status: newStatus });
      showAlert(`✅ Brand ${newStatus === "blocked" ? "blocked" : "unblocked"}!`);
      fetchBrands();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error updating brand status");
    }
  };

  const resetForm = () => {
    setForm({ name: "", image: null });
    setExistingImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const paginatedBrands = brands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Brands</h2>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg mb-4"
      >
        Add Brand
      </button>

      {/* Brands Table */}
      <div className="overflow-x-auto">
          <table className="w-full border border-slate-200 rounded-lg">
  <thead className="bg-slate-50 border-b border-slate-200">
    <tr>
      <th className="px-6 py-3 text-left">Sl. No.</th>
      <th className="px-6 py-3 text-left">Image</th>
      <th className="px-6 py-3 text-left">Name</th>
      <th className="px-6 py-3 text-left">Status</th>
      <th className="px-6 py-3 text-right">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-200">
    {paginatedBrands.map((brand, index) => (
      <tr key={brand._id}>
        <td className="px-6 py-3">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="px-6 py-3">
          {brand.image && (
            <img
              src={`data:image/jpeg;base64,${brand.image}`}
              alt={brand.name}
              className="w-12 h-12 object-contain rounded"
            />
          )}
        </td>
        <td className="px-6 py-3">{brand.name}</td>
        <td className="px-6 py-3">
          {brand.status === "blocked" ? "Blocked" : "Active"}
        </td>
        <td className="px-6 py-3 text-right flex justify-end gap-3">
          <button
            onClick={() => handleEdit(brand)}
            className="text-indigo-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleToggleBlock(brand)}
            className={
              brand.status === "blocked"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {brand.status === "blocked" ? "Unblock" : "Block"}
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

      {/* Modal for Add/Edit */}
      <Modal isOpen={showModal} onClose={resetForm}>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Brand" : "Add Brand"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Brand name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="border rounded-lg px-3 py-2"
          />
          {/* Preview Image */}
          {form.image ? (
            <img
              src={URL.createObjectURL(form.image)}
              alt="preview"
              className="w-20 h-20 object-cover rounded mt-2"
            />
          ) : existingImage ? (
            <img
              src={`data:image/jpeg;base64,${existingImage}`}
              alt="current"
              className="w-20 h-20 object-cover rounded mt-2"
            />
          ) : null}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
