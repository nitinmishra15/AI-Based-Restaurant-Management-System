import React, { useContext, useState, useEffect } from "react";
import { InventoryContext } from "../../../app/providers/InventoryContextApi/InventoryProvider";

const UpdateInventoryForm = ({ item, onClose }) => {
  const { updateInventoryItem } = useContext(InventoryContext);
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    price: "",
    qty: "",
    lowStockThreshold: "5",
    status: "In Stock",
  });
  const [loading, setLoading] = useState(false);

  const categories = ["General", "Kitchen", "Dairy", "Spices", "Vegetables", "Meat", "Beverages"];
  const statuses = ["In Stock", "Low Stock", "Restock Soon", "Critical", "Out Of Stock"];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.category || "General",
        price: item.price !== undefined ? item.price.toString() : "",
        qty: item.qty !== undefined ? item.qty.toString() : "",
        lowStockThreshold: item.lowStockThreshold !== undefined ? item.lowStockThreshold.toString() : "5",
        status: item.status || "In Stock",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateInventoryItem(item.id, formData);
    setLoading(false);
    if (result.success) {
      alert("Inventory item updated successfully!");
      onClose();
    } else {
      alert(result.message || "Failed to update inventory item.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-[500px] p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-5 font-sans text-gray-800 flex items-center justify-between">
          <span>Edit Inventory Item</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Item Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Basmati Rice"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Quantity *</label>
              <input
                type="number"
                name="qty"
                min="0"
                placeholder="0"
                value={formData.qty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Alert Qty *</label>
              <input
                type="number"
                name="lowStockThreshold"
                min="0"
                placeholder="5"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg transition font-medium flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventoryForm;
