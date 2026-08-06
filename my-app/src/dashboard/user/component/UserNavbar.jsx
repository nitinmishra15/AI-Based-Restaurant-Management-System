import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../../../shared/hooks/useCart';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthContextApi/AuthProvider';
import { useTable } from '../../../app/providers/TableContextApi/TableProvider';

export default function UserNavbar({ 
  searchQuery, 
  setSearchQuery, 
  onCartClick, 
  onNotificationClick,
  activeSection,
  setActiveSection
}) {
  const { cartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const { tableId } = useTable();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getActiveSection = () => {
    if (location.pathname.includes("/menu")) return "menu";
    if (location.pathname.includes("/offers")) return "offers";
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/profile")) return "profile";
    return "discover";
  };
  const active = getActiveSection();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 lg:px-8 py-4 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to={`/user?tableId=${tableId || 1}`} className="cursor-pointer">
            <span className="text-2xl font-black tracking-tight text-[#2D2F2F] hover:opacity-80 transition-opacity cursor-pointer">
              Qr<span className="text-[#B41B00]">Dine</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-wider">
          <Link 
            to={`/user?tableId=${tableId || 1}`}
            className={`transition-colors duration-300 py-1 border-b-2 cursor-pointer ${
              active === 'discover' 
                ? 'text-[#B41B00] border-b-[#B41B00]' 
                : 'text-[#2D2F2F]/60 border-b-transparent hover:text-[#2D2F2F]'
            }`}
          >
            DISCOVER
          </Link>
          <Link 
            to={`/user/menu?tableId=${tableId || 1}`}
            className={`transition-colors duration-300 py-1 border-b-2 cursor-pointer ${
              active === 'menu' 
                ? 'text-[#B41B00] border-b-[#B41B00]' 
                : 'text-[#2D2F2F]/60 border-b-transparent hover:text-[#2D2F2F]'
            }`}
          >
            MENU
          </Link>
          <Link 
            to={`/user/offers?tableId=${tableId || 1}`}
            className={`transition-colors duration-300 py-1 border-b-2 cursor-pointer ${
              active === 'offers' 
                ? 'text-[#B41B00] border-b-[#B41B00]' 
                : 'text-[#2D2F2F]/60 border-b-transparent hover:text-[#2D2F2F]'
            }`}
          >
            OFFERS
          </Link>
          <Link 
            to={`/user/orders?tableId=${tableId || 1}`}
            className={`transition-colors duration-300 py-1 border-b-2 cursor-pointer ${
              active === 'orders' 
                ? 'text-[#B41B00] border-b-[#B41B00]' 
                : 'text-[#2D2F2F]/60 border-b-transparent hover:text-[#2D2F2F]'
            }`}
          >
            ORDERS
          </Link>
        </div>

        {/* Right: Search, Cart, Notifications, Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Search bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[180px] md:w-[240px] pl-10 pr-4 py-2 text-sm rounded-full bg-[#F3F4F6] text-[#2D2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all duration-300"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Cart Icon */}
          <button 
            onClick={onCartClick}
            className="relative p-2 rounded-full text-[#2D2F2F] hover:bg-gray-100 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#B41B00] text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(180,27,0,0.4)] animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Profile Icon / Dropdown (Only for Authenticated Users) */}
          {user && (user.role === "User" || user.Role === "User") && (
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:border-[#B41B00] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <User className="w-5 h-5 text-[#2D2F2F]" />
              </button>

              {/* Avatar Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <Link
                    to={`/user/profile?tableId=${tableId || 1}`}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Profile Setting
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      window.location.reload();
                    }}
                    className="w-full text-left block px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
