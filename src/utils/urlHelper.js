// src/utils/urlHelper.js

// Grab the domain defined in your .env file
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || 'http://localhost:5173';

/**
 * Combines a page path with your base domain into a valid absolute URL.
 * @param {string} path - e.g., "/about", "products/123", or location.pathname
 * @returns {string} - e.g., "https://mybrand.com/about"
 */
export function getAbsoluteUrl(path = '') {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Cleanly join domain and path using the native URL constructor
  return new URL(formattedPath, BASE_DOMAIN).href;
}