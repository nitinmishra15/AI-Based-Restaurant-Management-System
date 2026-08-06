import React, { useState } from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import UpdateStaffForm from "./UpdateStaffForm";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";

const StaffCard = ({ member, onDelete }) => {
  const { updateStaff } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Extract variables with case-insensitive fallbacks for API compatibility
  const memberId = member?.id || member?.Id;
  const username = member?.username || member?.Username || "";
  const email = member?.email || member?.Email || "";
  const mobileNumber = member?.mobileNumber || member?.MobileNumber || "";
  const role = member?.role || member?.Role || "";
  const dutyPeriod = member?.dutyPeriod || member?.DutyPeriod || "";
  const isOnDuty = member?.isOnDuty !== undefined ? member?.isOnDuty : member?.IsOnDuty;
  const imageUrl = member?.imageUrl || member?.ImageUrl || "";

  // Default professional profile placeholders matching the dynamic role
  const profileImage = imageUrl || (role === "Admin"
    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500"
    : "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500");

  const roleColors = role === "Admin"
    ? "bg-red-100 text-red-600 border-red-200"
    : role === "Chef"
    ? "bg-orange-100 text-orange-600 border-orange-200"
    : "bg-blue-100 text-blue-600 border-blue-200";

  const handleToggleStatus = async () => {
    const data = new FormData();
    data.append("username", username);
    data.append("email", email); 
    data.append("mobileNumber", mobileNumber); 
    data.append("role", role);
    data.append("dutyPeriod", dutyPeriod);
    data.append("isOnDuty", !isOnDuty); // toggle the boolean status

    const response = await updateStaff(memberId, data);
    if (!response.success) {
      alert(response.message || "Failed to update duty status.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative">
      {/* Profile Image (Top Banner) */}
      <img
        src={profileImage}
        alt={username}
        className="w-full h-44 object-cover"
      />

      {/* Card Content */}
      <div className="p-4">
        {/* Role Badge */}
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${roleColors} font-sans`}>
          {role}
        </span>

        {/* Username */}
        <h2 className="text-xl font-bold mt-3 font-sans text-gray-800">
          {username}
        </h2>

        {/* Details: Email, Phone & Duty Period */}
        <div className="space-y-1.5 text-gray-500 text-sm mt-3 font-sans">
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-400" />
            <span className="truncate text-xs">{email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-gray-400" />
            <span className="text-xs">{mobileNumber || "No Phone"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <span className="text-xs">Duty Period: <strong className="text-gray-700">{dutyPeriod || "Not Set"}</strong></span>
          </div>
        </div>

        {/* Bottom Actions Section */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
          {/* Status Toggle matching MenuCard style */}
          <div className="flex items-center gap-2 font-sans">
            {isOnDuty ? (
              <>
                <FaToggleOn
                  size={28}
                  className="text-green-500 cursor-pointer"
                  onClick={handleToggleStatus}
                />
                <span className="text-green-600 font-semibold text-xs">
                  On Duty
                </span>
              </>
            ) : (
              <>
                <FaToggleOff
                  size={28}
                  className="text-gray-400 cursor-pointer"
                  onClick={handleToggleStatus}
                />
                <span className="text-gray-500 font-semibold text-xs">
                  Off Duty
                </span>
              </>
            )}
          </div>

          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
              onClick={() => setIsEditing(true)}
              title="Edit Staff Details"
            >
              <FaEdit size={20} />
            </button>

            {/* Delete Button */}
            <button
              className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
              onClick={() => onDelete(memberId)}
              title="Delete Staff Record"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Render Update modal if edit clicked */}
      {isEditing && (
        <UpdateStaffForm
          member={member}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default StaffCard;