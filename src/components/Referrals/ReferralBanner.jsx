import { useState, useCallback, useEffect } from 'react'
import { getShortenedReferralLink } from '../../utils/tinyurl'

/**
 * ReferralBanner Component
 * 
 * Displays a banner for registered referrers to share their link,
 * or a CTA to become a referrer.
 */
function ReferralBanner({ onBecomeReferrer, onLearnMore }) {
  const [referrer, setReferrer] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [stats, setStats] = useState({ clicks: 0, conversions: 0, earnings: 0 })
  const [referralLink, setReferralLink] = useState(null)
  const [loadingLink, setLoadingLink] = useState(false)

  // Check if user is a registered referrer
  useEffect(() => {
    const storedReferrer = localStorage.getItem('referrer_data')
    if (storedReferrer) {
      try {
        const data = JSON.parse(storedReferrer)
        setReferrer(data)
        // Fetch stats
        fetchStats(data.id)
        // Get shortened referral link
        if (data.referralCode) {
          setLoadingLink(true)
          getShortenedReferralLink(data.referralCode)
            .then(shortLink => {
              setReferralLink(shortLink)
              setLoadingLink(false)
            })
            .catch(err => {
              console.error('Failed to shorten link:', err)
              // Fallback to long link
              setReferralLink(`${window.location.origin}?ref=${data.referralCode}`)
              setLoadingLink(false)
            })
        }
      } catch (e) {
        console.error('Invalid referrer data:', e)
      }
    }
  }, [])

  const fetchStats = async (referrerId) => {
    try {
      const response = await fetch(`/api/referrer/${referrerId}/dashboard`)
      if (response.ok) {
        const data = await response.json()
        setStats({
          clicks: data.stats.totalClicks || 0,
          conversions: data.stats.totalConversions || 0,
          earnings: data.stats.pendingEarnings || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch referrer stats:', error)
    }
  }

  const handleCopy = useCallback(async () => {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [referralLink])

  // If not a registered referrer, show CTA
  if (!referrer) {
    return (
      <div className="max-w-7xl mx-auto mb-6">
        <div className="w-full glass-card px-4 py-3 flex items-center justify-between hover:bg-white/90 transition-colors group">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-secondary/20 to-badge-primary/20 flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-badge-primary">Partner With Us</p>
              <p className="text-xs text-badge-primary/50">Refer friends & clients, earn commission on orders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onLearnMore ? (
              <button
                onClick={onLearnMore}
                className="text-badge-secondary font-medium text-sm hover:underline"
              >
                Learn More →
              </button>
            ) : (
              <button
                onClick={onBecomeReferrer}
                className="text-badge-secondary font-medium text-sm hover:underline"
              >
                Learn More →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Registered referrer - show full banner
  return (
    <div className="max-w-7xl mx-auto mb-6">
      {/* Collapsed Banner */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-card px-4 py-3 flex items-center justify-between hover:bg-white/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-badge-secondary/20 flex items-center justify-center">
            <span className="text-xl">✓</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-badge-primary">Welcome, {referrer.name}!</p>
            <p className="text-xs text-badge-primary/50">Share your link to earn 10% commission</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {stats.earnings > 0 && (
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
                  value={loadingLink ? 'Shortening link...' : (referralLink || 'Loading...')}
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
                Your code: <span className="font-mono text-badge-secondary">{referrer.referralCode}</span>
              </p>
            </div>

            {/* Right: Quick Stats */}
            <div>
              <h3 className="font-display text-lg font-semibold text-badge-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-badge-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Your Stats
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-badge-primary/5 rounded-xl">
                  <p className="text-xl font-bold text-badge-primary">{stats.clicks}</p>
                  <p className="text-xs text-badge-primary/50">Clicks</p>
                </div>
                <div className="text-center p-3 bg-badge-primary/5 rounded-xl">
                  <p className="text-xl font-bold text-badge-primary">{stats.conversions}</p>
                  <p className="text-xs text-badge-primary/50">Sales</p>
                </div>
                <div className="text-center p-3 bg-badge-secondary/10 rounded-xl">
                  <p className="text-xl font-bold text-badge-secondary">{stats.earnings.toFixed(0)}</p>
                  <p className="text-xs text-badge-primary/50">AED Earned</p>
                </div>
              </div>

              <button
                onClick={onBecomeReferrer}
                className="mt-4 w-full text-sm text-badge-primary/60 hover:text-badge-primary transition-colors"
              >
                View Full Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferralBanner
