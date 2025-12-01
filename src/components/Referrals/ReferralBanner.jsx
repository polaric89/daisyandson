import { useState, useCallback } from 'react'
import { useReferral } from './useReferral'

/**
 * ReferralBanner Component
 * 
 * Displays a banner for users to share their referral link
 * and earn commissions.
 */
function ReferralBanner() {
  const { 
    userReferralId, 
    generateReferralLink, 
    copyReferralLink,
    stats 
  } = useReferral()
  
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = useCallback(async () => {
    const success = await copyReferralLink()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [copyReferralLink])

  const referralLink = generateReferralLink()

  return (
    <div className="max-w-7xl mx-auto mb-6">
      {/* Collapsed Banner */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-card px-4 py-3 flex items-center justify-between hover:bg-white/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-secondary/20 to-badge-primary/20 flex items-center justify-center">
            <span className="text-xl">🎁</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-badge-primary">Share & Earn</p>
            <p className="text-xs text-badge-primary/50">Get 15% commission on every referral</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {stats.conversions > 0 && (
            <div className="hidden sm:block text-right">
              <p className="text-badge-secondary font-bold">AED {stats.earnings.toFixed(2)}</p>
              <p className="text-xs text-badge-primary/50">{stats.conversions} sales</p>
            </div>
          )}
          
          <svg 
            className={`w-5 h-5 text-badge-primary/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="glass-card mt-1 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Referral Link */}
            <div>
              <h3 className="font-display text-lg font-semibold text-badge-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-badge-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Your Referral Link
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink || 'Loading...'}
                  readOnly
                  className="input-field flex-1 text-sm font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`btn-primary px-4 py-2 ${copied ? 'bg-green-500' : ''}`}
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-badge-primary/50 mt-2">
                Your unique ID: <span className="font-mono text-badge-secondary">{userReferralId}</span>
              </p>
            </div>

            {/* Right: How it works */}
            <div>
              <h3 className="font-display text-lg font-semibold text-badge-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-badge-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How It Works
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-badge-primary/20 flex items-center justify-center text-xs text-badge-primary font-bold flex-shrink-0">1</span>
                  <p className="text-badge-primary/70">Share your unique link with friends</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-badge-primary/20 flex items-center justify-center text-xs text-badge-primary font-bold flex-shrink-0">2</span>
                  <p className="text-badge-primary/70">They design and order their badges</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-badge-secondary/20 flex items-center justify-center text-xs text-badge-secondary font-bold flex-shrink-0">3</span>
                  <p className="text-badge-primary/70">You earn <span className="text-badge-secondary font-semibold">15% commission</span> on each sale!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-badge-primary/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-badge-primary">{stats.clicks || 0}</p>
              <p className="text-xs text-badge-primary/50">Link Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-badge-primary">{stats.conversions || 0}</p>
              <p className="text-xs text-badge-primary/50">Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-badge-secondary">AED {(stats.earnings || 0).toFixed(2)}</p>
              <p className="text-xs text-badge-primary/50">Total Earnings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferralBanner
