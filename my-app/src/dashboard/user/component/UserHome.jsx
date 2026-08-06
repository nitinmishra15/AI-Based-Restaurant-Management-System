import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import MobileBottomNav from './MobileBottomNav';
import FeaturedOffers from './FeaturedOffers';
import CategorySection from './CategorySection';
import IndianCafeClassics from './IndianCafeClassics';
import ProductGrid from './ProductGrid';
import TodayDesiDelights from './TodayDesiDelights';
import FloatingAIButton from './FloatingAIButton';
import CartDrawer from './CartDrawer';
import AIAssistantModal from './AIAssistantModal';
import { useCart } from '../../../shared/hooks/useCart';
import UserNavbar from './UserNavbar';
import { useSearchParams } from 'react-router-dom';
import { useTable } from '../../../app/providers/TableContextApi/TableProvider';
import { useAuth } from '../../../app/providers/AuthContextApi/AuthProvider';

export default function UserHome() {
  const { user } = useAuth();
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState('discover');

  // Interactive Drawer States
  const [aiOpen, setAiOpen] = useState(false);

  // Consume global cart Context API
  const { addToCart, cartOpen, setCartOpen } = useCart();

  // Helper to add item to order and automatically open the drawer for user feedback
  const handleAddToOrder = (item) => {
    addToCart(item);
    setCartOpen(true);
  };

  const handleProfileClick = () => {
    if (user) {
      alert(`👤 Customer Profile:\n- Name: ${user.username || user.Username}\n- Email: ${user.email || user.Email || "N/A"}\n- Role: Customer`);
    } else {
      alert("👤 Profile Summary:\n- Status: Guest (Not logged in)\n- Please add items to the cart and checkout to log in!");
    }
  };

  const handleNotificationClick = () => {
    alert("🔔 Notifications:\n- Your last order has been served!\n- Happy Hour ends in 45 minutes!");
  };

  const handleClaimOffer = (offer) => {
    alert(`🎉 Offer Applied: "${offer.title}"! We've added this to your session discounts.`);
  };

  const [searchParams] = useSearchParams();
  const { setTableId, tableId } = useTable();

  useEffect(() => {
    // Read tableId from URL query parameter (e.g., /user?tableId=5)
    const tableIdFromUrl = searchParams.get("tableId");
    console.log(tableIdFromUrl);
    if (tableIdFromUrl) {
      setTableId(tableIdFromUrl); // Updates Context and sessionStorage
      console.log("Table session started for Table ID:", tableIdFromUrl);
    }
  }, [searchParams, setTableId]);

  return (

      <div>
     
      {/* ... rest of page */}
      <div className="min-h-screen bg-[#F6F6F6] text-[#2D2F2F] flex flex-col font-['Outfit',sans-serif] select-none antialiased">
      
      {/* Navbar Header (Rendered in UserLayout) */}
    

      {/* Main Layout Container */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full pb-24 md:pb-12">
        {activeSection === 'discover' ? (
          <>
            {/* Hero Header & Welcome banner */}
            <HeroSection userName={user ? (user.username || user.Username) : "Guest"} loyaltyPoints={user ? 2450 : 0} />

            {/* Featured Swiper Promo Carousels */}
            <FeaturedOffers />

            {/* Categories filter layout */}
            <CategorySection 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />

            {/* Chef Selection - Cafe Classics */}
            <IndianCafeClassics onAddToOrder={handleAddToOrder} />

           

            {/* Today's Special Highlights */}
            <TodayDesiDelights onAddToOrder={handleAddToOrder} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-2xl font-black uppercase text-[#B41B00] mb-2">{activeSection} Page</h2>
            <p className="text-sm font-semibold text-gray-500 max-w-md leading-relaxed">
              This route is set up and fully prepared for .NET Web API integration. Use the 'Discover' tab to view and test the complete restaurant experience dashboard!
            </p>
            <button 
              onClick={() => setActiveSection('discover')}
              className="mt-6 px-6 py-3 bg-[#B41B00] text-white font-bold rounded-full text-xs hover:bg-[#FF775D] transition-colors duration-300"
            >
              Back to Discover
            </button>
          </div>
        )}
      </main>

      {/* Sliding Dialog overlays (Rendered in UserLayout) */}

      <AIAssistantModal 
        isOpen={aiOpen} 
        onClose={() => setAiOpen(false)}
        onAddToOrder={handleAddToOrder}
      />

      {/* Bottom Floating AI tool bubble */}
      <FloatingAIButton onClick={() => setAiOpen(true)} />

      {/* Mobile-only Bottom Tab controls */}
      <MobileBottomNav 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onCartClick={() => setCartOpen(true)}
        onAIClick={() => setAiOpen(true)}
        onProfileClick={handleProfileClick}
      />

    </div>
    </div>
    
  );
}
