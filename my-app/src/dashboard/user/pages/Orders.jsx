import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../component/OrderCard";
import OrderHistory from "../component/OrderHistory";
import { useTable } from "../../../app/providers/TableContextApi/TableProvider";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";

function Orders() {
  const { tableId } = useTable();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://localhost:44311/api/orders");
        const data = response.data || [];
        
        // Filter orders by active tableId and user's placed order IDs
        const userKey = user?.mobileNumber || user?.MobileNumber || "guest";
        const keyName = `placed_orders_${userKey}`;
        const userOrderIds = JSON.parse(localStorage.getItem(keyName) || "[]");

        const currentTableId = parseInt(tableId) || 1;
        const filtered = data.filter(o => {
          const oId = o.id !== undefined ? o.id : o.Id;
          const oTableId = o.tableId !== undefined ? o.tableId : o.TableId;
          return oTableId === currentTableId && userOrderIds.includes(oId);
        });
        
        // Map to format required by OrderCard
        const mapped = filtered.map(o => {
          let itemSummary = o.orderItems || o.OrderItems || "";
          let itemImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
          try {
            if (itemSummary.trim().startsWith("[")) {
              const parsed = JSON.parse(itemSummary);
              itemSummary = parsed.map(item => `${item.name || item.itemName} x${item.quantity}`).join(", ");
              const firstImage = parsed[0]?.image || parsed[0]?.imageUrl;
              if (firstImage) {
                itemImage = firstImage;
              }
            }
          } catch (e) {
            // fallback
          }

          const priceVal = o.price !== undefined ? o.price : o.Price;
          const statusVal = o.status !== undefined ? o.status : o.Status;
          const orderIdVal = o.id !== undefined ? o.id : o.Id;

          return {
            id: orderIdVal,
            orderId: orderIdVal,
            restaurant: "Culinary AI",
            date: new Date().toLocaleDateString(),
            image: itemImage,
            items: itemSummary,
            price: `₹${priceVal}`,
            status: statusVal,
            statusColor: (statusVal || "").toLowerCase() === "served" ? "green" : "yellow"
          };
        });

        // Show newest orders first
        setOrders(mapped.reverse());
      } catch (err) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tableId, user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // DELETE request to the C# Order Service
      const response = await axios.delete(`https://localhost:44311/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Remove from UI state
        setOrders(prev => prev.filter(o => o.id !== orderId));

        // Remove from local storage placed_orders list
        const userKey = user?.mobileNumber || user?.MobileNumber || "guest";
        const keyName = `placed_orders_${userKey}`;
        const userOrderIds = JSON.parse(localStorage.getItem(keyName) || "[]");
        const updatedIds = userOrderIds.filter(id => id !== orderId);
        localStorage.setItem(keyName, JSON.stringify(updatedIds));

        alert("Order cancelled successfully!");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert(err.response?.data?.message || err.message || "Failed to cancel the order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#2D2E32]">My Orders</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Track and manage your recent dining experiences at Table #{tableId || 1}.
          </p>
        </div>

        {/* Orders */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <span className="text-5xl">🍽️</span>
            <h2 className="text-xl font-bold text-gray-800 mt-4">No Orders Placed Yet</h2>
            <p className="text-gray-500 mt-2">Browse the menu to start ordering tasty flavors!</p>
          </div>
        )}

        {/* Bottom Section */}
        <OrderHistory />
      </main>
    </div>
  );
}

export default Orders;