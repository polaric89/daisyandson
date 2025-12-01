import { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

/**
 * PayPal Sandbox Configuration
 * 
 * Replace with your own PayPal Sandbox Client ID for testing.
 * Get your sandbox credentials from: https://developer.paypal.com/
 * 
 * For production, use environment variables:
 * VITE_PAYPAL_CLIENT_ID
 */
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS' // PayPal sandbox test client ID

/**
 * PayPal Buttons Wrapper Component
 * Handles the actual payment flow
 */
function PayPalButtonsWrapper({ amount, currency, onSuccess, onError }) {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer()
  const [error, setError] = useState(null)

  // Create PayPal order
  // Note: Using USD for sandbox testing (AED ~= 0.27 USD, so 29 AED ≈ 8 USD)
  const createOrder = (data, actions) => {
    const sandboxAmount = currency === 'AED' ? '8.00' : amount
    const sandboxCurrency = currency === 'AED' ? 'USD' : currency
    
    return actions.order.create({
      purchase_units: [
        {
          description: 'Custom Photo Badge',
          amount: {
            currency_code: sandboxCurrency,
            value: sandboxAmount
          }
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    })
  }

  // Handle approved payment
  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture()
      
      // Extract payment details
      const paymentDetails = {
        orderId: order.id,
        payerId: order.payer.payer_id,
        payerEmail: order.payer.email_address,
        payerName: `${order.payer.name.given_name} ${order.payer.name.surname}`,
        amount: order.purchase_units[0].amount.value,
        currency: order.purchase_units[0].amount.currency_code,
        status: order.status,
        createTime: order.create_time,
        updateTime: order.update_time
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(paymentDetails)
      }

      return order
    } catch (err) {
      setError('Payment capture failed. Please try again.')
      if (onError) {
        onError(err)
      }
    }
  }

  // Handle errors
  const handleError = (err) => {
    console.error('PayPal Error:', err)
    setError('Payment failed. Please try again.')
    if (onError) {
      onError(err)
    }
  }

  // Handle cancel
  const onCancel = (data) => {
    console.log('Payment cancelled:', data)
    setError('Payment was cancelled.')
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-badge-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-badge-primary/60 text-sm">Loading PayPal...</p>
        </div>
      </div>
    )
  }

  if (isRejected) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600">Failed to load PayPal. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 45
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleError}
        onCancel={onCancel}
        disabled={false}
      />

      <p className="text-center text-xs text-badge-primary/50 mt-4">
        Secure payment powered by PayPal. You can pay with your PayPal account or debit/credit card.
      </p>
    </div>
  )
}

/**
 * PayPal Checkout Component
 * 
 * Provides PayPal Sandbox integration for badge purchases.
 * 
 * @param {string} amount - Payment amount (e.g., "29.00")
 * @param {string} currency - Currency code (e.g., "AED", "USD")
 * @param {Function} onSuccess - Callback when payment succeeds
 * @param {Function} onError - Callback when payment fails
 */
function PayPalCheckout({ amount = '29.00', currency = 'AED', onSuccess, onError }) {
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-10 h-10 border-2 border-badge-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // PayPal SDK configuration
  // Note: Use USD for sandbox testing, AED may not work in sandbox mode
  const paypalOptions = {
    'client-id': PAYPAL_CLIENT_ID,
    currency: currency === 'AED' ? 'USD' : currency, // Fallback to USD for sandbox
    intent: 'capture',
    components: 'buttons',
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtonsWrapper
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </PayPalScriptProvider>
  )
}

export default PayPalCheckout

