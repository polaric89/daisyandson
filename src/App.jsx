import { useState, useCallback, useEffect, useRef } from 'react'
import PayPalCheckout from './components/Payment/PayPalCheckout'
import ReferralBanner from './components/Referrals/ReferralBanner'
import LandingPage from './components/Landing/LandingPage'
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import CategoryModal from './components/CategoryModal/CategoryModal'
import MultiDesignManager from './components/Designer/MultiDesignManager'
import OrderTracking from './components/OrderTracking/OrderTracking'
import { useReferral } from './components/Referrals/useReferral'

/**
 * Photo Badge Designer - Main Application
 * 
 * Pricing:
 * - Personal: 1 pc = 20 AED, 5 pcs = 17 AED each, 10+ pcs = 15 AED each
 * - Event: 1 design, min 10 pcs, 15 AED each
 */
function App() {
  // Page state
  const [currentPage, setCurrentPage] = useState('landing')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [badgeCategory, setBadgeCategory] = useState(null)
  
  // Order state
  const [orderData, setOrderData] = useState(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState(null)
  
  // Buyer info state
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'AE',
    notes: ''
  })
  const [buyerInfoErrors, setBuyerInfoErrors] = useState({})
  const [shippingRate, setShippingRate] = useState(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  
  // Referral hook
  const { referralId, hasReferral } = useReferral()

  // Check URL for admin access
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/admin') {
      const loggedIn = localStorage.getItem('admin_logged_in') === 'true'
      setCurrentPage(loggedIn ? 'admin' : 'admin-login')
      setIsAdmin(loggedIn)
    }
  }, [])

  // Fetch shipping rate when country changes
  useEffect(() => {
    const fetchShippingRate = async () => {
      if (!buyerInfo.country) return
      
      setLoadingShipping(true)
      try {
        const response = await fetch(`/api/shipping/rate/${buyerInfo.country}`)
        if (response.ok) {
          const data = await response.json()
          setShippingRate(data)
        }
      } catch (error) {
        console.error('Failed to fetch shipping rate:', error)
        // Fallback rates
        setShippingRate({
          name: buyerInfo.country === 'AE' ? 'UAE Domestic' : 'International',
          price: buyerInfo.country === 'AE' ? 25 : 85,
          currency: 'AED',
          deliveryTime: buyerInfo.country === 'AE' ? '1-2 business days' : '5-10 business days'
        })
      }
      setLoadingShipping(false)
    }
    
    fetchShippingRate()
  }, [buyerInfo.country])

  // Show category modal
  const handleGetStarted = useCallback(() => {
    setShowCategoryModal(true)
  }, [])

  // Handle category selection
  const handleCategorySelect = useCallback((category) => {
    setBadgeCategory(category)
    setShowCategoryModal(false)
    setCurrentPage('designer')
    window.scrollTo(0, 0)
  }, [])

  // Close category modal
  const handleCategoryModalClose = useCallback(() => {
    setShowCategoryModal(false)
  }, [])

  // Navigate back to landing
  const handleBackToHome = useCallback(() => {
    setCurrentPage('landing')
    setOrderData(null)
    setBadgeCategory(null)
    window.scrollTo(0, 0)
  }, [])

  // Handle design changes
  const handleDesignsChange = useCallback((data) => {
    setOrderData(data)
  }, [])

  // Store orderData, buyerInfo, and shippingRate in refs to avoid stale closure issues
  const orderDataRef = useRef(orderData)
  orderDataRef.current = orderData
  const buyerInfoRef = useRef(buyerInfo)
  buyerInfoRef.current = buyerInfo
  const shippingRateRef = useRef(shippingRate)
  shippingRateRef.current = shippingRate

  // Handle successful payment
  const handlePaymentSuccess = useCallback(async (paymentDetails) => {
    console.log('Payment successful:', paymentDetails)
    
    const currentOrderData = orderDataRef.current
    
    if (!currentOrderData || !currentOrderData.designs) {
      console.error('Order data missing')
      setOrderComplete(true) // Still show success for demo
      return
    }

    try {
      // Prepare order data with all designs
      const currentShippingRate = shippingRateRef.current
      const orderPayload = {
        category: badgeCategory,
        designs: currentOrderData.designs.map(d => ({
          id: d.id,
          image: d.image
        })),
        quantity: currentOrderData.quantity,
        pricing: {
          ...currentOrderData.pricing,
          shippingCost: currentShippingRate?.price || 0,
          grandTotal: currentOrderData.pricing.total + (currentShippingRate?.price || 0)
        },
        payment: paymentDetails,
        shipping: {
          ...buyerInfoRef.current,
          method: currentShippingRate?.name || 'Standard',
          cost: currentShippingRate?.price || 0,
          carrier: 'Aramex',
          estimatedDelivery: currentShippingRate?.deliveryTime || 'TBD'
        },
        referralId: hasReferral ? referralId : null,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }

      console.log('Saving order:', orderPayload)

      // Save to backend
      const response = await fetch('/api/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })

      console.log('Save response:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        setCompletedOrderId(result.orderId)
      }
      
      // Always set complete
      setOrderComplete(true)
    } catch (error) {
      console.error('Error saving order:', error)
      setOrderComplete(true) // Demo mode - still show success
      setCompletedOrderId('DEMO-' + Date.now())
    }
  }, [badgeCategory, hasReferral, referralId])

  // Reset for new design
  const handleStartNew = useCallback(() => {
    setOrderData(null)
    setOrderComplete(false)
    setBadgeCategory(null)
    setShowCategoryModal(true)
    setBuyerInfo({ name: '', phone: '', address: '', city: '', country: 'AE', notes: '' })
    setBuyerInfoErrors({})
    setShippingRate(null)
  }, [])

  // Admin handlers
  const handleAdminLogin = useCallback((loggedIn) => {
    setIsAdmin(loggedIn)
    setCurrentPage('admin')
  }, [])

  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('admin_logged_in')
    setIsAdmin(false)
    setCurrentPage('landing')
    window.history.pushState({}, '', '/')
  }, [])

  // Admin pages
  if (currentPage === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />
  }
  if (currentPage === 'admin') {
    return <AdminDashboard onLogout={handleAdminLogout} />
  }

  // Order Tracking page
  if (currentPage === 'tracking') {
    return <OrderTracking onBack={() => setCurrentPage('landing')} />
  }

  // Landing page
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onTrackOrder={() => setCurrentPage('tracking')}
        />
        <CategoryModal 
          isOpen={showCategoryModal}
          onSelect={handleCategorySelect}
          onClose={handleCategoryModalClose}
        />
      </>
    )
  }

  // Convert AED to USD for PayPal sandbox (approximate rate)
  const getUsdAmount = (aedAmount) => {
    return (aedAmount * 0.27).toFixed(2)
  }

  // Designer page
  return (
    <div className="min-h-screen bg-badge-cream py-8 px-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackToHome}
              className="hover:scale-105 transition-transform"
            >
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-gradient">Badge Designer</h1>
              <p className="text-sm text-badge-primary/60">Create your 58mm custom badge</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {badgeCategory && (
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${
                badgeCategory === 'personal' 
                  ? 'bg-badge-primary/10 border border-badge-primary/30' 
                  : 'bg-badge-secondary/10 border border-badge-secondary/30'
              }`}>
                <span className={`text-sm ${
                  badgeCategory === 'personal' ? 'text-badge-primary' : 'text-badge-secondary'
                }`}>
                  {badgeCategory === 'personal' ? '👤 Personal' : '🎉 Event'}
                </span>
              </div>
            )}
            {hasReferral && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-300 rounded-full">
                <span className="text-green-700 text-sm">🎁 Referral</span>
              </div>
            )}
            <button 
              onClick={handleBackToHome}
              className="btn-secondary text-sm py-2 px-4"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Referral Banner */}
      <ReferralBanner />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {orderComplete ? (
          // Order Complete
          <div className="glass-card p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-badge-primary mb-4">Order Placed! 🎉</h2>
            
            {/* Order ID */}
            {completedOrderId && (
              <div className="bg-badge-primary/5 border border-badge-primary/20 rounded-xl p-4 mb-6 inline-block">
                <p className="text-xs text-badge-primary/60 mb-1">Your Order ID</p>
                <p className="font-mono text-lg font-bold text-badge-primary select-all">{completedOrderId}</p>
                <p className="text-xs text-badge-primary/50 mt-1">Save this to track your order</p>
              </div>
            )}
            
            <p className="text-badge-primary/70 mb-2">
              Thank you for your order of {orderData?.quantity} badge{orderData?.quantity > 1 ? 's' : ''}!
            </p>
            <p className="text-badge-primary/50 text-sm mb-8">
              Your 58mm badges will be printed in high quality and shipped to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setCurrentPage('tracking')} className="btn-secondary">
                <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Track Order
              </button>
              <button onClick={handleStartNew} className="btn-primary">
                Create Another Order
              </button>
              <button onClick={handleBackToHome} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          // Designer + Payment Layout
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Designer */}
            <div className="glass-card p-6 lg:p-8">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">1</span>
                {badgeCategory === 'personal' ? 'Design Your Badges' : 'Design Your Event Badge'}
              </h2>
              <p className="text-sm text-badge-primary/50 mb-6">
                {badgeCategory === 'personal' 
                  ? 'Add multiple different badge designs. More badges = better price!' 
                  : 'Create one design for all your event badges (minimum 10 pieces)'}
              </p>
              
              <MultiDesignManager 
                category={badgeCategory}
                onDesignsChange={handleDesignsChange}
              />
            </div>

            {/* Right: Payment */}
            <div className="space-y-6">
              {/* Preview Section */}
              <div className="glass-card p-6 lg:p-8">
                <h2 className="font-display text-xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">2</span>
                  Your Designs
                </h2>
                
                {orderData?.designs?.filter(d => d.image).length > 0 ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {orderData.designs.filter(d => d.image).map((design, idx) => (
                      <div key={design.id} className="relative group">
                        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-badge-primary/20 shadow-lg">
                          <img src={design.image} alt={`Badge ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                        {badgeCategory === 'event' && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-badge-secondary text-white text-sm px-3 py-1 rounded-full font-semibold">
                            ×{orderData.quantity}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-[200px] h-[200px] mx-auto mb-4 rounded-full border-2 border-dashed border-badge-primary/30 flex items-center justify-center">
                      <svg className="w-12 h-12 text-badge-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-badge-primary/50">Upload images to see your badges</p>
                  </div>
                )}
              </div>

              {/* Shipping Info Section */}
              <div className="glass-card p-6 lg:p-8">
                <h2 className="font-display text-xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">3</span>
                  Delivery Information
                </h2>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-badge-primary mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={buyerInfo.name}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, name: e.target.value }))
                        setBuyerInfoErrors(prev => ({ ...prev, name: null }))
                      }}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
                        buyerInfoErrors.name ? 'border-red-400' : 'border-badge-primary/20'
                      }`}
                    />
                    {buyerInfoErrors.name && <p className="text-red-500 text-xs mt-1">{buyerInfoErrors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-badge-primary mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={buyerInfo.phone}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))
                        setBuyerInfoErrors(prev => ({ ...prev, phone: null }))
                      }}
                      placeholder="e.g., +971 50 123 4567"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
                        buyerInfoErrors.phone ? 'border-red-400' : 'border-badge-primary/20'
                      }`}
                    />
                    {buyerInfoErrors.phone && <p className="text-red-500 text-xs mt-1">{buyerInfoErrors.phone}</p>}
                  </div>

                  {/* Country & City Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-badge-primary mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={buyerInfo.country}
                        onChange={(e) => setBuyerInfo(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 bg-white"
                      >
                        <optgroup label="🇦🇪 UAE">
                          <option value="AE">United Arab Emirates</option>
                        </optgroup>
                        <optgroup label="🌍 GCC Countries">
                          <option value="SA">Saudi Arabia</option>
                          <option value="KW">Kuwait</option>
                          <option value="BH">Bahrain</option>
                          <option value="QA">Qatar</option>
                          <option value="OM">Oman</option>
                        </optgroup>
                        <optgroup label="🌐 International">
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="IN">India</option>
                          <option value="PK">Pakistan</option>
                          <option value="PH">Philippines</option>
                          <option value="EG">Egypt</option>
                          <option value="JO">Jordan</option>
                          <option value="LB">Lebanon</option>
                          <option value="OTHER">Other Country</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-badge-primary mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={buyerInfo.city}
                        onChange={(e) => {
                          setBuyerInfo(prev => ({ ...prev, city: e.target.value }))
                          setBuyerInfoErrors(prev => ({ ...prev, city: null }))
                        }}
                        placeholder="e.g., Dubai"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
                          buyerInfoErrors.city ? 'border-red-400' : 'border-badge-primary/20'
                        }`}
                      />
                      {buyerInfoErrors.city && <p className="text-red-500 text-xs mt-1">{buyerInfoErrors.city}</p>}
                    </div>
                  </div>

                  {/* Shipping Rate Display */}
                  {shippingRate && (
                    <div className="p-3 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5 rounded-xl border border-badge-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚚</span>
                          <div>
                            <p className="text-sm font-medium text-badge-primary">{shippingRate.name}</p>
                            <p className="text-xs text-badge-primary/60">{shippingRate.deliveryTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {loadingShipping ? (
                            <div className="w-5 h-5 border-2 border-badge-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <p className="text-lg font-bold text-badge-secondary">{shippingRate.price} AED</p>
                              <p className="text-xs text-badge-primary/50">via Aramex</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-badge-primary mb-1">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={buyerInfo.address}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, address: e.target.value }))
                        setBuyerInfoErrors(prev => ({ ...prev, address: null }))
                      }}
                      placeholder="Building name, street, area..."
                      rows={2}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 resize-none ${
                        buyerInfoErrors.address ? 'border-red-400' : 'border-badge-primary/20'
                      }`}
                    />
                    {buyerInfoErrors.address && <p className="text-red-500 text-xs mt-1">{buyerInfoErrors.address}</p>}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-badge-primary mb-1">
                      Delivery Notes <span className="text-badge-primary/40">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={buyerInfo.notes}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special instructions..."
                      className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="glass-card p-6 lg:p-8">
                <h2 className="font-display text-xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">4</span>
                  Complete Order
                </h2>
                
                {orderData?.isValid ? (
                  <div>
                    <div className="space-y-2 mb-4 pb-4 border-b border-badge-primary/10">
                      {/* Badges Cost */}
                      <div className="flex justify-between text-sm">
                        <span className="text-badge-primary/70">
                          {badgeCategory === 'event' 
                            ? `${orderData.quantity}× Event Badges` 
                            : `${orderData.quantity}× Personal Badge${orderData.quantity > 1 ? 's' : ''}`}
                        </span>
                        <span className="text-badge-primary">
                          {orderData.pricing.total} AED
                        </span>
                      </div>
                      {/* Shipping Cost */}
                      {shippingRate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-badge-primary/70">
                            🚚 Shipping ({shippingRate.name})
                          </span>
                          <span className="text-badge-primary">
                            {shippingRate.price} AED
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold pt-2 border-t border-badge-primary/10">
                        <span className="text-badge-primary">Grand Total</span>
                        <span className="text-xl text-badge-secondary">
                          {orderData.pricing.total + (shippingRate?.price || 0)} AED
                        </span>
                      </div>
                    </div>
                    
                    {/* Check if buyer info is complete */}
                    {buyerInfo.name && buyerInfo.phone && buyerInfo.city && buyerInfo.address ? (
                      <>
                        <p className="text-xs text-badge-primary/50 mb-4">
                          (PayPal sandbox: ~${getUsdAmount(orderData.pricing.total + (shippingRate?.price || 0))} USD)
                        </p>
                        
                        <PayPalCheckout 
                          amount={getUsdAmount(orderData.pricing.total + (shippingRate?.price || 0))}
                          currency="USD"
                          onSuccess={handlePaymentSuccess}
                        />
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="text-badge-primary/70 text-sm font-medium">Please fill in delivery information above</p>
                        <p className="text-badge-primary/50 text-xs mt-1">All fields marked with * are required</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-badge-primary/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-badge-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-badge-primary/50">
                      {badgeCategory === 'event' 
                        ? 'Design your badge and set quantity (min 10)' 
                        : 'Design at least one badge to proceed'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-badge-primary/10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-badge-primary/50">
          <p>© 2025 Daisy & Son Co. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-badge-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-badge-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-badge-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
