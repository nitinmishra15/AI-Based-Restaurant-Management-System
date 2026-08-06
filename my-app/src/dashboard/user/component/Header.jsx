import React from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../../../app/providers/TableContextApi/TableProvider";
import { useCart } from "../../../shared/hooks/useCart";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { tableId } = useTable();
  const { cartItemsCount, setCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm z-50 h-16 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Back Button */}
        <button 
          onClick={() => navigate(`/user?tableId=${tableId || 1}`)}
          className="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-full active:scale-95 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-[#2D2F2F]" />
        </button>

        {/* Search */}
        <div className="flex-1 relative max-w-lg">
          <Search
            className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search flavors..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-[#F3F4F6] text-[#2D2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all duration-300"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Cart Icon (Exactly as on home page) */}
          <button 
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full text-[#2D2F2F] hover:bg-gray-100 active:scale-95 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#B41B00] text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(180,27,0,0.4)] animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Profile Icon (Only displayed when authenticated customer is logged in) */}
          {user && (user.role === "User" || user.Role === "User") && (
            <div className="p-2 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50">
              <User className="w-5 h-5 text-[#2D2F2F]" />
            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;