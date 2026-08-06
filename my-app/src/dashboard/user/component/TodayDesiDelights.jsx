import React from 'react';
import { Plus } from 'lucide-react';
import '../../../../public/TodayDesiDelights.css';
export default function TodayDesiDelights({ onAddToOrder }) {
  const items = [
    {
      id: 'masala-cutting-chai',
      tag: 'SPECIALITY TEA',
      name: 'Masala Cutting Chai',
      description: 'Our signature ginger and cardamom infused milk tea, brewed over four hours.',
      price: 80,
    },
    {
      id: 'gulab-jamun-cheesecake',
      tag: 'SWEET ENDING',
      name: 'Gulab Jamun Cheesecake',
      description: 'Fusion perfection: creamy cheesecake with embedded syrup-soaked milk dumplings.',
      price: 220,
    },
    {
      id: 'pani-puri-shots',
      tag: 'STREET SOUL',
      name: 'Pani Puri Shots',
      description: 'Crispy hollow shells served with five distinct flavors of spiced botanical water.',
      price: 160,
    },
  ];

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-6 mb-16 md:mb-8">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header with Title and Divider Line */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-black text-[#2D2F2F] whitespace-nowrap">
            Today's Desi Delights
          </h2>
          <div className="h-[1px] bg-gray-200 w-full" />
        </div>

        {/* Delights Flex List */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-none md:flex md:flex-wrap md:overflow-x-visible md:pb-0 md:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onAddToOrder({
                ...item,
                image: item.id === 'masala-cutting-chai'
                  ? 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300'
                  : item.id === 'gulab-jamun-cheesecake'
                  ? 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=300'
                  : 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=300'
              })}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0 md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] flex-shrink-0 snap-start bg-[#F9F9F9] rounded-[24px] border-l-[4px] border-l-[#B41B00] p-6 flex flex-col justify-between cursor-pointer hover:-translate-y-[5px] hover:shadow-xl hover:bg-white transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.02)]"
            >
              
              <div>
                {/* Tag */}
                <span className="text-[10px] font-extrabold text-[#B41B00] tracking-widest uppercase mb-2 block">
                  {item.tag}
                </span>

                {/* Name */}
                <h3 className="text-base font-black text-[#2D2F2F] tracking-tight mb-2 group-hover:text-[#B41B00] transition-colors">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Price and Add Button */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-black text-[#2D2F2F]">
                  ₹{item.price}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#E5E7EB] hover:bg-[#B41B00] hover:text-white text-[#2D2F2F] flex items-center justify-center transition-all duration-300">
                  <Plus className="w-4 h-4" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
      
      
    </section>
  );
}
