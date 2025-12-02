import ReferralBanner from '../Referrals/ReferralBanner'
import MultiDesignManager from './MultiDesignManager'
import DesignerHeader from './DesignerHeader'
import OrderComplete from './OrderComplete'
import DesignPreview from './DesignPreview'
import ShippingForm from './ShippingForm'
import PaymentSection from './PaymentSection'

/**
 * Main Designer Page layout component
 */
function DesignerPage({
  // Navigation
  badgeCategory,
  hasReferral,
  onBackToHome,
  onTrackOrder,
  onReferrer,
  // Order state
  orderData,
  orderComplete,
  completedOrderId,
  onDesignsChange,
  onStartNew,
  // Buyer info
  buyerInfo,
  buyerInfoErrors,
  onUpdateBuyerField,
  buyerInfoComplete,
  // Shipping
  shippingRate,
  loadingShipping,
  // Payment
  onPaymentSuccess
}) {
  return (
    <div className="min-h-screen bg-badge-cream py-8 px-4">
      {/* Header */}
      <DesignerHeader
        badgeCategory={badgeCategory}
        hasReferral={hasReferral}
        onBackToHome={onBackToHome}
      />

      {/* Referral Banner */}
      <ReferralBanner onBecomeReferrer={onReferrer} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {orderComplete ? (
          <OrderComplete
            completedOrderId={completedOrderId}
            quantity={orderData?.quantity}
            onTrackOrder={onTrackOrder}
            onStartNew={onStartNew}
            onBackToHome={onBackToHome}
          />
        ) : (
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
                  : 'Create one design for all your event badges (minimum 15 pieces)'}
              </p>
              
              <MultiDesignManager 
                category={badgeCategory}
                onDesignsChange={onDesignsChange}
              />
            </div>

            {/* Right: Preview, Shipping, Payment */}
            <div className="space-y-6">
              <DesignPreview 
                orderData={orderData} 
                badgeCategory={badgeCategory} 
              />

              <ShippingForm
                buyerInfo={buyerInfo}
                errors={buyerInfoErrors}
                shippingRate={shippingRate}
                loadingShipping={loadingShipping}
                onUpdateField={onUpdateBuyerField}
              />

              <PaymentSection
                orderData={orderData}
                badgeCategory={badgeCategory}
                shippingRate={shippingRate}
                buyerInfoComplete={buyerInfoComplete}
                onPaymentSuccess={onPaymentSuccess}
              />
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

export default DesignerPage

