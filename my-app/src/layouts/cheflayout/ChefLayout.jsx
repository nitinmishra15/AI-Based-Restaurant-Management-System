import { useState } from "react";
import { Outlet } from "react-router-dom";
import ChefNavbar from "../../dashboard/chef/components/ChefNavbar";
import ChefSidebar from "../../dashboard/chef/components/ChefSidebar";

export default function ChefLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Container */}
      <div className="w-72 border-r bg-zinc-50 hidden md:block h-screen">
        <ChefSidebar />
      </div>

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 min-w-0">
        <ChefNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}
