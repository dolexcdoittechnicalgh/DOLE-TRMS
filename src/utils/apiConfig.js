/**
 * Centralized API Configuration
 * Use this utility to get the API base URL consistently across the app
 * Supports environment variables for easy deployment configuration
 */

// Dynamically set Laravel API base URL — works in localhost, LAN, and production
// Priority: Environment variable > Auto-detect > Default production URL
const hostname = window.location.hostname;

export const getApiBaseUrl = () => {
  // Check for environment variable first (for Vercel, Netlify, etc.)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Auto-detect based on hostname
  if (
    hostname === "localhost" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  ) {
    return `http://${hostname}:8000/api`; // Development or LAN
  }

  // Production fallback
  return `https://api.dolexcdo.online/api`;
};

// Export the computed URL for direct use
export const API_BASE_URL = getApiBaseUrl();
