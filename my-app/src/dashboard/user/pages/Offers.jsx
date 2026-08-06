import React, { useContext } from "react";
import OfferCard from "../component/OfferCard";
import PlatinumClub from "../component/PlatinumClub";
import offersData from "../component/data/offersData";
import { OfferContext } from "../../../app/providers/OfferContextApi/OfferProvider";

function Offers() {
  const { activeOffers, loading } = useContext(OfferContext);

  const getPromoImage = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("pizza")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500";
    }
    if (cat.includes("beverage") || cat.includes("drink")) {
      return "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500";
    }
    if (cat.includes("dessert") || cat.includes("sweet")) {
      return "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500";
    }
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500";
  };

  // Convert backend offer structure to frontend OfferCard structure
  const displayOffers = activeOffers.length > 0 
    ? activeOffers.map((offer) => ({
        id: offer.id,
        badge: offer.couponCode ? offer.couponCode.toUpperCase() : "PROMO",
        badgeColor: offer.discountType === "Percentage" ? "#d9371b" : "#007f9b",
        title: offer.title,
        description: offer.description || (offer.discountType === "Percentage" 
          ? `Get ${offer.discountValue}% off on orders above ₹${offer.minOrderAmount}` 
          : `Get ₹${offer.discountValue} off on orders above ₹${offer.minOrderAmount}`),
        image: getPromoImage(offer.applicableCategory),
      }))
    : offersData; // fallback to mock data if backend has no active offers

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#b51c01] font-sans">
            Exclusive Promotions
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-sans">
            Indulge in premium culinary experiences with our curated offers.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && activeOffers.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#b51c01]"></div>
            <span className="ml-3 text-gray-500 font-sans">Fetching active promotions...</span>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}

        {/* Platinum Club */}
        <PlatinumClub />
      </main>
    </div>
  );
}

export default Offers;