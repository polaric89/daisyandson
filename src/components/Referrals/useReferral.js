import { useContext } from 'react'
import { ReferralContext } from './ReferralContext'

/**
 * useReferral Hook
 * 
 * Custom hook to access referral context and functionality.
 * 
 * Usage:
 * ```jsx
 * const { 
 *   userReferralId, 
 *   hasReferral, 
 *   generateReferralLink,
 *   copyReferralLink 
 * } = useReferral()
 * ```
 */
export function useReferral() {
  const context = useContext(ReferralContext)
  
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider')
  }
  
  return context
}

export default useReferral

