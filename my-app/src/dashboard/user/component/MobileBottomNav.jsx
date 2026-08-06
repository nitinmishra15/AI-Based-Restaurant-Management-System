import React from 'react';
import { Compass, ShoppingBag, Sparkles, User } from 'lucide-react';
import { useCart } from '../../../shared/hooks/useCart';
export default function MobileBottomNav({ 
  activeSection, 
  setActiveSection, 
  onCartClick, 
  onAIClick, 
  onProfileClick
}) {
  const { cartItemsCount } = useCart();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/85 border-t border-gray-100 py-2.5 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* Discover tab */}
        <button
          onClick={() => setActiveSection('discover')}
          className={`flex flex-col items-center gap-1 transition-colors duration-300 relative ${
            activeSection === 'discover' ? 'text-[#B41B00]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Compass className="w-5.5 h-5.5" />
          <span className="text-[9px] font-black tracking-wider uppercase">Discover</span>
        </button>
        {/* Orders/Cart tab */}
        <button
          onClick={onCartClick}
          className={`flex flex-col items-center gap-1 transition-colors duration-300 relative ${
            activeSection === 'orders' ? 'text-[#B41B00]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5.5 h-5.5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#B41B00] text-[8px] font-black text-white ring-2 ring-white">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-black tracking-wider uppercase">Orders</span>
        </button>
        {/* Profile tab */}
        <button
          onClick={onProfileClick}
          className={`flex flex-col items-center gap-1 transition-colors duration-300 relative ${
            activeSection === 'profile' ? 'text-[#B41B00]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-5.5 h-5.5" />
          <span className="text-[9px] font-black tracking-wider uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}