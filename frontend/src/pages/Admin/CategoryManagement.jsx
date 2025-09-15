import { useState, useEffect } from "react";
import axios from "axios";
import {useAlert} from "../../Component/AlertContext"

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/categories"
    : "https://zaafa-backend.onrender.com/api/categories";


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

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", image: null });
  const [existingImage, setExistingImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showAlert } = useAlert();
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Category updated!");
      } else {
        await axios.post(API_BASE_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Category added!");
      }

      fetchCategories();
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "", image: null });
    setExistingImage(cat.image || null);
    setEditingId(cat._id);
    setShowModal(true);
  };

  const handleToggleBlock = async (cat) => {
    try {
      const newStatus = cat.status === "blocked" ? "active" : "blocked";
      await axios.patch(`${API_BASE_URL}/${cat._id}/status`, { status: newStatus });
      showAlert(`✅ Category ${newStatus === "blocked" ? "blocked" : "unblocked"}!`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error updating category status");
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", image: null });
    setExistingImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg mb-4"
      >
        Add Category
      </button>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedCategories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-6 py-3">
                  {cat.image && (
                    <img
                      src={`data:image/jpeg;base64,${cat.image}`}
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-3">{cat.name}</td>
                <td className="px-6 py-3">{cat.description || "—"}</td>
                <td className="px-6 py-3">
                  {cat.status === "blocked" ? "Blocked" : "Active"}
                </td>
                <td className="px-6 py-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleBlock(cat)}
                    className={cat.status === "blocked" ? "text-green-600" : "text-red-600"}
                  >
                    {cat.status === "blocked" ? "Unblock" : "Block"}
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
          {editingId ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="border rounded-lg px-3 py-2"
          />
          {/* Preview Image */}
          {form.image ? (
            // If new image selected
            <img
              src={URL.createObjectURL(form.image)}
              alt="preview"
              className="w-20 h-20 object-cover rounded mt-2"
            />
          ) : existingImage ? (
            // If editing and old image exists
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
