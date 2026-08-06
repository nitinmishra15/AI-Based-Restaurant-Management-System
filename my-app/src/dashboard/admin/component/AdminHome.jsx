import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Edit2, Trash2, CheckCircle2, Clock, X, Save } from "lucide-react";

export default function AdminHome() {
  const { searchQuery } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Order modal/state
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tableId: 1,
    orderItems: "",
    price: 0,
    status: "Pending",
    quantity: 1,
    duration: "",
    notes: ""
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://localhost:44311/api/orders");
      // Sort newest orders first
      const data = response.data || [];
      setOrders(data.reverse());
    } catch (err) {
      setError("Failed to fetch orders from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`https://localhost:44311/api/orders/${id}`);
      alert("Order deleted successfully!");
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order.id);
    setEditFormData({
      tableId: order.tableId || 1,
      orderItems: order.orderItems || "",
      price: order.price || 0,
      status: order.status || "Pending",
      quantity: order.quantity || 1,
      duration: order.duration || "",
      notes: order.notes || ""
    });
  };

  const handleEditChange = (e) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setEditFormData({
      ...editFormData,
      [e.target.name]: value
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`https://localhost:44311/api/orders/${id}`, {
        TableId: parseInt(editFormData.tableId),
        OrderItems: editFormData.orderItems,
        Price: parseFloat(editFormData.price),
        Notes: editFormData.notes,
        Status: editFormData.status,
        Quantity: parseInt(editFormData.quantity),
        Duration: editFormData.duration
      });
      alert("Order updated successfully!");
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      alert("Failed to update order: " + (err.response?.data || err.message));
    }
  };

  const handleQuickPrepare = async (order) => {
    const duration = prompt("Enter preparation time (e.g. 15 mins):", order.duration || "15 mins");
    if (duration === null) return; // user cancelled

    try {
      await axios.put(`https://localhost:44311/api/orders/${order.id}`, {
        TableId: order.tableId,
        OrderItems: order.orderItems,
        Price: order.price,
        Notes: order.notes,
        Status: "Prepared",
        Quantity: order.quantity,
        Duration: duration
      });
      alert("Order marked as Prepared!");
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  // Filter orders by search query
  const filteredOrders = orders.filter(o => {
    const q = (searchQuery || "").toLowerCase();
    const idMatch = (o.id || "").toString().toLowerCase().includes(q);
    const tableMatch = (o.tableId || "").toString().toLowerCase().includes(q);
    const itemsMatch = (o.orderItems || "").toLowerCase().includes(q);
    const statusMatch = (o.status || "").toLowerCase().includes(q);
    return idMatch || tableMatch || itemsMatch || statusMatch;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-xl font-bold text-gray-500 animate-pulse">
        Loading Order Queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Title */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Order Status Queue</h1>
          <p className="text-gray-500 mt-1">Real-time database order status monitor</p>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#B41B00] text-white text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Table</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Prep Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isEditingThis = editingOrder === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      {/* ID */}
                      <td className="p-4 pl-6 font-bold text-gray-800">
                        #{order.id}
                      </td>

                      {/* Table */}
                      <td className="p-4 font-semibold text-gray-600">
                        {isEditingThis ? (
                          <input
                            type="number"
                            name="tableId"
                            value={editFormData.tableId}
                            onChange={handleEditChange}
                            className="w-16 px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          `Table ${order.tableId}`
                        )}
                      </td>

                      {/* Items */}
                      <td className="p-4 text-gray-700 max-w-xs truncate">
                        {isEditingThis ? (
                          <input
                            type="text"
                            name="orderItems"
                            value={editFormData.orderItems}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          order.orderItems
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-[#ff5233]">
                        {isEditingThis ? (
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price}
                            onChange={handleEditChange}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          `₹${order.price}`
                        )}
                      </td>

                      {/* Prep Time / Duration */}
                      <td className="p-4 text-sm font-semibold text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {isEditingThis ? (
                            <input
                              type="text"
                              name="duration"
                              value={editFormData.duration}
                              onChange={handleEditChange}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              placeholder="e.g. 15 mins"
                            />
                          ) : (
                            order.duration || "N/A"
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isEditingThis ? (
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                            className="px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Prepared">Prepared</option>
                            <option value="Served">Served</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              (order.status || "").toLowerCase() === "served"
                                ? "bg-green-100 text-green-700"
                                : (order.status || "").toLowerCase() === "prepared"
                                ? "bg-blue-100 text-blue-700"
                                : (order.status || "").toLowerCase() === "preparing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        {isEditingThis ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(order.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                              title="Save Changes"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingOrder(null)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Mark Prepared Fast Action */}
                            {(order.status || "").toLowerCase() === "pending" && (
                              <button
                                onClick={() => handleQuickPrepare(order)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
                                title="Mark Prepared"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => handleEditClick(order)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                              title="Edit Details"
                            >
                              <Edit2 size={18} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    No orders placed in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
