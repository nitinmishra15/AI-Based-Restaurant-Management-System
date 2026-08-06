import React, { useContext } from "react";
import { InventoryContext } from "../../../app/providers/InventoryContextApi/InventoryProvider";
import {
  FiAlertTriangle,
  FiPackage,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

const StockCard = () => {
  const { inventoryList } = useContext(InventoryContext);

  // Calculate dynamic stats
  const totalSKUs = inventoryList.length;
  
  const criticalCount = inventoryList.filter(
    (item) => item.qty <= item.lowStockThreshold || item.status === "Low Stock" || item.status === "Critical"
  ).length;

  const uniqueCategories = new Set(inventoryList.map((item) => item.category)).size;

  const stockValue = inventoryList.reduce(
    (acc, item) => acc + (item.price * item.qty),
    0
  );

  const cards = [
    {
      title: "Critical Stock",
      value: `${criticalCount} Items`,
      subtitle: criticalCount > 0 ? "Requires immediate restock" : "All levels healthy",
      color: criticalCount > 0 ? "text-red-600 animate-pulse" : "text-gray-600",
      bg: criticalCount > 0 ? "bg-red-50 border border-red-100" : "bg-white border",
      icon: <FiAlertTriangle size={24} />,
    },
    {
      title: "Total SKUs",
      value: `${totalSKUs} Units`,
      subtitle: `Across ${uniqueCategories} categories`,
      color: "text-blue-600",
      bg: "bg-white border border-gray-100",
      icon: <FiPackage size={24} />,
    },
    {
      title: "Stock Health",
      value: totalSKUs > 0 ? `${Math.round(((totalSKUs - criticalCount) / totalSKUs) * 100)}%` : "100%",
      subtitle: "Items above alert threshold",
      color: "text-green-600",
      bg: "bg-white border border-gray-100",
      icon: <FiTrendingUp size={24} />,
    },
    {
      title: "Stock Value",
      value: `₹${stockValue.toLocaleString("en-IN")}`,
      subtitle: "Current inventory valuation",
      color: "text-purple-600",
      bg: "bg-white border border-gray-100",
      icon: <FiDollarSign size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bg} rounded-xl shadow-sm p-5 flex flex-col justify-between`}
        >
          <div>
            <div className={`p-3 rounded-lg w-fit ${card.bg === 'bg-white border' ? 'bg-gray-50' : 'bg-red-100/40'} ${card.color} mb-4`}>
              {card.icon}
            </div>

            <h3 className="text-gray-500 text-sm font-medium font-sans">
              {card.title}
            </h3>

            <h2 className="text-2xl font-bold mt-1 text-gray-800 font-sans">
              {card.value}
            </h2>
          </div>

          <p className="text-gray-400 text-xs mt-3 font-sans">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StockCard;