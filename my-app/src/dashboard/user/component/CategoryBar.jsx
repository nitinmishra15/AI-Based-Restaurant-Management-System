import React from "react";

function CategoryBar({ selectedCategory, setSelectedCategory, categories = [] }) {
  const list = ["All", ...categories.map(c => c.categoryName)];

  return (
    <div
      className="
        fixed
        top-16
        left-0
        right-0
        bg-white/95
        backdrop-blur-sm
        border-b
        border-gray-100
        shadow-sm
        z-40"
    >
      <div className="max-w-[1440px] mx-auto flex gap-3 overflow-x-auto px-4 md:px-6 lg:px-8 py-3 scrollbar-none">

        {list.map((cat, index) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={
                isSelected
                  ? "px-5 py-2 rounded-full bg-[#2c1713] text-white text-xs font-bold whitespace-nowrap transition-all duration-200"
                  : "px-5 py-2 rounded-full bg-red-50 text-gray-600 text-xs font-semibold whitespace-nowrap hover:bg-red-100 transition-all duration-200"
              }
            >
              {cat}
            </button>
          );
        })}

      </div>
    </div>
  );
}

export default CategoryBar;