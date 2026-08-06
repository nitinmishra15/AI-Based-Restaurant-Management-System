import React, { useContext, useState } from "react";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";

const UpdateProductForm = ({ item, onClose }) => {
    const { updateMenuItem, categories } = useContext(MenuContext);
    const [imagePreview, setImagePreview] = useState(item?.imageUrl || null);

    const [formData, setFormData] = useState({
        itemName: item?.itemName || "",
        description: item?.description || "",
        price: item?.price || "",
        categoryId: item?.categoryId || "",
        image: null,
        status: item?.status ?? true
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

    const handleStatusChange = (e) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.value === "true"
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build multipart/form-data payload
        const data = new FormData();
        data.append("itemName", formData.itemName);
        data.append("description", formData.description || "");
        data.append("price", formData.price);
        data.append("categoryId", formData.categoryId);
        data.append("status", formData.status);
        
        // Append image only if a new file has been chosen
        if (formData.image) {
            data.append("image", formData.image); // Matches parameter inside C# MenuUpdateDto
        }

        const response = await updateMenuItem(item.id, data);

        if (response.success) {
            alert("Item Updated Successfully");
            onClose();
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">
                <h2 className="text-2xl font-bold mb-5 font-sans">
                    Update Menu Item
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

                    <select
                        name="status"
                        value={formData.status.toString()}
                        onChange={handleStatusChange}
                        className="w-full border rounded-lg p-2"
                        required
                    >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                    </select>

                    <div>
                        <label className="block font-medium mb-2 font-sans">
                            Product Image
                        </label>

                        <input
                            id="image-update"
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
                                    htmlFor="image-update"
                                    className="px-3 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition"
                                >
                                    Change Image
                                </label>
                            </div>
                        ) : (
                            <label
                                htmlFor="image-update"
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

export default UpdateProductForm;