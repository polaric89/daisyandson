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
        }
      } catch (error) {
        console.error('Failed to fetch shipping rate:', error)
        // Fallback rates
        setShippingRate({
          name: country === 'AE' ? 'UAE Domestic' : 'International',
          price: country === 'AE' ? 25 : 85,
          currency: 'AED',
          deliveryTime: country === 'AE' ? '1-2 business days' : '5-10 business days'
        })
      }
      setLoading(false)
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

