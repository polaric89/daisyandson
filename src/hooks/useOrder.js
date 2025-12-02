import { useState, useCallback, useRef } from 'react'

/**
 * Hook for managing order state and payment
 */
export function useOrder() {
  const [orderData, setOrderData] = useState(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState(null)

  // Refs for callback stability
  const orderDataRef = useRef(orderData)
  orderDataRef.current = orderData

  const handleDesignsChange = useCallback((data) => {
    setOrderData(data)
  }, [])

  const processPayment = useCallback(async ({
    paymentDetails,
    badgeCategory,
    buyerInfo,
    shippingRate,
    referralId,
    hasReferral
  }) => {
    console.log('Payment successful:', paymentDetails)
    
    const currentOrderData = orderDataRef.current
    
    if (!currentOrderData || !currentOrderData.designs) {
      console.error('Order data missing')
      setOrderComplete(true)
      return
    }

    try {
      const orderPayload = {
        category: badgeCategory,
        designs: currentOrderData.designs.map(d => ({
          id: d.id,
          image: d.image
        })),
        quantity: currentOrderData.quantity,
        pricing: {
          ...currentOrderData.pricing,
          shippingCost: shippingRate?.price || 0,
          grandTotal: currentOrderData.pricing.total + (shippingRate?.price || 0)
        },
        payment: paymentDetails,
        shipping: {
          ...buyerInfo,
          method: shippingRate?.name || 'Standard',
          cost: shippingRate?.price || 0,
          carrier: 'Aramex',
          estimatedDelivery: shippingRate?.deliveryTime || 'TBD'
        },
        referralId: hasReferral ? referralId : null,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }

      console.log('Saving order:', orderPayload)

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
      
      setOrderComplete(true)
    } catch (error) {
      console.error('Error saving order:', error)
      setOrderComplete(true)
      setCompletedOrderId('DEMO-' + Date.now())
    }
  }, [])

  const reset = useCallback(() => {
    setOrderData(null)
    setOrderComplete(false)
    setCompletedOrderId(null)
  }, [])

  return {
    orderData,
    orderComplete,
    completedOrderId,
    handleDesignsChange,
    processPayment,
    reset
  }
}

