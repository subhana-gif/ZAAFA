import { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../Component/AlertContext";

const API_BASE_URL = "http://localhost:5000/api/offers";

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

export default function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      showAlert("❌ Error fetching offers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, form);
        showAlert("✅ Offer updated!");
      } else {
        await axios.post(API_BASE_URL, form);
        showAlert("✅ Offer added!");
      }

      fetchOffers();
      resetForm();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error saving offer");
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title,
      description: offer.description || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: offer.startDate?.split("T")[0] || "",
      endDate: offer.endDate?.split("T")[0] || "",
    });
    setEditingId(offer._id);
    setShowModal(true);
  };

  const handleToggleActive = async (offer) => {
    try {
      const newStatus = !offer.isActive;
      await axios.patch(`${API_BASE_URL}/${offer._id}/toggle`, {
        isActive: newStatus,
      });
      showAlert(
        `✅ Offer ${newStatus ? "activated" : "deactivated"} successfully`
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
      showAlert("❌ Error updating offer status");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const paginatedOffers = offers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Offers</h2>

      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg mb-4"
      >
        Add Offer
      </button>

      {/* Offers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Discount</th>
              <th className="px-6 py-3 text-left">Validity</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedOffers.map((offer) => (
              <tr key={offer._id}>
                <td className="px-6 py-3">{offer.title}</td>
                <td className="px-6 py-3">
                  {offer.discountType === "percentage"
                    ? `${offer.discountValue}%`
                    : `₹${offer.discountValue}`}
                </td>
                <td className="px-6 py-3">
                  {new Date(offer.startDate).toLocaleDateString()} -{" "}
                  {new Date(offer.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  {offer.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="text-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(offer)}
                    className={offer.isActive ? "text-red-600" : "text-green-600"}
                  >
                    {offer.isActive ? "Deactivate" : "Activate"}
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
          {editingId ? "Edit Offer" : "Add Offer"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Offer Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          <input
            type="number"
            placeholder="Discount Value"
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
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
