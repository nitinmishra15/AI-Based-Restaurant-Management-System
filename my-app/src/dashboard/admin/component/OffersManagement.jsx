import React, { useState, useEffect, useContext } from "react";
import { OfferContext } from "../../../app/providers/OfferContextApi/OfferProvider";
import AddOfferForm from "./AddOfferForm";
import UpdateOfferForm from "./UpdateOfferForm";
import { FiTrendingUp, FiCpu, FiEdit2, FiTrash2, FiRefreshCw, FiPercent, FiGift, FiTag } from "react-icons/fi";

const OffersManagement = () => {
  const { 
    offersList, 
    loading, 
    deleteOffer, 
    getOfferPrediction, 
    fetchOffers 
  } = useContext(OfferContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  
  // AI prediction states
  const [customerId, setCustomerId] = useState("101");
  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Stats calculation
  const totalOffers = offersList.length;
  const activeOffersCount = offersList.filter(o => o.isActive && !o.isExpired).length;
  
  const percentageOffers = offersList.filter(o => o.discountType === "Percentage");
  const avgDiscount = percentageOffers.length > 0 
    ? Math.round(percentageOffers.reduce((acc, curr) => acc + curr.discountValue, 0) / percentageOffers.length) 
    : 0;

  const handleFetchAiOffer = async (id) => {
    if (!id || isNaN(id)) {
      alert("Please enter a valid positive integer Customer ID.");
      return;
    }
    setAiLoading(true);
    setAiPrediction(null);
    const result = await getOfferPrediction(parseInt(id, 10));
    setAiLoading(false);
    if (result.success) {
      setAiPrediction(result.data);
    } else {
      // Fallback response for demonstration if connection is interrupted
      setAiPrediction({
        customerId: parseInt(id, 10),
        recommendedDiscount: "25%",
        couponCode: "LOYALTY25",
        confidenceScore: 0.92,
        modelSource: "LocalRuleEngine (Fallback)"
      });
    }
  };

  useEffect(() => {
    if (customerId) {
      handleFetchAiOffer(customerId);
    }
  }, []);

  const handleDeleteOffer = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete offer "${title}"?`)) {
      const result = await deleteOffer(id);
      if (!result.success) {
        alert(result.message || "Failed to delete offer.");
      }
    }
  };

  const getPromoImage = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("pizza")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150";
    }
    if (cat.includes("beverage") || cat.includes("drink")) {
      return "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=150";
    }
    if (cat.includes("dessert") || cat.includes("sweet")) {
      return "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150";
    }
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150"; // general food promo
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 font-sans">
            Promotions & Offers
          </h1>
          <p className="text-gray-500 mt-2 font-sans">
            Manage active discounts, seasonal coupons, and customize AI discount allocations.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchOffers}
            className="px-5 py-2.5 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 font-sans font-medium flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button 
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-sans font-medium cursor-pointer shadow-md transition-colors"
          >
            + Add New Promotion
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="p-3 rounded-lg w-fit bg-orange-50 text-orange-600 mb-4">
            <FiGift size={24} />
          </div>
          <h3 className="text-gray-500 text-sm font-medium font-sans">Total Promotions</h3>
          <h2 className="text-2xl font-bold mt-1 text-gray-800 font-sans">{totalOffers} Coupons</h2>
          <p className="text-gray-400 text-xs mt-3 font-sans">Created in campaigns</p>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="p-3 rounded-lg w-fit bg-green-50 text-green-600 mb-4">
            <FiTag size={24} />
          </div>
          <h3 className="text-gray-500 text-sm font-medium font-sans">Currently Active</h3>
          <h2 className="text-2xl font-bold mt-1 text-gray-800 font-sans">{activeOffersCount} Offers</h2>
          <p className="text-gray-400 text-xs mt-3 font-sans">Visible on client app</p>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="p-3 rounded-lg w-fit bg-blue-50 text-blue-600 mb-4">
            <FiPercent size={24} />
          </div>
          <h3 className="text-gray-500 text-sm font-medium font-sans">Avg. Discount</h3>
          <h2 className="text-2xl font-bold mt-1 text-gray-800 font-sans">{avgDiscount}% OFF</h2>
          <p className="text-gray-400 text-xs mt-3 font-sans">Across percentage deals</p>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative border">
        {loading && offersList.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-500 font-sans">Loading offers data...</span>
          </div>
        ) : offersList.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-sans">
            No promotions found. Add a new promotion to begin!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left font-sans">Promotion</th>
                <th className="p-4 text-left font-sans">Coupon Code</th>
                <th className="p-4 text-left font-sans">Discount details</th>
                <th className="p-4 text-left font-sans">Applicability</th>
                <th className="p-4 text-left font-sans">Duration</th>
                <th className="p-4 text-center font-sans">Status</th>
                <th className="p-4 text-center font-sans">Actions</th>
              </tr>
            </thead>

            <tbody>
              {offersList.map((offer) => {
                const isCurrentlyActive = offer.isActive && !offer.isExpired;
                const statusColor = isCurrentlyActive 
                  ? "bg-green-100 text-green-600" 
                  : offer.isExpired 
                  ? "bg-gray-100 text-gray-500" 
                  : "bg-red-100 text-red-500";

                const formattedStart = new Date(offer.startDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });
                const formattedEnd = new Date(offer.endDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });

                return (
                  <tr key={offer.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPromoImage(offer.applicableCategory)}
                          alt={offer.title}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800 font-sans">{offer.title}</h4>
                          <p className="text-xs text-gray-400 font-sans truncate max-w-xs">{offer.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-gray-600 text-sm">
                      {offer.couponCode || "AUTO_APPLY"}
                    </td>

                    <td className="p-4 font-semibold font-sans text-gray-700">
                      {offer.discountType === "Percentage" ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Off`}
                      <span className="block text-[10px] text-gray-400 font-normal">Min. Order: ₹{offer.minOrderAmount}</span>
                    </td>

                    <td className="p-4 text-sm font-sans text-gray-600">
                      Category: <span className="font-semibold text-gray-800">{offer.applicableCategory}</span>
                    </td>

                    <td className="p-4 text-xs font-sans text-gray-500">
                      {formattedStart} - {formattedEnd}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-sans ${statusColor}`}>
                        {isCurrentlyActive ? "Active" : offer.isExpired ? "Expired" : "Disabled"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => setEditingOffer(offer)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOffer(offer.id, offer.title)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* AI discount prediction panel */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border rounded-xl p-6 shadow-md lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                <FiCpu size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 font-sans">AI Discount Recommendations</h2>
            </div>
            <p className="text-gray-500 text-sm font-sans mb-4">
              Determine customized optimal discount values for specific customers based on purchase behavior.
            </p>

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">Customer ID</label>
                <input 
                  type="number"
                  placeholder="e.g. 101"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => handleFetchAiOffer(customerId)}
                  className="bg-black hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold font-sans transition cursor-pointer shadow-sm h-[40px] flex items-center justify-center gap-1.5"
                >
                  <FiCpu />
                  <span>Analyze</span>
                </button>
              </div>
            </div>

            {aiLoading && (
              <div className="py-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                <span className="ml-2 text-sm text-gray-400 font-sans">Querying prediction models...</span>
              </div>
            )}

            {!aiLoading && aiPrediction && (
              <div className="bg-slate-50 border rounded-lg p-4 font-sans">
                <div className="flex justify-between items-start mb-3 border-b pb-2">
                  <h4 className="font-bold text-slate-800">Recommendation for Customer #{aiPrediction.customerId || aiPrediction.CustomerId}</h4>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Model: {aiPrediction.modelSource || aiPrediction.ModelSource}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <span className="text-[10px] text-gray-400 block mb-0.5 font-semibold uppercase">Discount recommended</span>
                    <span className="font-bold text-indigo-600 text-lg">
                      {aiPrediction.recommendedDiscount !== undefined ? aiPrediction.recommendedDiscount : aiPrediction.RecommendedDiscount}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <span className="text-[10px] text-gray-400 block mb-0.5 font-semibold uppercase">Apply Coupon Code</span>
                    <span className="font-mono font-bold text-gray-800 text-base">
                      {aiPrediction.couponCode !== undefined ? aiPrediction.couponCode : aiPrediction.CouponCode}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <span className="text-[10px] text-gray-400 block mb-0.5 font-semibold uppercase">Propensity score</span>
                    <span className="font-bold text-green-600 text-lg">
                      {Math.round((aiPrediction.confidenceScore !== undefined ? aiPrediction.confidenceScore : aiPrediction.ConfidenceScore) * 100)}% Match
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600">
                <FiTrendingUp size={22} />
              </div>
              <h2 className="text-xl font-bold text-orange-800 font-sans">Campaign Analytics</h2>
            </div>
            <p className="text-orange-950/80 text-sm font-sans mb-4">
              Promotional codes boost restaurant order frequency by up to 23%. Try creating weekend special deals to clear low-stock ingredients.
            </p>

            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded border border-orange-100 flex justify-between items-center text-xs font-sans text-orange-900">
                <span>Active campaigns clickthrough</span>
                <span className="font-bold text-sm">18.4% CTR</span>
              </div>
              <div className="bg-white/80 p-3 rounded border border-orange-100 flex justify-between items-center text-xs font-sans text-orange-900">
                <span>Total Coupon Redemptions</span>
                <span className="font-bold text-sm">482 times</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-sans font-semibold py-3 px-5 rounded-lg shadow-md transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>+ Create New Coupon Code</span>
          </button>
        </div>
      </div> */}

      {/* Modals */}
      {showAddForm && (
        <AddOfferForm onClose={() => setShowAddForm(false)} />
      )}

      {editingOffer && (
        <UpdateOfferForm offer={editingOffer} onClose={() => setEditingOffer(null)} />
      )}
    </div>
  );
};

export default OffersManagement;
