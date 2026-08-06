import React, { useState } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '../../../shared/hooks/useCart';
import axios from 'axios';
import { useTable } from '../../../app/providers/TableContextApi/TableProvider';
import { useAuth } from '../../../app/providers/AuthContextApi/AuthProvider';
import LoginViaMobile from './LoginViaMobile';
import LoginViaCredential from './LoginViaCredential';

export default function CartDrawer({ isOpen, onClose }) {
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    clearCart,
    subtotal,
    tax,
    deliveryFee: delivery,
    totalPrice: finalTotal
  } = useCart();

  const { tableId } = useTable();
  const { user } = useAuth();

  // Steps: "cart" | "login-mobile" | "login-credential" | "payment" | "confirmation"
  const [drawerStep, setDrawerStep] = useState("cart");
  const [savedMobile, setSavedMobile] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [completedTxnId, setCompletedTxnId] = useState("");

  const [error, setError] = useState("");
  const [ordering, setOrdering] = useState(false);

  if (!isOpen) return null;

  // sum of item quantities
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Send request to ASP.NET Core Order Service to save the final order
  const handlePlaceOrder = async (txnId, method) => {
    setOrdering(true);
    setError("");

    const token = localStorage.getItem("token");
    const itemsDescription = cartItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    const orderPayload = {
      TableId: parseInt(tableId || "1"),
      OrderItems: itemsDescription,
      Price: finalTotal,
      Notes: "Table QR Order",
      Status: "Pending",
      Quantity: totalQuantity,
      Duration: "15-20 mins",
      PaymentStatus: "Completed",
      TransactionId: txnId,
      PaymentMethod: method,
      Email: user?.email || user?.Email || "",
      CustomerName: user?.username || user?.Username || user?.Name || "Customer",
      MobileNumber: user?.mobileNumber || user?.MobileNumber || ""
    };

    try {
      const response = await axios.post("https://localhost:44311/api/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        const createdOrder = response.data;
        const orderId = createdOrder.id !== undefined ? createdOrder.id : createdOrder.Id;
        if (orderId) {
          const userKey = user?.mobileNumber || user?.MobileNumber || "guest";
          const keyName = `placed_orders_${userKey}`;
          const existing = JSON.parse(localStorage.getItem(keyName) || "[]");
          existing.push(orderId);
          localStorage.setItem(keyName, JSON.stringify(existing));
        }

        setCompletedTxnId(txnId);
        setDrawerStep("confirmation");
      } else {
        setError("Failed to save order. Please contact support.");
      }
    } catch (err) {
      console.error("Order Service error:", err);
      setError(err.response?.data?.message || err.message || "Could not connect to the Order Service.");
    } finally {
      setOrdering(false);
    }
  };

  // Process payment using simulated payment gateway service
  const handleProcessPayment = async () => {
    setProcessingPayment(true);
    setError("");

    const paymentPayload = {
      amount: finalTotal,
      email: user?.email || user?.Email || "guest@example.com",
      mobileNumber: user?.mobileNumber || user?.MobileNumber || "0000000000",
      paymentMethod: paymentMethod
    };

    try {
      const response = await axios.post("https://localhost:44311/api/payments/process", paymentPayload);
      if (response.data && response.data.success) {
        const txnId = response.data.transactionId;
        // Continue to save order
        await handlePlaceOrder(txnId, paymentMethod);
      } else {
        setError("Payment was declined by the gateway.");
      }
    } catch (err) {
      console.error("Payment Gateway error:", err);
      setError(err.response?.data?.message || err.message || "Failed to process payment with gateway.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCheckoutClick = () => {
    const isCustomer = user && (user.role === "User" || user.Role === "User");
    if (isCustomer) {
      setDrawerStep("payment");
    } else {
      setDrawerStep("login-mobile");
    }
  };

  const handleLoginSuccess = () => {
    setDrawerStep("payment");
  };

  const handleNewUser = (mobile) => {
    setSavedMobile(mobile);
    setDrawerStep("login-credential");
  };

  const handleRegisterSuccess = () => {
    setDrawerStep("payment");
  };

  const handleCloseDrawer = () => {
    setDrawerStep("cart");
    setError("");
    setCompletedTxnId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background shadow overlay */}
      <div 
        onClick={handleCloseDrawer}
        className="absolute inset-0 bg-black bg-opacity-40"
      />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white flex flex-col justify-between shadow-2xl p-6 font-sans">
        
        {/* Cart Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-[#2D2F2F]">
              {drawerStep === "cart" 
                ? "Order Cart" 
                : drawerStep === "payment" 
                ? "Secure Payment" 
                : drawerStep === "confirmation" 
                ? "Order Success" 
                : "Checkout"}
            </h2>
          </div>
          <button 
            onClick={handleCloseDrawer}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Local Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[11px] font-bold text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto py-4">
          
          {drawerStep === "cart" && (
            cartItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">Your cart is empty.</p>
                <p className="text-xs mt-1">Add items from the menu to start ordering!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-3 border border-gray-150"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-xl object-cover"
                  />

                  <div className="flex-grow">
                    <h4 className="text-xs font-bold text-[#2D2F2F]">{item.name}</h4>
                    <p className="text-[10px] text-gray-400">Price: ₹{item.price}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-[#2D2F2F]">₹{item.price * item.quantity}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {drawerStep === "login-mobile" && (
            <LoginViaMobile 
              onLoginSuccess={handleLoginSuccess}
              onNewUser={handleNewUser}
              onBack={() => setDrawerStep("cart")}
            />
          )}

          {drawerStep === "login-credential" && (
            <LoginViaCredential
              mobileNumber={savedMobile}
              onRegisterSuccess={handleRegisterSuccess}
              onBack={() => setDrawerStep("login-mobile")}
            />
          )}

          {drawerStep === "payment" && (
            <div className="space-y-6 font-sans">
              <div className="text-center">
                <h3 className="text-base font-bold text-[#2D2F2F]">Choose Payment Method</h3>
                <p className="text-[11px] text-gray-400 mt-1">Complete your transaction to place the order</p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Table Number:</span>
                  <span className="font-bold text-gray-700">#{tableId || "1"}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Total Items:</span>
                  <span className="font-bold text-gray-700">{totalQuantity}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2D2F2F] pt-2 mt-2 border-t border-dashed">
                  <span>Amount to Pay:</span>
                  <span className="text-[#B41B00]">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-red-500 bg-red-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI" 
                      checked={paymentMethod === 'UPI'} 
                      onChange={() => setPaymentMethod('UPI')} 
                      className="accent-[#B41B00]"
                    />
                    <span className="text-xs font-bold text-gray-700">UPI / QR Code</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">GPay, PhonePe</span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-red-500 bg-red-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Card" 
                      checked={paymentMethod === 'Card'} 
                      onChange={() => setPaymentMethod('Card')} 
                      className="accent-[#B41B00]"
                    />
                    <span className="text-xs font-bold text-gray-700">Credit / Debit Card</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">Visa, MasterCard</span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'NetBanking' ? 'border-red-500 bg-red-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="NetBanking" 
                      checked={paymentMethod === 'NetBanking'} 
                      onChange={() => setPaymentMethod('NetBanking')} 
                      className="accent-[#B41B00]"
                    />
                    <span className="text-xs font-bold text-gray-700">Net Banking</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">All Indian Banks</span>
                </label>
              </div>

              {/* Pay & Place Order Button */}
              <button
                onClick={handleProcessPayment}
                disabled={processingPayment || ordering}
                className="w-full py-3.5 bg-[#B41B00] hover:bg-[#FF775D] text-white font-bold rounded-full text-xs transition-colors duration-200 uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processingPayment ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Payment...</span>
                  </>
                ) : ordering ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Pay & Place Order (₹{finalTotal.toFixed(0)})</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDrawerStep("cart")}
                className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors pt-2"
              >
                Back to Cart
              </button>
            </div>
          )}

          {drawerStep === "confirmation" && (
            <div className="flex flex-col items-center justify-center text-center py-6 font-sans space-y-6">
              {/* Checkmark circle */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#2D2F2F]">Order Confirmed!</h3>
                <p className="text-xs text-green-600 font-bold mt-1">Payment Successful</p>
              </div>

              {/* Order and Transaction Info Card */}
              <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3 text-left">
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-gray-700 tracking-wider">{completedTxnId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Table Number:</span>
                  <span className="font-bold text-gray-700">#{tableId || "1"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="font-bold text-gray-700">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="font-bold text-gray-900">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  clearCart();
                  setDrawerStep("cart");
                  setCompletedTxnId("");
                  onClose();
                }}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-xs transition-colors duration-200 uppercase"
              >
                Close & Done
              </button>
            </div>
          )}

        </div>

        {/* Pricing Summary and Checkout Button */}
        {drawerStep === "cart" && cartItems.length > 0 && (
          <div className="border-t border-gray-200 pt-4 bg-white">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Subtotal:</span>
              <span className="font-bold text-[#2D2F2F]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>GST (5%):</span>
              <span className="font-bold text-[#2D2F2F]">₹{tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Delivery Charges:</span>
              <span className="font-bold text-[#2D2F2F]">
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#2D2F2F] my-3 pt-2 border-t border-dashed">
              <span>Grand Total:</span>
              <span className="text-[#B41B00]">₹{finalTotal.toFixed(0)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              disabled={ordering}
              className="w-full py-3 bg-[#B41B00] hover:bg-[#FF775D] text-white font-bold rounded-full text-xs transition-colors duration-200 uppercase disabled:opacity-50"
            >
              Checkout Order
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
