import { useState, useCallback, useMemo } from 'react'

const initialBuyerInfo = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'AE',
  notes: ''
}

/**
 * Hook for managing buyer information form state
 */
export function useBuyerInfo() {
  const [buyerInfo, setBuyerInfo] = useState(initialBuyerInfo)
  const [errors, setErrors] = useState({})

  const updateField = useCallback((field, value) => {
    setBuyerInfo(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (!buyerInfo.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!buyerInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!buyerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!buyerInfo.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!buyerInfo.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [buyerInfo])

  const isComplete = useMemo(() => {
    return !!(buyerInfo.name && buyerInfo.email && buyerInfo.phone && buyerInfo.city && buyerInfo.address)
  }, [buyerInfo.name, buyerInfo.email, buyerInfo.phone, buyerInfo.city, buyerInfo.address])

  const reset = useCallback(() => {
    setBuyerInfo(initialBuyerInfo)
    setErrors({})
  }, [])

  return {
    buyerInfo,
    errors,
    updateField,
    validateForm,
    isComplete,
    reset
  }
}

