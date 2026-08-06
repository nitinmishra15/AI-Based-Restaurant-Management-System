import React, { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../component/Header";
import CategoryBar from "../component/CategoryBar";
import FoodCard from "../component/FoodCard";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";

function Menu() {
  const { menuList, categories, loading } = useContext(MenuContext);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get("category") || "All";
  });

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    setSelectedCategory(cat);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-bold text-orange-600 animate-pulse">Loading Menu...</div>
      </div>
    );
  }

  // Filter menu items by search query
  const filteredMenuList = menuList.filter(item => {
    const name = (item.itemName || item.name || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || desc.includes(query);
  });

  // Group menuList by categoryName dynamically
  const categoriesMap = filteredMenuList.reduce((acc, item) => {
    const catName = item.categoryName || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-[#fff8f6] min-h-screen">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <CategoryBar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        categories={categories} 
      />

      <main className="pt-32 max-w-[1600px] mx-auto px-6 pb-20">
        {Object.keys(categoriesMap).length > 0 ? (
          Object.keys(categoriesMap).map((catName) => {
            // Filter categories based on selection
            if (selectedCategory !== "All" && selectedCategory !== catName) {
              return null;
            }

            return (
              <section key={catName} className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-black uppercase text-[#2c1713] tracking-tight">
                    {catName}
                  </h2>
                  <p className="text-sm font-bold text-gray-400">
                    {categoriesMap[catName].length} items
                  </p>
                </div>

                {/* Box card size suitable for the screen (Responsive Grid layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoriesMap[catName].map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-150">
            <span className="text-5xl">🍽️</span>
            <h2 className="text-xl font-bold text-gray-800 mt-4">Menu is Empty</h2>
            <p className="text-gray-500 mt-2">No menu items found in the database. Please add items in the Admin panel!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Menu;