import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventoryList, setInventoryList] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://localhost:44345/api/Inventory";
  const AI_API_BASE = "https://localhost:44345/api/inventory";

  // Fetch all inventory items
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE);
      // Normalized list mapping backend model names to standard frontend naming
      const normalized = (response.data || []).map((item) => ({
        id: item.id !== undefined ? item.id : item.Id,
        name: item.inventoryName !== undefined ? item.inventoryName : item.InventoryName,
        price: item.price !== undefined ? item.price : item.Price,
        qty: item.qty !== undefined ? item.qty : item.Qty,
        status: item.status !== undefined ? item.status : item.Status,
        category: item.category !== undefined ? item.category : item.Category,
        lowStockThreshold: item.lowStockThreshold !== undefined ? item.lowStockThreshold : item.LowStockThreshold,
        isLowStock: item.isLowStock !== undefined ? item.isLowStock : item.IsLowStock,
      }));
      setInventoryList(normalized);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  // Fetch low stock alerts
  const fetchLowStockAlerts = async (threshold = null) => {
    try {
      const url = threshold ? `${API_BASE}/low-stock?threshold=${threshold}` : `${API_BASE}/low-stock`;
      const response = await axios.get(url);
      const normalized = (response.data || []).map((item) => ({
        id: item.id !== undefined ? item.id : item.Id,
        name: item.inventoryName !== undefined ? item.inventoryName : item.InventoryName,
        price: item.price !== undefined ? item.price : item.Price,
        qty: item.qty !== undefined ? item.qty : item.Qty,
        status: item.status !== undefined ? item.status : item.Status,
        category: item.category !== undefined ? item.category : item.Category,
        lowStockThreshold: item.lowStockThreshold !== undefined ? item.lowStockThreshold : item.LowStockThreshold,
        isLowStock: item.isLowStock !== undefined ? item.isLowStock : item.IsLowStock,
      }));
      setLowStockAlerts(normalized);
      return normalized;
    } catch (err) {
      console.error("Error fetching low stock alerts:", err);
      return [];
    }
  };

  // Add a new inventory item
  const addInventoryItem = async (itemData) => {
    try {
      // Backend expects: InventoryName, Price, Qty, Status, Category, LowStockThreshold
      const payload = {
        inventoryName: itemData.name,
        price: parseFloat(itemData.price),
        qty: parseInt(itemData.qty, 10),
        status: itemData.status || "In Stock",
        category: itemData.category || "General",
        lowStockThreshold: parseInt(itemData.lowStockThreshold, 10) || 5,
      };
      const response = await axios.post(API_BASE, payload);
      await fetchInventory();
      await fetchLowStockAlerts();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error adding inventory item:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to add inventory item",
      };
    }
  };

  // Update an existing inventory item
  const updateInventoryItem = async (id, itemData) => {
    try {
      const payload = {
        inventoryName: itemData.name,
        price: parseFloat(itemData.price),
        qty: parseInt(itemData.qty, 10),
        status: itemData.status || "In Stock",
        category: itemData.category || "General",
        lowStockThreshold: parseInt(itemData.lowStockThreshold, 10) || 5,
      };
      const response = await axios.put(`${API_BASE}/${id}`, payload);
      await fetchInventory();
      await fetchLowStockAlerts();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating inventory item:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to update inventory item",
      };
    }
  };

  // Delete an inventory item
  const deleteInventoryItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchInventory();
      await fetchLowStockAlerts();
      return { success: true };
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to delete inventory item",
      };
    }
  };

  // Get AI prediction for ingredient
  const getPrediction = async (ingredient) => {
    try {
      const response = await axios.get(`${AI_API_BASE}/predict/${encodeURIComponent(ingredient)}`);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error fetching AI prediction for ${ingredient}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to fetch prediction",
      };
    }
  };

  // Initial load
  useEffect(() => {
    fetchInventory();
    fetchLowStockAlerts();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventoryList,
        lowStockAlerts,
        loading,
        error,
        fetchInventory,
        fetchLowStockAlerts,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        getPrediction,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
