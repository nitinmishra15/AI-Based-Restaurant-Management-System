import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import { FiClipboard, FiBox, FiUsers, FiUser, FiLogOut } from "react-icons/fi";
import { LuUtensilsCrossed } from "react-icons/lu";

function ChefSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-4 bg-orange-50 text-orange-600 rounded-xl px-5 py-4 shadow-sm font-semibold transition-all duration-200"
      : "flex items-center gap-4 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl px-5 py-4 transition-all duration-200";

  return (
    <aside className="h-full w-full flex flex-col p-6 bg-zinc-50">
      {/* Logo */}
      <div className="flex items-center gap-4 p-4 mb-8">
        <div className="bg-orange-500 rounded-xl w-12 h-12 flex items-center justify-center">
          <LuUtensilsCrossed className="text-white text-2xl" />
        </div>
        <div>
           <span className="text-2xl font-black tracking-tight text-[#2D2F2F] hover:opacity-80 transition-opacity cursor-pointer">
                        Qr<span className="text-[#B41B00]">Dine</span>
                      </span>
          <p className="text-zinc-500 text-xs font-semibold mt-1 font-sans">
            Chef's Control
          </p>
        </div>
      </div>

      {/* Main Menu Links */}
      <nav className="flex flex-col space-y-2 flex-grow px-2">
        <NavLink to="/chef/orders" className={getLinkClass}>
          <FiClipboard size={22} />
          <span className="font-sans">Orders</span>
        </NavLink>

        <NavLink to="/chef/menu" className={getLinkClass}>
          <LuUtensilsCrossed size={22} />
          <span className="font-sans">Menu</span>
        </NavLink>

        <NavLink to="/chef/inventory" className={getLinkClass}>
          <FiBox size={22} />
          <span className="font-sans">Inventory</span>
        </NavLink>

        <NavLink to="/chef/staff" className={getLinkClass}>
          <FiUsers size={22} />
          <span className="font-sans">Staff</span>
        </NavLink>

        <NavLink to="/chef/profile" className={getLinkClass}>
          <FiUser size={22} />
          <span className="font-sans">Profile</span>
        </NavLink>
      </nav>

      {/* Bottom Menu: Logout */}
      <div className="pt-6 border-t border-zinc-200 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl px-5 py-4 transition w-full text-left cursor-pointer font-semibold font-sans"
        >
          <FiLogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default ChefSidebar;