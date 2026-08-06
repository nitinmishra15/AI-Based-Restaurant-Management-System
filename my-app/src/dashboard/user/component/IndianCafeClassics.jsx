import React, { useContext } from "react";
import { Plus, Utensils } from "lucide-react";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";

export default function IndianCafeClassics({ onAddToOrder }) {
  const { menuList } = useContext(MenuContext);

  // Safely take only the first 2 items from the database
  const displayItems = menuList.slice(0, 2);

  if (displayItems.length < 2) {
    return (
      <section className="w-full py-12 text-center">
        <h2 className="text-lg font-bold text-gray-400 font-sans">
          Loading Classics...
        </h2>
      </section>
    );
  }

  const item1 = displayItems[0];
  const item2 = displayItems[1];

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black text-[#2D2F2F] font-sans">
            Indian Café Classics
          </h2>

          <span className="inline-flex items-center gap-1 bg-[#FFF0ED] text-[#B41B00] text-[10px] font-black tracking-widest px-3.5 py-1.5 rounded-full uppercase border border-[#B41B00]/10 font-sans">
            <Utensils className="w-3.5 h-3.5" />
            CHEF'S SELECTION
          </span>
        </div>

        {/* Both cards have identical dimensions (h-[180px] and w-[calc(50%-12px)]) */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Card 1: Horizontal Card */}
          {item1 && (
            <div
              onClick={() => onAddToOrder(item1)}
              className="bg-white rounded-2xl overflow-hidden flex flex-row shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-[calc(50%-12px)] h-[180px] cursor-pointer"
            >
              <img
                src={item1.imageUrl}
                alt={item1.itemName}
                className="w-[40%] h-full object-cover"
              />
              
              <div className="w-[60%] p-4 flex flex-col justify-between h-full">
                <div>
                  <span className="inline-block bg-orange-100 text-orange-600 text-[9px] font-semibold px-2 py-0.5 rounded-full font-sans">
                    {item1.categoryName}
                  </span>
                  
                  <h3 className="font-bold font-sans text-base mt-2 line-clamp-1 text-gray-800">
                    {item1.itemName}
                  </h3>
                  
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {item1.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="font-bold text-sm font-sans text-gray-900">
                    ₹{item1.price}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToOrder(item1);
                    }}
                    className="w-7 h-7 bg-[#B41B00] text-white rounded-full flex items-center justify-center cursor-pointer transition hover:bg-[#921600]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Horizontal Card (Identical in size and layout to Card 1) */}
          {item2 && (
            <div
              onClick={() => onAddToOrder(item2)}
              className="bg-white rounded-2xl overflow-hidden flex flex-row shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-[calc(50%-12px)] h-[180px] cursor-pointer"
            >
              <img
                src={item2.imageUrl}
                alt={item2.itemName}
                className="w-[40%] h-full object-cover"
              />
              
              <div className="w-[60%] p-4 flex flex-col justify-between h-full">
                <div>
                  <span className="inline-block bg-orange-100 text-orange-600 text-[9px] font-semibold px-2 py-0.5 rounded-full font-sans">
                    {item2.categoryName}
                  </span>
                  
                  <h3 className="font-bold font-sans text-base mt-2 line-clamp-1 text-gray-800">
                    {item2.itemName}
                  </h3>
                  
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {item2.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="font-bold text-sm font-sans text-gray-900">
                    ₹{item2.price}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToOrder(item2);
                    }}
                    className="w-7 h-7 bg-[#B41B00] text-white rounded-full flex items-center justify-center cursor-pointer transition hover:bg-[#921600]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}