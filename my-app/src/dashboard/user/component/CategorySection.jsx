import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../../../app/providers/TableContextApi/TableProvider";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";
import {
  Pizza,
  GlassWater,
  Sandwich,
  Utensils
} from "lucide-react";

export default function CategorySection() {
  const navigate = useNavigate();
  const { tableId } = useTable();
  const { categories } = useContext(MenuContext);

  const getCategoryIcon = (categoryName) => {
    switch(categoryName.toLowerCase()) {
      case "pizza":
        return Pizza;
      case "cold drink":
        return GlassWater;
      case "burger":
      case "burgers":
        return Sandwich;
      default:
        return Utensils;
    }
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black text-[#2D2F2F]">
            Browse Categories
          </h2>

          <button
            onClick={() => navigate(`/user/menu?tableId=${tableId || 1}`)}
            className="text-xs font-extrabold tracking-widest text-[#B41B00] hover:text-[#FF775D] transition-colors duration-300 uppercase"
          >
            VIEW ALL
          </button>
        </div>

        {/* Category Flex List */}
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.categoryName);

            return (
              <div
                key={cat.id || cat.categoryId}
                onClick={() => navigate(`/user/menu?tableId=${tableId || 1}&category=${cat.categoryName}`)}
                className="group flex flex-col items-center justify-center p-6 rounded-[32px] cursor-pointer bg-white text-[#2D2F2F] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.03] transition-all duration-300 w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[20%] flex-shrink-0"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-[#F6F6F6] text-[#2D2F2F] group-hover:bg-[#B41B00] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"/>
                </div>

                {/* Category Name */}
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-center text-gray-500 group-hover:text-[#2D2F2F]">
                  {cat.categoryName}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}