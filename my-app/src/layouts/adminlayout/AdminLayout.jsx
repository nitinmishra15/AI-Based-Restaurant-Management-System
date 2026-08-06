import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../dashboard/admin/component/AdminSidebar";
import { AuthProvider } from "../../app/providers/AuthContextApi/AuthProvider";
import AdminNavbar from "../../dashboard/admin/component/AdminNavbar";

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full h-screen">

      {/* Sidebar */}

      <div className="w-72 border-r">
        <AdminSidebar />
      </div>

      {/* Main Content */}

      <div className="flex flex-col flex-1 bg-gray-100">

        <AdminNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ searchQuery }} />
        </div>

      </div>

    </div>
  );
}