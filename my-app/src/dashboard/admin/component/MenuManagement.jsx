import React, { useContext, useState } from "react";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";

import CategoryTabs from "./CategoryTabs";
import MenuCard from "./MenuCard";
import AddProductForm from "./AddProductForm";

const MenuManagement = () => {

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showForm, setShowForm] = useState(false);

    const {
        menuList,
        loading
    } = useContext(MenuContext);

    const filteredMenu =
        selectedCategory === "All"
            ? menuList
            : menuList.filter(
                  item => item.categoryName === selectedCategory
              );

    if (loading) {
        return <h2>Loading menu...</h2>;
    }

    return (

        <div className="p-6">

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Menu Management
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600  cursor-pointer"
                >
                    + Add Item
                </button>

            </div>

            <CategoryTabs
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredMenu.map(item => (

                    <MenuCard
                        key={item.id}
                        item={item}
                    />

                ))}

            </div>

            {showForm && (

                <AddProductForm
                    onClose={() => setShowForm(false)}
                />

            )}

        </div>

    );
};

export default MenuManagement;