import React from 'react';
import { Plus } from 'lucide-react';

export default function ProductCard({ product, onAdd }) {
  const { name, rating, description, price, image } = product;

  return (
    <div 
      onClick={() => onAdd(product)}
      className="group bg-white rounded-[32px] overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] hover:shadow-xl cursor-pointer transition-all duration-500"
    >
      
      {/* Product Image */}
      <div className="h-[180px] w-full overflow-hidden relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Product Content */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Header (Title & Rating) */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-black text-[#2D2F2F] tracking-tight">
              {name}
            </h3>
            <div className="flex items-center gap-0.5 text-[#B41B00]">
              <span className="text-xs font-black">★</span>
              <span className="text-xs font-black text-[#2D2F2F]">{rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-3 mb-6">
            {description}
          </p>
        </div>

        {/* Footer (Price & Add Button) */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-black text-[#2D2F2F]">
            ₹{price}
          </span>
          <button 
            className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#2D2F2F] group-hover:bg-[#B41B00] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
          >
            <Plus className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" />
          </button>
        </div>

      </div>

    </div>
  );
}
