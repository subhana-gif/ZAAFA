import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://zaafa-backend.onrender.com/api/categories";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", image: null });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching categories");
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
        alert("✅ Category updated!");
      } else {
        await axios.post(API_BASE_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Category added!");
      }

      fetchCategories();
      setForm({ name: "", description: "", image: null });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "", image: null });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
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

        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="divide-y divide-slate-200">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center py-3">
            <div className="flex items-center gap-4">
              {cat.image && (
                <img
                  src={`data:image/jpeg;base64,${cat.image}`}
                  alt={cat.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(cat)} className="text-indigo-600">
                Edit
              </button>
              <button onClick={() => handleDelete(cat._id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
