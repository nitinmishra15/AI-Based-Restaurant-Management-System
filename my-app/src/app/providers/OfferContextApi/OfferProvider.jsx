import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const [offersList, setOffersList] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://localhost:44367/api/Offer";
  const AI_API_BASE = "https://localhost:44367/api/offers";

  // Normalize API data to camelCase for the frontend
  const normalizeOffer = (offer) => {
    return {
      id: offer.id !== undefined ? offer.id : offer.Id,
      title: offer.title !== undefined ? offer.title : offer.Title,
      description: offer.description !== undefined ? offer.description : offer.Description,
      discountType: offer.discountType !== undefined ? offer.discountType : offer.DiscountType,
      discountValue: offer.discountValue !== undefined ? offer.discountValue : offer.DiscountValue,
      minOrderAmount: offer.minOrderAmount !== undefined ? offer.minOrderAmount : offer.MinOrderAmount,
      startDate: offer.startDate !== undefined ? offer.startDate : offer.StartDate,
      endDate: offer.endDate !== undefined ? offer.endDate : offer.EndDate,
      couponCode: offer.couponCode !== undefined ? offer.couponCode : offer.CouponCode,
      applicableCategory: offer.applicableCategory !== undefined ? offer.applicableCategory : offer.ApplicableCategory,
      isActive: offer.isActive !== undefined ? offer.isActive : offer.IsActive,
      isExpired: offer.isExpired !== undefined ? offer.isExpired : offer.IsExpired,
      isCurrentlyActive: offer.isCurrentlyActive !== undefined ? offer.isCurrentlyActive : offer.IsCurrentlyActive,
      status: offer.status !== undefined ? offer.status : offer.Status,
    };
  };

  // Fetch all offers
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE);
      const normalized = (response.data || []).map(normalizeOffer);
      setOffersList(normalized);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch currently active offers
  const fetchActiveOffers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/active`);
      const normalized = (response.data || []).map(normalizeOffer);
      setActiveOffers(normalized);
      return normalized;
    } catch (err) {
      console.error("Error fetching active offers:", err);
      return [];
    }
  };

  // Add a new offer
  const addOffer = async (offerData) => {
    try {
      // Backend expects: Title, Description, DiscountType, DiscountValue, MinOrderAmount, StartDate, EndDate, CouponCode, ApplicableCategory, IsActive
      const payload = {
        title: offerData.title,
        description: offerData.description || "",
        discountType: offerData.discountType || "Percentage",
        discountValue: parseFloat(offerData.discountValue),
        minOrderAmount: parseFloat(offerData.minOrderAmount) || 0,
        startDate: new Date(offerData.startDate).toISOString(),
        endDate: new Date(offerData.endDate).toISOString(),
        couponCode: offerData.couponCode || null,
        applicableCategory: offerData.applicableCategory || "All",
        isActive: offerData.isActive !== undefined ? offerData.isActive : true,
      };

      const response = await axios.post(API_BASE, payload);
      await fetchOffers();
      await fetchActiveOffers();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error adding offer:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to add offer",
      };
    }
  };

  // Update an existing offer
  const updateOffer = async (id, offerData) => {
    try {
      const payload = {
        title: offerData.title,
        description: offerData.description || "",
        discountType: offerData.discountType || "Percentage",
        discountValue: parseFloat(offerData.discountValue),
        minOrderAmount: parseFloat(offerData.minOrderAmount) || 0,
        startDate: new Date(offerData.startDate).toISOString(),
        endDate: new Date(offerData.endDate).toISOString(),
        couponCode: offerData.couponCode || null,
        applicableCategory: offerData.applicableCategory || "All",
        isActive: offerData.isActive !== undefined ? offerData.isActive : true,
      };

      const response = await axios.put(`${API_BASE}/${id}`, payload);
      await fetchOffers();
      await fetchActiveOffers();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating offer:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to update offer",
      };
    }
  };

  // Delete an offer
  const deleteOffer = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchOffers();
      await fetchActiveOffers();
      return { success: true };
    } catch (err) {
      console.error("Error deleting offer:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data || err.message || "Failed to delete offer",
      };
    }
  };

  // Get AI discount prediction for a customer
  const getOfferPrediction = async (customerId) => {
    try {
      const response = await axios.get(`${AI_API_BASE}/predict/${customerId}`);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error fetching AI prediction for customer ${customerId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to fetch prediction",
      };
    }
  };

  // Initial load
  useEffect(() => {
    fetchOffers();
    fetchActiveOffers();
  }, []);

  return (
    <OfferContext.Provider
      value={{
        offersList,
        activeOffers,
        loading,
        error,
        fetchOffers,
        fetchActiveOffers,
        addOffer,
        updateOffer,
        deleteOffer,
        getOfferPrediction,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};
