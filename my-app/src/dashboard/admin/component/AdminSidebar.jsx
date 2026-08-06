import React, { useState, useEffect } from "react";
import {
  FiClipboard,
  FiBox,
  FiUsers,
  FiUser,
  FiLogOut,
  FiTrendingUp,
} from "react-icons/fi";
import { LuUtensilsCrossed } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import LogoutConfirm from "./LogutConfirm";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Sync active tab with location
  useEffect(() => {
    if (location.pathname.includes("/profile")) {
      setActiveTab("profile");
    } else if (location.pathname.includes("/menu-management")) {
      setActiveTab("menu");
    } else if (location.pathname.includes("/staff-management")) {
      setActiveTab("staff");
    } else if (location.pathname.includes("/inventory")) {
      setActiveTab("stock");
    } else if (location.pathname.includes("/offers")) {
      setActiveTab("offers");
    } else if (location.pathname === "/admin" || location.pathname === "/admin/") {
      setActiveTab("orders");
    }
  }, [location]);

  const handleConfirmLogout = () => {
    logout();
    navigate("/login");
  };

  const getBtnClass = (tabName) => {
    const isActive = activeTab === tabName;
    return "flex items-center gap-4 w-full rounded-xl px-5 py-4 transition-all duration-200 cursor-pointer " + 
      (isActive ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-100");
  };

  return (
    <aside className="w-72 bg-white border-r flex flex-col justify-between h-screen relative">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-4 p-8">
          <div className="bg-orange-500 rounded-xl w-14 h-14 flex items-center justify-center">
            <LuUtensilsCrossed className="text-white text-3xl" />
          </div>
          <div>
             <span className="text-2xl font-black tracking-tight text-[#2D2F2F] hover:opacity-80 transition-opacity cursor-pointer">
              Qr<span className="text-[#B41B00]">Dine</span>
            </span>
            <p className="text-zinc-500 text-xs font-semibold mt-1 font-sans">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Menu Links */}
        <div className="px-5 space-y-2">
          {/* Order Status */}
          <button
            onClick={() => {
              setActiveTab("orders");
              navigate("/admin");
            }}
            className={getBtnClass("orders")}
          >
            <FiClipboard size={22} />
            <span className="font-sans">Order Status</span>
          </button>

          {/* Menu Management */}
          <button
            onClick={() => {
              setActiveTab("menu");
              navigate("/admin/menu-management");
            }}
            className={getBtnClass("menu")}
          >
            <LuUtensilsCrossed size={22} />
            <span className="font-sans">Menu Management</span>
          </button>

          {/* Stock & Inventory */}
          <button
            onClick={() => {
              setActiveTab("stock");
              navigate("/admin/inventory");
            }}
            className={getBtnClass("stock")}
          >
            <FiBox size={22} />
            <span className="font-sans">Stock & Inventory</span>
          </button>

          {/* Promotions & Offers */}
          <button
            onClick={() => {
              setActiveTab("offers");
              navigate("/admin/offers");
            }}
            className={getBtnClass("offers")}
          >
            <FiTrendingUp size={22} />
            <span className="font-sans">Promotions & Offers</span>
          </button>

          {/* Staff Directory */}
          <button
            onClick={() => {
              setActiveTab("staff");
              navigate("/admin/staff-management");
            }}
            className={getBtnClass("staff")}
          >
            <FiUsers size={22} />
            <span className="font-sans">Staff Directory</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => {
              setActiveTab("profile");
              navigate("/admin/profile");
            }}
            className={getBtnClass("profile")}
          >
            <FiUser size={22} />
            <span className="font-sans">Profile</span>
          </button>
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="p-6">
        <hr className="border-gray-200" />
        <div className="mt-6">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-4 text-red-600 hover:text-red-800 cursor-pointer transition-colors font-sans w-full text-left"
          >
            <FiLogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Custom Logout Confirmation Popup Overlay */}
      {showLogoutConfirm && (
        <LogoutConfirm handleConfirmLogout={handleConfirmLogout} setShowLogoutConfirm={setShowLogoutConfirm}/>
      )}
    </aside>
  );
};

export default AdminSidebar;