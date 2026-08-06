import React, { useContext, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";
import UpdateProductForm from "./UpdateProductForm"; // Adjust this relative import path if needed

const MenuCard = ({ item }) => {
  const { updateMenuItem, deleteMenuItem } = useContext(MenuContext);
  const [isEditing, setIsEditing] = useState(false); // Controls edit modal visibility

  // Toggles the availability status (Available/Unavailable) on click
  const handleToggleStatus = async () => {
    const data = new FormData();
    data.append("itemName", item.itemName);
    data.append("description", item.description || "");
    data.append("price", item.price);
    data.append("categoryId", item.categoryId);
    data.append("status", !item.status); // Send the toggled status value

    const response = await updateMenuItem(item.id, data);
    if (!response.success) {
      alert(response.message);
    }
  };

  // Prompts confirmation and deletes the menu item
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.itemName}"?`)) {
      const response = await deleteMenuItem(item.id);
      if (response.success) {
        alert("Item Deleted Successfully");
      } else {
        alert(response.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative">
      {/* Food Image */}
      <img
        src={item.imageUrl}
        alt={item.itemName}
        className="w-full h-44 object-cover"
      />

      {/* Card Body */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full font-sans">
          {item.categoryName}
        </span>

        {/* Food Name */}
        <h2 className="text-xl font-bold mt-3 font-sans">
          {item.itemName}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-2 font-sans">
          {item.description}
        </p>

        {/* Price */}
        <div className="mt-4 text-2xl font-bold text-green-600 font-sans">
          ₹{item.price}
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center mt-5">
          {/* Status Toggle */}
          <div className="flex items-center gap-2 font-sans">
            {item.status ? (
              <>
                <FaToggleOn
                  size={28}
                  className="text-green-500 cursor-pointer"
                  onClick={handleToggleStatus}
                />
                <span className="text-green-600 font-medium">
                  Available
                </span>
              </>
            ) : (
              <>
                <FaToggleOff
                  size={28}
                  className="text-gray-400 cursor-pointer"
                  onClick={handleToggleStatus}
                />
                <span className="text-gray-500 font-medium">
                  Unavailable
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
                 
          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit size={20} />
            </button>

            {/* Delete Button */}
            <button
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={handleDelete}
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Render the Update Modal Form if editing is active */}
      {isEditing && (
        <UpdateProductForm
          item={item}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default MenuCard;