import { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../../Component/AlertContext";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/hero-images"
    : "https://zaafa-backend.onrender.com/api/hero-images";


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

export default function HeroImageManagement() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ image: null });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setImages(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching hero images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return;

    try {
      const formData = new FormData();
      formData.append("image", form.image);

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Hero image updated!");
      } else {
        await axios.post(API_BASE_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("✅ Hero image added!");
      }

      fetchImages();
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error saving hero image");
    }
  };

  const handleToggleActive = async (img) => {
    try {
      await axios.patch(`${API_BASE_URL}/${img._id}/toggle`);
      showAlert(
        `✅ Image ${img.isActive ? "deactivated" : "activated"} successfully!`
      );
      fetchImages();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error toggling image status");
    }
  };

  const resetForm = () => {
    setForm({ image: null });
    setEditingId(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const paginatedImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Hero Images</h2>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg mb-4"
      >
        Add Hero Image
      </button>

      {/* Hero Images Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg">
<thead className="bg-slate-50 border-b border-slate-200">
  <tr>
    <th className="px-6 py-3 text-left">Sl. No.</th>
    <th className="px-6 py-3 text-left">Image</th>
    <th className="px-6 py-3 text-left">Status</th>
    <th className="px-6 py-3 text-right">Actions</th>
  </tr>
</thead>
<tbody className="divide-y divide-slate-200">
  {paginatedImages.map((img, index) => (
    <tr key={img._id}>
      {/* Serial Number */}
      <td className="px-6 py-3">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </td>

      <td className="px-6 py-3">
        <img
          src={img.imageUrl}
          alt="hero"
          className="w-32 h-20 object-cover rounded"
        />
      </td>
      <td className="px-6 py-3">
        {img.isActive ? "Active" : "Inactive"}
      </td>
      <td className="px-6 py-3 text-right flex justify-end gap-3">
        <button
          onClick={() => handleToggleActive(img)}
          className={img.isActive ? "text-red-600" : "text-green-600"}
        >
          {img.isActive ? "Deactivate" : "Activate"}
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
          {editingId ? "Edit Hero Image" : "Add Hero Image"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="border rounded-lg px-3 py-2"
            required={!editingId}
          />

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
