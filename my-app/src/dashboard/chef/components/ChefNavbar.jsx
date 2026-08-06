import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import { FiSearch, FiBell, FiSettings, FiUser } from "react-icons/fi";

function ChefNavbar({ searchQuery, setSearchQuery }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const name = user?.username || user?.Username || "Chef";
    const role = user?.role || user?.Role || "Chef Manager";

    const getHeaderTitle = () => {
        if (location.pathname.includes("/menu")) return "Menu Management";
        if (location.pathname.includes("/inventory")) return "Stock & Inventory";
        if (location.pathname.includes("/staff")) return "Staff Directory";
        if (location.pathname.includes("/profile")) return "Profile Settings";
        return "Active Orders";
    };

    return (
        <header className="w-full sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-8 py-4">

            {/* Left Side */}
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
                    {getHeaderTitle()}
                </h2>

                {location.pathname === "/chef/orders" && (
                    <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            Live Dashboard
                        </span>
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative hidden lg:block">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
                    />
                </div>

                {/* Clickable Profile details with only icon */}
                <div 
                    onClick={() => navigate("/chef/profile")}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity pl-4 border-l border-gray-300"
                >
                    <div className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 hover:border-orange-500 transition-colors cursor-pointer">
                        <FiUser size={18} />
                    </div>

                    <div className="hidden xl:block">
                        <h4 className="font-bold text-sm text-gray-800 font-sans">
                            {name}
                        </h4>
                        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-sans">
                            {role}
                        </p>
                    </div>
                </div>

            </div>

        </header>
    );
}

export default ChefNavbar;