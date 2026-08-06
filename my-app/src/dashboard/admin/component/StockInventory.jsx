import React, { useState, useEffect, useContext } from "react";
import StockCard from "./StockCard";
import StockTable from "./StockTable";
import AddInventoryForm from "./AddInventoryForm";
import UpdateInventoryForm from "./UpdateInventoryForm";
import { InventoryContext } from "../../../app/providers/InventoryContextApi/InventoryProvider";
import { FiCpu, FiMail, FiRefreshCw, FiTrendingDown, FiAlertCircle } from "react-icons/fi";

const StockInventory = () => {
  const { inventoryList, getPrediction, lowStockAlerts } = useContext(InventoryContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // State for AI predictions
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [predictionData, setPredictionData] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [customIngredient, setCustomIngredient] = useState("");

  // Load initial prediction when inventory items are fetched
  useEffect(() => {
    if (inventoryList && inventoryList.length > 0) {
      // Pick first item or low stock item as default to show prediction
      const defaultItem = inventoryList.find(i => i.qty <= i.lowStockThreshold) || inventoryList[0];
      setSelectedIngredient(defaultItem.name);
      handleFetchPrediction(defaultItem.name);
    }
  }, [inventoryList]);

  const handleFetchPrediction = async (ingredientName) => {
    if (!ingredientName) return;
    setPredictLoading(true);
    setPredictionData(null);
    const result = await getPrediction(ingredientName);
    setPredictLoading(false);
    if (result.success) {
      setPredictionData(result.data);
    } else {
      setPredictionData({
        ingredient: ingredientName,
        daysRemaining: 0,
        lowStockAlert: true,
        suggestedReorderQuantity: 20,
        modelSource: "FallbackEngine (API Connection Error)"
      });
    }
  };

  const handleCustomPredictSubmit = (e) => {
    e.preventDefault();
    if (customIngredient.trim()) {
      handleFetchPrediction(customIngredient.trim());
    }
  };

  const handleSupplierEmail = () => {
    if (lowStockAlerts.length === 0) {
      alert("All stock items are healthy! No low stock orders to send.");
      return;
    }
    const itemList = lowStockAlerts.map(i => `- ${i.name} (Qty: ${i.qty}, Reorder Threshold: ${i.lowStockThreshold})`).join("\n");
    const mailto = `mailto:supplier@qrdinedining.com?subject=Purchase Order - Low Stock Reorder Alert&body=Dear Supplier,%0D%0A%0D%0APlease provide quotation and delivery estimate for the following low stock kitchen items:%0D%0A%0D%0A${encodeURIComponent(itemList)}%0D%0A%0D%0AThank you,%0D%0AQrDine Kitchen Operations`;
    window.location.href = mailto;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 font-sans">
            Stock & Inventory
          </h1>
          <p className="text-gray-500 mt-2 font-sans">
            Manage your kitchen inventory and monitor restock predictions efficiently.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => handleFetchPrediction(selectedIngredient)}
            className="px-5 py-2.5 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 font-sans font-medium flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FiRefreshCw className={predictLoading ? "animate-spin" : ""} />
            Reload Predictions
          </button>

          <button 
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-sans font-medium cursor-pointer shadow-md transition-colors"
          >
            + Add New Item
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <StockCard />

      {/* Inventory Table */}
      <StockTable onEdit={(item) => setEditingItem(item)} />

      {/* Bottom Cards */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"> */}
        {/* AI Prediction Section */}
        {/* <div className="bg-white rounded-xl shadow-md p-6 border border-gray-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                <FiCpu size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 font-sans">
                AI Restock Predictions
              </h2>
            </div>
            
            <p className="text-gray-500 text-sm font-sans mb-4">
              Select or search an item to estimate depletion rate and get suggested restock recommendations.
            </p> */}

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"> */}
              {/* Dropdown Selection */}
              {/* <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">Select Item</label>
                <select
                  value={selectedIngredient}
                  onChange={(e) => {
                    setSelectedIngredient(e.target.value);
                    handleFetchPrediction(e.target.value);
                  }}
                  className="w-full border rounded-lg p-2 bg-white text-sm font-sans focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">-- Choose Item --</option>
                  {inventoryList.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom search */}
              {/* <form onSubmit={handleCustomPredictSubmit} className="flex flex-col justify-end">
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">Or Enter Ingredient</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Rice"
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    className="border rounded-lg p-2 text-sm font-sans flex-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-3 py-2 rounded-lg text-xs font-semibold font-sans hover:bg-zinc-800 transition"
                  >
                    Predict
                  </button>
                </div>
              </form>
            </div> */}

            {/* Prediction Output */}
            {/* {predictLoading && (
              <div className="py-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                <span className="ml-2 text-sm text-gray-400 font-sans">Querying Prediction Service...</span>
              </div>
            )}

            {!predictLoading && predictionData && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 font-sans mt-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800">{predictionData.ingredient}</h4>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Model: {predictionData.modelSource || predictionData.ModelSource}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                  <div className="bg-white p-2.5 rounded border border-slate-100">
                    <span className="text-xs text-gray-400 block mb-0.5">Estimated Life</span>
                    <span className="font-bold text-gray-800">
                      {predictionData.daysRemaining !== undefined ? predictionData.daysRemaining : predictionData.DaysRemaining} Days
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-100">
                    <span className="text-xs text-gray-400 block mb-0.5">Suggested Reorder</span>
                    <span className={`font-bold ${predictionData.suggestedReorderQuantity > 0 ? "text-orange-600" : "text-gray-800"}`}>
                      {predictionData.suggestedReorderQuantity !== undefined ? predictionData.suggestedReorderQuantity : predictionData.SuggestedReorderQuantity} Units
                    </span>
                  </div>
                </div>

                {(predictionData.lowStockAlert || predictionData.LowStockAlert) && (
                  <div className="flex items-center gap-2 mt-3 text-xs bg-red-50 text-red-700 p-2 rounded border border-red-100">
                    <FiAlertCircle size={14} className="shrink-0" />
                    <span><strong>Low stock alert:</strong> Replenishment recommended immediately.</span>
                  </div>
                )}
              </div>
            )}
          </div> */}
        {/* </div>  */}

        {/* Supplier Connect Section */}
        {/* <div className="bg-purple-50 rounded-xl shadow-md p-6 border border-purple-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-100 p-2.5 rounded-lg text-purple-700">
                <FiMail size={22} />
              </div>
              <h2 className="text-xl font-bold text-purple-800 font-sans">
                Supplier Connect Portal
              </h2>
            </div>
            
            <p className="text-purple-900/80 text-sm font-sans mb-4">
              Reach out directly to suppliers to place purchase orders for items flagged as critical. 
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100/50 mb-4">
              <h4 className="text-sm font-bold text-purple-900 mb-2 font-sans">
                Low Stock Restock Items ({lowStockAlerts.length})
              </h4>
              {lowStockAlerts.length === 0 ? (
                <p className="text-xs text-green-700 font-sans font-medium">✓ All kitchen items are above threshold levels.</p>
              ) : (
                <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-purple-800 font-sans">
                  {lowStockAlerts.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between border-b border-purple-100/40 pb-1">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.qty} units left (Alert: &lt;={item.lowStockThreshold})</span>
                    </div>
                  ))}
                  {lowStockAlerts.length > 3 && (
                    <div className="text-purple-600 font-medium text-[10px] text-right">
                      + {lowStockAlerts.length - 3} more items...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleSupplierEmail}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-sans font-semibold py-3 px-5 rounded-lg shadow-md transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiMail />
            <span>Generate Supplier Reorder Email</span>
          </button>
        </div>
      </div> */}

      {/* Forms Overlay Modals */}
      {showAddForm && (
        <AddInventoryForm onClose={() => setShowAddForm(false)} />
      )}

      {editingItem && (
        <UpdateInventoryForm item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
};

export default StockInventory;