import { useState, useCallback } from 'react'
import LandingPage from './components/Landing/LandingPage'
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import CategoryModal from './components/CategoryModal/CategoryModal'
import OrderTracking from './components/OrderTracking/OrderTracking'
import { TermsOfService, PrivacyPolicy, FAQ } from './components/Legal'
import { DesignerPage } from './components/Designer'
import { ReferrerAuth, ReferrerDashboard } from './components/Referrals'
import { useReferral } from './components/Referrals/useReferral'
import { usePageNavigation, useBuyerInfo, useShipping, useOrder } from './hooks'

/**
 * Photo Badge Designer - Main Application
 * 
 * Pricing:
 * - Personal: 1 pc = 20 AED, 5 pcs = 17 AED each, 10+ pcs = 15 AED each
 * - Event: 1 design, min 15 pcs, 13 AED each
 */
function App() {
  // Navigation state
  const {
    currentPage,
    showCategoryModal,
    badgeCategory,
    setBadgeCategory,
    navigateTo,
    handleGetStarted,
    handleCategorySelect,
    handleCategoryModalClose,
    handleBackToHome,
    handleAdminLogin,
    handleAdminLogout
  } = usePageNavigation()

  // Referrer state
  const [referrerData, setReferrerData] = useState(() => {
    const stored = localStorage.getItem('referrer_data')
    return stored ? JSON.parse(stored) : null
  })
  
  // Buyer info state
  const {
    buyerInfo,
    errors: buyerInfoErrors,
    updateField: updateBuyerField,
    isComplete: buyerInfoComplete,
    reset: resetBuyerInfo
  } = useBuyerInfo()

  // Shipping state
  const {
    shippingRate,
    loading: loadingShipping,
    reset: resetShipping
  } = useShipping(buyerInfo.country)

  // Order state
  const {
    orderData,
    orderComplete,
    completedOrderId,
    handleDesignsChange,
    processPayment,
    reset: resetOrder
  } = useOrder()
  
  // Referral hook - referrerId is who referred this user
  const { referrerId, hasReferral } = useReferral()

  // Handle successful payment
  const handlePaymentSuccess = useCallback(async (paymentDetails) => {
    await processPayment({
      paymentDetails,
      badgeCategory,
      buyerInfo,
      shippingRate,
      referralId: referrerId, // Pass referrerId as referralId for the order
      hasReferral
    })
  }, [processPayment, badgeCategory, buyerInfo, shippingRate, referrerId, hasReferral])

  // Reset for new design
  const handleStartNew = useCallback(() => {
    resetOrder()
    resetBuyerInfo()
    resetShipping()
    setBadgeCategory(null)
    handleGetStarted()
  }, [resetOrder, resetBuyerInfo, resetShipping, setBadgeCategory, handleGetStarted])

  // Extended back to home handler
  const handleBackToHomeExtended = useCallback(() => {
    resetOrder()
    handleBackToHome()
  }, [resetOrder, handleBackToHome])

  // Referrer login handler
  const handleReferrerLogin = useCallback((referrer, stats) => {
    setReferrerData(referrer)
    navigateTo('referrer-dashboard')
  }, [navigateTo])

  // Referrer logout handler
  const handleReferrerLogout = useCallback(() => {
    setReferrerData(null)
    navigateTo('landing')
  }, [navigateTo])

  // Admin pages
  if (currentPage === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />
  }
  if (currentPage === 'admin') {
    return <AdminDashboard onLogout={handleAdminLogout} />
  }

  // Order Tracking page
  if (currentPage === 'tracking') {
    return <OrderTracking onBack={() => navigateTo('landing')} />
  }

  // Terms of Service page
  if (currentPage === 'terms') {
    return <TermsOfService onBack={() => navigateTo('landing')} />
  }

  // Privacy Policy page
  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={() => navigateTo('landing')} />
  }

  // FAQ page
  if (currentPage === 'faq') {
    return <FAQ onBack={() => navigateTo('landing')} />
  }

  // Referrer Auth page
  if (currentPage === 'referrer-auth') {
    return (
      <ReferrerAuth 
        onLogin={handleReferrerLogin}
        onBack={() => navigateTo('landing')}
      />
    )
  }

  // Referrer Dashboard page
  if (currentPage === 'referrer-dashboard') {
    if (!referrerData) {
      // If no referrer data, redirect to auth
      navigateTo('referrer-auth')
      return null
    }
    return (
      <ReferrerDashboard 
        referrer={referrerData}
        onLogout={handleReferrerLogout}
        onBack={() => navigateTo('landing')}
      />
    )
  }

  // Landing page
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onTrackOrder={() => navigateTo('tracking')}
          onTerms={() => navigateTo('terms')}
          onPrivacy={() => navigateTo('privacy')}
          onFAQ={() => navigateTo('faq')}
          onReferrer={() => navigateTo(referrerData ? 'referrer-dashboard' : 'referrer-auth')}
        />
        <CategoryModal 
          isOpen={showCategoryModal}
          onSelect={handleCategorySelect}
          onClose={handleCategoryModalClose}
        />
      </>
    )
  }

  // Designer page
  return (
    <DesignerPage
      // Navigation
      badgeCategory={badgeCategory}
      hasReferral={hasReferral}
      onBackToHome={handleBackToHomeExtended}
      onTrackOrder={() => navigateTo('tracking')}
      onReferrer={() => navigateTo(referrerData ? 'referrer-dashboard' : 'referrer-auth')}
      // Order state
      orderData={orderData}
      orderComplete={orderComplete}
      completedOrderId={completedOrderId}
      onDesignsChange={handleDesignsChange}
      onStartNew={handleStartNew}
      // Buyer info
      buyerInfo={buyerInfo}
      buyerInfoErrors={buyerInfoErrors}
      onUpdateBuyerField={updateBuyerField}
      buyerInfoComplete={buyerInfoComplete}
      // Shipping
      shippingRate={shippingRate}
      loadingShipping={loadingShipping}
      // Payment
      onPaymentSuccess={handlePaymentSuccess}
    />
  )
}

export default App
