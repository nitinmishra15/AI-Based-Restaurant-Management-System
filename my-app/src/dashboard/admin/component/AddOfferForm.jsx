import React, { useContext, useState } from "react";
import { OfferContext } from "../../../app/providers/OfferContextApi/OfferProvider";

const AddOfferForm = ({ onClose }) => {
  const { addOffer } = useContext(OfferContext);

  const getTodayString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    couponCode: "",
    discountType: "Percentage",
    discountValue: "",
    minOrderAmount: "0",
    startDate: getTodayString(0),
    endDate: getTodayString(7),
    applicableCategory: "All",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const categories = ["All", "Main Course", "Starters", "Desserts", "Beverages", "Pizzas"];
  const discountTypes = ["Percentage", "FixedAmount"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await addOffer(formData);
    setLoading(false);
    if (result.success) {
      alert("Promotion created successfully!");
      onClose();
    } else {
      alert(result.message || "Failed to create promotion.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-[520px] p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-5 font-sans text-gray-800 flex items-center justify-between">
          <span>Create Promotion / Offer</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Offer Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Flat 30% OFF or Diwali Special"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="e.g. Valid on orders above ₹499"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Coupon Code</label>
              <input
                type="text"
                name="couponCode"
                placeholder="e.g. FESTIVE30"
                value={formData.couponCode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Applicable Category *</label>
              <select
                name="applicableCategory"
                value={formData.applicableCategory}
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Discount Type *</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              >
                {discountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "FixedAmount" ? "Fixed Value (₹)" : "Percentage (%)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Value *</label>
              <input
                type="number"
                name="discountValue"
                min="0.01"
                step="0.01"
                placeholder="e.g. 30"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Min. Order (₹)</label>
              <input
                type="number"
                name="minOrderAmount"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
              Make this promotion active immediately
            </label>
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
              {loading ? "Creating..." : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOfferForm;
