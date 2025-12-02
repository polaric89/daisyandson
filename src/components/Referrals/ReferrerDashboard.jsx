import { useState, useEffect, useCallback } from 'react'

/**
 * Referrer Dashboard Page
 * Shows stats, earnings, and payout management
 */
function ReferrerDashboard({ referrer, onLogout, onBack }) {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('paypal')
  const [payoutDetails, setPayoutDetails] = useState({ paypalEmail: '', bankName: '', iban: '' })
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/referrer/${referrer.id}/dashboard`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load dashboard')
      }
      
      setDashboard(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [referrer.id])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const referralLink = `${window.location.origin}?ref=${referrer.referralCode}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRequestPayout = async (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    const amount = parseFloat(payoutAmount)
    if (isNaN(amount) || amount < 50) {
      alert('Minimum payout is 50 AED')
      return
    }

    if (amount > dashboard.stats.pendingEarnings) {
      alert(`Maximum available: ${dashboard.stats.pendingEarnings.toFixed(2)} AED`)
      return
    }

    // Validate payment details - trim whitespace
    const trimmedBankName = payoutDetails.bankName?.trim()
    const trimmedIban = payoutDetails.iban?.trim()
    const trimmedPaypalEmail = payoutDetails.paypalEmail?.trim()

    if (payoutMethod === 'paypal' && !trimmedPaypalEmail) {
      alert('Please enter your PayPal email')
      return
    }
    if (payoutMethod === 'bank_transfer') {
      if (!trimmedBankName) {
        alert('Please enter bank name')
        return
      }
      if (!trimmedIban) {
        alert('Please enter IBAN')
        return
      }
    }

    setPayoutLoading(true)
    try {
      const response = await fetch(`/api/referrer/${referrer.id}/request-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          paymentMethod: payoutMethod,
          paymentDetails: payoutMethod === 'paypal' 
            ? { paypalEmail: trimmedPaypalEmail }
            : { bankName: trimmedBankName, iban: trimmedIban }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request payout')
      }

      alert(data.message)
      setShowPayoutModal(false)
      setPayoutAmount('')
      setPayoutDetails({ paypalEmail: '', bankName: '', iban: '' })
      fetchDashboard()
    } catch (err) {
      console.error('Payout request error:', err)
      alert(err.message || 'Failed to request payout. Please try again.')
    } finally {
      setPayoutLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('referrer_data')
    localStorage.removeItem('referrer_id')
    onLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-badge-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-badge-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-badge-primary/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-badge-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onBack} className="btn-secondary">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-badge-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="hover:scale-105 transition-transform">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-badge-primary">Referrer Dashboard</h1>
              <p className="text-sm text-badge-primary/60">Welcome, {referrer.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-badge-primary">{dashboard.stats.totalClicks}</p>
            <p className="text-sm text-badge-primary/60">Total Clicks</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-badge-primary">{dashboard.stats.totalConversions}</p>
            <p className="text-sm text-badge-primary/60">Orders</p>
            {dashboard.stats.completedConversions > 0 && (
              <p className="text-xs text-green-600">{dashboard.stats.completedConversions} completed</p>
            )}
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-badge-secondary">{(dashboard.stats.confirmedEarnings || 0).toFixed(2)}</p>
            <p className="text-sm text-badge-primary/60">Confirmed (AED)</p>
            {dashboard.stats.pendingConfirmation > 0 && (
              <p className="text-xs text-amber-600">+{dashboard.stats.pendingConfirmation.toFixed(2)} pending</p>
            )}
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{dashboard.stats.pendingEarnings.toFixed(2)}</p>
            <p className="text-sm text-badge-primary/60">Available (AED)</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-badge-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Your Referral Link
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2.5 border border-badge-primary/20 rounded-xl bg-white/50 font-mono text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-badge-primary text-white hover:bg-badge-primary/90'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-badge-primary/50 mt-2">
            Your code: <span className="font-mono font-medium text-badge-secondary">{referrer.referralCode}</span>
          </p>
        </div>

        {/* Payout Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-badge-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Payouts
            </h2>
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={dashboard.stats.pendingEarnings < 50}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Payout
            </button>
          </div>

          {dashboard.stats.pendingEarnings < 50 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm mb-4">
              Minimum payout is 50 AED. You need {(50 - dashboard.stats.pendingEarnings).toFixed(2)} AED more.
              <p className="text-xs mt-1 text-amber-600">Note: Only earnings from completed orders are eligible for payout.</p>
            </div>
          )}

          {/* Payout History */}
          {dashboard.payouts.length > 0 ? (
            <div className="space-y-3">
              {dashboard.payouts.map((payout) => (
                <div 
                  key={payout.id} 
                  className="flex items-center justify-between p-3 bg-badge-primary/5 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-badge-primary">{payout.amount.toFixed(2)} AED</p>
                    <p className="text-xs text-badge-primary/50">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payout.status === 'paid' 
                      ? 'bg-green-100 text-green-700'
                      : payout.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-badge-primary/50 text-sm text-center py-4">
              No payout history yet
            </p>
          )}
        </div>

        {/* Recent Conversions */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-badge-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Recent Conversions
          </h2>

          {dashboard.referredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-badge-primary/60 border-b border-badge-primary/10">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Commission</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.referredOrders.slice(0, 10).map((order) => (
                    <tr key={order.orderId} className="border-b border-badge-primary/5">
                      <td className="py-3 font-mono text-sm">{order.orderId.slice(-8)}</td>
                      <td className="py-3">{order.amount.toFixed(2)} AED</td>
                      <td className="py-3 text-badge-secondary font-medium">
                        +{order.commission.toFixed(2)} AED
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          order.status === 'completed' || order.status === 'shipped'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-badge-primary/60">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-badge-primary/50 text-sm text-center py-4">
              No conversions yet. Share your link to start earning!
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button onClick={onBack} className="text-badge-primary/60 hover:text-badge-primary text-sm">
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-semibold text-badge-primary mb-4">
              Request Payout
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-badge-primary/60 mb-2">
                Available balance: <span className="font-bold text-green-600">{dashboard.stats.pendingEarnings.toFixed(2)} AED</span>
              </p>
              <label className="block text-sm font-medium text-badge-primary mb-1">
                Amount (AED) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="50"
                max={dashboard.stats.pendingEarnings}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Minimum 50 AED"
                className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-badge-primary mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('paypal')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    payoutMethod === 'paypal'
                      ? 'border-badge-secondary bg-badge-secondary/10'
                      : 'border-badge-primary/20 hover:border-badge-primary/40'
                  }`}
                >
                  <span className="text-2xl mb-1 block">💳</span>
                  <span className={`text-sm font-medium ${payoutMethod === 'paypal' ? 'text-badge-primary' : 'text-badge-primary/70'}`}>
                    PayPal
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bank_transfer')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    payoutMethod === 'bank_transfer'
                      ? 'border-badge-secondary bg-badge-secondary/10'
                      : 'border-badge-primary/20 hover:border-badge-primary/40'
                  }`}
                >
                  <span className="text-2xl mb-1 block">🏦</span>
                  <span className={`text-sm font-medium ${payoutMethod === 'bank_transfer' ? 'text-badge-primary' : 'text-badge-primary/70'}`}>
                    Bank Transfer
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {payoutMethod === 'paypal' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-badge-primary mb-1">
                  PayPal Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={payoutDetails.paypalEmail}
                  onChange={(e) => setPayoutDetails(prev => ({ ...prev, paypalEmail: e.target.value }))}
                  placeholder="your@paypal.com"
                  className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                />
              </div>
            )}

            {payoutMethod === 'bank_transfer' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-badge-primary mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payoutDetails.bankName}
                    onChange={(e) => setPayoutDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="e.g., Emirates NBD"
                    className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-badge-primary mb-1">
                    IBAN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payoutDetails.iban}
                    onChange={(e) => setPayoutDetails(prev => ({ ...prev, iban: e.target.value }))}
                    placeholder="AE..."
                    className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPayoutModal(false)
                  setPayoutAmount('')
                  setPayoutDetails({ paypalEmail: '', bankName: '', iban: '' })
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestPayout}
                disabled={payoutLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {payoutLoading ? 'Processing...' : 'Request Payout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferrerDashboard

