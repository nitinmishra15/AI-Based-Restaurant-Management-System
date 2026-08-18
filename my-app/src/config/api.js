// Centralized API Configuration for AI-Based Restaurant Management System
// Supports dynamic environment variable VITE_API_BASE_URL (for Vercel & Render)
// Defaults to localhost in development if not provided.

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export const API_ENDPOINTS = {
  // Base
  BASE: API_BASE_URL,
  
  // Auth & Profile
  AUTH: `${API_BASE_URL}/api/auth`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  
  // Menu & Categories
  MENU_ITEMS: `${API_BASE_URL}/api/menuitems`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  
  // Orders & Payments
  ORDERS: `${API_BASE_URL}/api/orders`,
  PAYMENTS: `${API_BASE_URL}/api/payments/process`,
  
  // Inventory
  INVENTORY: `${API_BASE_URL}/api/Inventory`,
  INVENTORY_AI: `${API_BASE_URL}/api/inventory`,
  
  // Offers
  OFFERS: `${API_BASE_URL}/api/Offer`,
  OFFERS_AI: `${API_BASE_URL}/api/offers`,
  
  // Staff
  STAFF: `${API_BASE_URL}/api/Staff`,
  
  // AI & Predictions
  RECOMMENDATIONS: `${API_BASE_URL}/api/recommendations`,
  PREDICTION: `${API_BASE_URL}/api/prediction`,
};

/**
 * Resolves static image URLs correctly whether they are remote (Unsplash, etc.)
 * or relative uploaded images (/images/...) served by the backend.
 * 
 * @param {string} rawUrl - The raw image URL or relative path
 * @param {string} fallbackUrl - Default fallback image
 * @returns {string} Fully resolved image URL
 */
export const getImageUrl = (rawUrl, fallbackUrl = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500') => {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return fallbackUrl;
  }

  const trimmed = rawUrl.trim();

  // If already absolute URL (e.g. http://, https://, or data:image)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    // If it points to a local localhost URL, rewrite to current API base URL
    if (trimmed.includes('localhost:')) {
      const match = trimmed.match(/localhost:\d+(\/.*)/);
      if (match && match[1]) {
        return `${API_BASE_URL}${match[1]}`;
      }
    }
    return trimmed;
  }

  // If relative path (/images/filename.jpg or images/filename.jpg)
  const slash = trimmed.startsWith('/') ? '' : '/';
  return `${API_BASE_URL}${slash}${trimmed}`;
};

export default API_ENDPOINTS;
