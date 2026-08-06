import React, { useContext, useState } from "react";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";

const AddProductForm = ({ onClose }) => {
    const { addMenuItem, categories } = useContext(MenuContext);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
        price: "",
        categoryId: "", 
        image: null,
        status: true
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            if (file) {
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build multipart/form-data payload
        const data = new FormData();
        data.append("itemName", formData.itemName);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("categoryId", formData.categoryId); 
        data.append("status", formData.status);
        data.append("image", formData.image); // Matches the 'Image' property in C# MenuCreateDto

        const response = await addMenuItem(data);

        if (response.success) {
            alert("Item Added Successfully");
            onClose();
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">
                <h2 className="text-2xl font-bold mb-5 font-sans">
                    Add Menu Item
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Item Name"
                        value={formData.itemName}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        required
                    />

                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>

                    <div>
                        <label className="block font-medium mb-2 font-sans">
                            Product Image
                        </label>

                        <input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />

                        {imagePreview ? (
                            <div className="flex items-center gap-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-lg border object-cover"
                                />
                                <label
                                    htmlFor="image"
                                    className="px-3 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition"
                                >
                                    Change Image
                                </label>
                            </div>
                        ) : (
                            <label
                                htmlFor="image"
                                className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex flex-col justify-center items-center hover:border-orange-500 hover:bg-orange-50 transition"
                            >
                                <span className="text-xl">📷</span>
                                <span className="text-xs mt-1">Choose Image</span>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;