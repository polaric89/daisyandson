/**
 * API Configuration Utility
 * 
 * Centralizes API endpoint configuration for easy environment switching
 */

// Get API base URL from environment variable or use relative path
const getApiUrl = () => {
  // In production, use environment variable or default to relative path
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In development, Vite proxy handles /api requests
  // In production, use relative path (same domain) or absolute URL
  return ''
}

/**
 * Make an API request with proper base URL
 * 
 * @param {string} endpoint - API endpoint (e.g., '/api/referrer/login')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getApiUrl()
  const url = `${baseUrl}${endpoint}`
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

/**
 * Get the full API URL for an endpoint
 * Useful for direct fetch calls
 * 
 * @param {string} endpoint - API endpoint (e.g., '/api/referrer/login')
 * @returns {string} - Full API URL
 */
export const getApiEndpoint = (endpoint) => {
  const baseUrl = getApiUrl()
  return `${baseUrl}${endpoint}`
}

export default {
  getApiUrl,
  apiRequest,
  getApiEndpoint,
}

