import { createContext, useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * Referral Context
 * 
 * Provides referral tracking functionality throughout the app.
 * Tracks referral links, clicks, and commissions.
 */
export const ReferralContext = createContext(null)

// Local storage keys
const STORAGE_KEYS = {
  REFERRER_ID: 'badge_referrer_id',
  USER_REFERRAL_ID: 'badge_user_referral_id',
  REFERRAL_CLICKS: 'badge_referral_clicks'
}

/**
 * Referral Provider Component
 * 
 * Wraps the app and provides referral state management.
 */
export function ReferralProvider({ children }) {
  // Current user's referral ID (for sharing)
  const [userReferralId, setUserReferralId] = useState(null)
  
  // Referrer ID (who referred this user)
  const [referrerId, setReferrerId] = useState(null)
  
  // Referral statistics
  const [stats, setStats] = useState({
    clicks: 0,
    conversions: 0,
    earnings: 0
  })

  // Initialize referral tracking on mount
  useEffect(() => {
    initializeReferral()
  }, [])

  // Initialize or retrieve referral data
  const initializeReferral = useCallback(() => {
    // Check URL for referral parameter
    const urlParams = new URLSearchParams(window.location.search)
    const refParam = urlParams.get('ref')

    if (refParam) {
      // Store the referrer ID
      localStorage.setItem(STORAGE_KEYS.REFERRER_ID, refParam)
      setReferrerId(refParam)
      
      // Track the click (would send to backend in production)
      trackReferralClick(refParam)
      
      // Clean up URL (optional)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    } else {
      // Check if we have a stored referrer
      const storedReferrer = localStorage.getItem(STORAGE_KEYS.REFERRER_ID)
      if (storedReferrer) {
        setReferrerId(storedReferrer)
      }
    }

    // Get or create user's own referral ID
    let userId = localStorage.getItem(STORAGE_KEYS.USER_REFERRAL_ID)
    if (!userId) {
      userId = generateReferralId()
      localStorage.setItem(STORAGE_KEYS.USER_REFERRAL_ID, userId)
    }
    setUserReferralId(userId)

    // Load stats
    loadReferralStats()
  }, [])

  // Generate a unique referral ID
  const generateReferralId = () => {
    const uuid = uuidv4()
    // Create a shorter, more readable ID
    return `REF-${uuid.substring(0, 8).toUpperCase()}`
  }

  // Track referral click
  const trackReferralClick = async (refId) => {
    try {
      // In production, this would call the backend
      await fetch('/api/track-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: refId,
          timestamp: new Date().toISOString(),
          source: document.referrer || 'direct'
        })
      }).catch(() => {
        // Silently fail if backend not available
        console.log('Referral click tracked locally')
      })
    } catch (error) {
      console.log('Referral tracking (local mode)')
    }
  }

  // Load referral statistics
  const loadReferralStats = useCallback(() => {
    // In production, this would fetch from backend
    // For now, use local storage mock
    const storedStats = localStorage.getItem('badge_referral_stats')
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats))
      } catch (e) {
        console.error('Failed to parse referral stats')
      }
    }
  }, [])

  // Generate referral link
  const generateReferralLink = useCallback(() => {
    if (!userReferralId) return null
    
    const baseUrl = window.location.origin
    return `${baseUrl}?ref=${userReferralId}`
  }, [userReferralId])

  // Copy referral link to clipboard
  const copyReferralLink = useCallback(async () => {
    const link = generateReferralLink()
    if (!link) return false

    try {
      await navigator.clipboard.writeText(link)
      return true
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  }, [generateReferralLink])

  // Record a conversion (when referred user makes a purchase)
  const recordConversion = useCallback(async (orderDetails) => {
    if (!referrerId) return

    try {
      await fetch('/api/record-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId,
          orderDetails,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {
        console.log('Conversion recorded locally')
      })
    } catch (error) {
      console.log('Conversion tracking (local mode)')
    }
  }, [referrerId])

  // Clear referral data (for testing/debugging)
  const clearReferralData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.REFERRER_ID)
    localStorage.removeItem(STORAGE_KEYS.USER_REFERRAL_ID)
    localStorage.removeItem('badge_referral_stats')
    setReferrerId(null)
    setUserReferralId(generateReferralId())
    setStats({ clicks: 0, conversions: 0, earnings: 0 })
  }, [])

  const value = {
    // State
    userReferralId,
    referrerId,
    hasReferral: !!referrerId,
    stats,
    
    // Actions
    generateReferralLink,
    copyReferralLink,
    recordConversion,
    clearReferralData,
    loadReferralStats
  }

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  )
}

export default ReferralContext

