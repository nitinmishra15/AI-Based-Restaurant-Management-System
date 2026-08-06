import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import StaffCard from "./StaffCard";
import AddStaffForm from "./AddStaffForm";

const StaffDirectory = () => {
  const { staffList, fetchStaff, deleteStaff, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    await fetchStaff();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const response = await deleteStaff(id);
      if (response.success) {
        alert("Staff Member Deleted Successfully");
      } else {
        alert(response.message);
      }
    }
  };

  if (loading) {
    return <h2 className="p-6 text-xl font-bold font-sans">Loading staff directory...</h2>;
  }

  // Filter staff by username, email, or role search query
  const filteredStaff = (staffList || []).filter(member => {
    const q = searchQuery.toLowerCase();
    return (
      (member.username || "").toLowerCase().includes(q) ||
      (member.email || "").toLowerCase().includes(q) ||
      (member.role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      {/* Header section identical to MenuManagement */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans">
          Staff Directory
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer font-sans transition-colors duration-200 font-semibold"
        >
          + Add Staff
        </button>
      </div>

      {/* Live Search Bar */}
      <div className="mb-6 max-w-sm">
        <input
          type="text"
          placeholder="Search staff by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
        />
      </div>

      {/* Staff Card Grid matching MenuManagement */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400 font-sans">
          No staff members found.
        </div>
      )}

      {/* Add Staff Modal */}
      {showForm && (
        <AddStaffForm
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default StaffDirectory;