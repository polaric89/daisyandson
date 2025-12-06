/**
 * Short URL Utility
 * Creates short referral links using our own backend redirect endpoint
 * This avoids social media ad flags and provides instant redirects
 */

/**
 * Get or create a shortened referral link
 * Uses our own /api/r/{code} endpoint for direct redirects
 * @param {string} referralCode - The referral code
 * @returns {Promise<string>} - The shortened referral URL
 */
export async function getShortenedReferralLink(referralCode) {
  // Use our own short URL format: /api/r/{code}
  // This redirects directly without any interstitial pages
  // The backend will validate the code and redirect to /?ref={code}
  const shortUrl = `${window.location.origin}/api/r/${referralCode}`
  
  // No need to cache since it's just a simple URL format
  return shortUrl
}

