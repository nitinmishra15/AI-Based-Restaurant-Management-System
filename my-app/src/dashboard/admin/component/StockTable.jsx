import React, { useContext, useState } from "react";
import { InventoryContext } from "../../../app/providers/InventoryContextApi/InventoryProvider";
import { FiMoreHorizontal, FiEdit2, FiTrash2 } from "react-icons/fi";
import rice from "../../../assets/inventory/basmati-rice.jpg";
import paneer from "../../../assets/inventory/paneer.jpg";
import garamMasala from "../../../assets/inventory/garam-masala.jpg";
import curryLeaves from "../../../assets/inventory/curry-leaves.jpg";

const StockTable = ({ onEdit }) => {
  const { inventoryList, loading, deleteInventoryItem } = useContext(InventoryContext);
  const [activeActionsId, setActiveActionsId] = useState(null);

  const getStatusColor = (status, qty, threshold) => {
    // If quantity is below or equal to threshold, force Critical/Low Stock style
    if (qty <= threshold) {
      return "bg-red-100 text-red-600";
    }
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-600";
      case "Low Stock":
      case "Critical":
        return "bg-red-100 text-red-600";
      case "Restock Soon":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStockImage = (name = "", category = "") => {
    const lowercaseName = name.toLowerCase();
    const lowercaseCategory = category.toLowerCase();

    if (lowercaseName.includes("rice")) return rice;
    if (lowercaseName.includes("paneer")) return paneer;
    if (lowercaseName.includes("masala") || lowercaseName.includes("spice")) return garamMasala;
    if (lowercaseName.includes("leave") || lowercaseName.includes("curry")) return curryLeaves;

    if (lowercaseCategory.includes("dairy")) {
      return "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150";
    }
    if (lowercaseCategory.includes("spice")) {
      return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=150";
    }
    if (lowercaseCategory.includes("vegetable") || lowercaseCategory.includes("kitchen")) {
      return "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=150";
    }
    if (lowercaseCategory.includes("meat")) {
      return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=150";
    }
    if (lowercaseCategory.includes("beverage")) {
      return "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=150";
    }
    return "https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=150"; // default box/groceries image
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      const result = await deleteInventoryItem(id);
      if (!result.success) {
        alert(result.message || "Failed to delete item.");
      }
    }
  };

  if (loading && inventoryList.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-md mt-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-500 font-sans">Loading stock items...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-visible mt-8 relative">
      {inventoryList.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-sans">
          No inventory items found. Add some items to get started!
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left font-sans">Item</th>
              <th className="p-4 text-left font-sans">Quantity / Stock Level</th>
              <th className="p-4 text-left font-sans">Price</th>
              <th className="p-4 text-left font-sans">Status</th>
              <th className="p-4 text-center font-sans">Action</th>
            </tr>
          </thead>

          <tbody>
            {inventoryList.map((item) => {
              const stockPercentage = Math.min(100, Math.round((item.qty / (item.lowStockThreshold || 5)) * 50));
              const isCritical = item.qty <= item.lowStockThreshold;
              const isWarning = !isCritical && item.qty <= item.lowStockThreshold * 1.5;

              const progressColor = isCritical
                ? "bg-red-500"
                : isWarning
                ? "bg-yellow-500"
                : "bg-green-500";

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getStockImage(item.name, item.category)}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover shadow-sm border border-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 font-sans">{item.name}</h3>
                        <p className="text-gray-500 text-sm font-sans">{item.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="w-36 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-2 text-gray-700 font-sans font-medium">
                      {item.qty} Units <span className="text-gray-400 font-normal">(Alert: &lt;={item.lowStockThreshold})</span>
                    </p>
                  </td>

                  <td className="p-4 text-gray-700 font-semibold font-sans">
                    ₹{item.price.toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold font-sans ${getStatusColor(
                        item.status,
                        item.qty,
                        item.lowStockThreshold
                      )}`}
                    >
                      {item.qty <= item.lowStockThreshold ? "Low Stock" : item.status}
                    </span>
                  </td>

                  <td className="p-4 text-center relative">
                    <div className="inline-block text-left">
                      <button
                        onClick={() => setActiveActionsId(activeActionsId === item.id ? null : item.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500"
                      >
                        <FiMoreHorizontal size={22} />
                      </button>

                      {activeActionsId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveActionsId(null)}
                          ></div>
                          <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-20 overflow-hidden py-1">
                            <button
                              onClick={() => {
                                onEdit(item);
                                setActiveActionsId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left font-sans"
                            >
                              <FiEdit2 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item.id, item.name);
                                setActiveActionsId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-sans"
                            >
                              <FiTrash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockTable;