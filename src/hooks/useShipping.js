import { useState, useEffect } from 'react'

/**
 * Hook for fetching and managing shipping rates
 */
export function useShipping(country) {
  const [shippingRate, setShippingRate] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchShippingRate = async () => {
      if (!country) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/shipping/rate/${country}`)
        if (response.ok) {
          const data = await response.json()
          setShippingRate(data)
        } else {
          // If API fails, use fallback rates
          console.warn('Shipping API returned non-OK status, using fallback rates')
          setShippingRate({
            name: country === 'AE' ? 'Standard Shipping (UAE)' : 'International Standard',
            price: country === 'AE' ? 15 : 45,
            currency: 'AED',
            carrier: 'Aramex',
            deliveryTime: country === 'AE' ? '3-5 business days' : '7-14 business days'
          })
        }
      } catch (error) {
        console.error('Failed to fetch shipping rate:', error)
        // Fallback rates
        setShippingRate({
          name: country === 'AE' ? 'Standard Shipping (UAE)' : 'International Standard',
          price: country === 'AE' ? 15 : 45,
          currency: 'AED',
          deliveryTime: country === 'AE' ? '3-5 business days' : '7-14 business days'
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchShippingRate()
  }, [country])

  const reset = () => {
    setShippingRate(null)
  }

  return {
    shippingRate,
    loading,
    reset
  }
}

