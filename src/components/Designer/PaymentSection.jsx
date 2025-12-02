import { memo } from 'react'
import PayPalCheckout from '../Payment/PayPalCheckout'

/**
 * Payment section with order summary and PayPal checkout
 */
const PaymentSection = memo(function PaymentSection({ 
  orderData, 
  badgeCategory, 
  shippingRate, 
  buyerInfoComplete,
  onPaymentSuccess 
}) {
  // Convert AED to USD for PayPal sandbox
  const getUsdAmount = (aedAmount) => {
    return (aedAmount * 0.27).toFixed(2)
  }

  const grandTotal = (orderData?.pricing?.total || 0) + (shippingRate?.price || 0)

  return (
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
                {grandTotal} AED
              </span>
            </div>
          </div>
          
          {/* PayPal or Missing Info */}
          {buyerInfoComplete ? (
            <>
              <p className="text-xs text-badge-primary/50 mb-4">
                (PayPal sandbox: ~${getUsdAmount(grandTotal)} USD)
              </p>
              
              <PayPalCheckout 
                amount={getUsdAmount(grandTotal)}
                currency="USD"
                onSuccess={onPaymentSuccess}
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
              ? 'Design your badge and set quantity (min 15)' 
              : 'Design at least one badge to proceed'}
          </p>
        </div>
      )}
    </div>
  )
})

export default PaymentSection

