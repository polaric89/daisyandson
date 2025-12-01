import { useState, useCallback, useRef, useEffect } from 'react'
import CircleBadgeDesigner from './CircleBadgeDesigner'
import { exportToPng } from '../../utils/canvas/exportToPng'

/**
 * Multi-Design Manager
 * Handles multiple badge designs for Personal category
 * or single design with quantity for Event category
 */
function MultiDesignManager({ category, onDesignsChange }) {
  // For Personal: array of designs
  // For Event: single design with quantity
  const [designs, setDesigns] = useState([{ id: 1, image: null, data: null }])
  const [eventQuantity, setEventQuantity] = useState(15) // Min 15 for events
  const [activeDesignIndex, setActiveDesignIndex] = useState(0)
  const designerRefs = useRef({})

  // Pricing logic
  const getPricing = useCallback(() => {
    if (category === 'event') {
      const qty = parseInt(eventQuantity) || 15
      return {
        quantity: qty,
        pricePerBadge: 13,
        total: qty * 13,
        currency: 'AED'
      }
    } else {
      // Personal pricing
      const count = designs.filter(d => d.image).length
      let pricePerBadge = 20
      if (count >= 10) {
        pricePerBadge = 15
      } else if (count >= 5) {
        pricePerBadge = 17
      }
      return {
        quantity: count,
        pricePerBadge,
        total: count * pricePerBadge,
        currency: 'AED'
      }
    }
  }, [category, designs, eventQuantity])

  // Add new design slot (Personal only)
  const addDesign = useCallback(() => {
    if (category === 'personal') {
      const newId = Math.max(...designs.map(d => d.id)) + 1
      setDesigns(prev => [...prev, { id: newId, image: null, data: null }])
      setActiveDesignIndex(designs.length)
    }
  }, [category, designs])

  // Remove design slot
  const removeDesign = useCallback((index) => {
    if (designs.length > 1) {
      setDesigns(prev => prev.filter((_, i) => i !== index))
      if (activeDesignIndex >= index && activeDesignIndex > 0) {
        setActiveDesignIndex(prev => prev - 1)
      }
    }
  }, [designs.length, activeDesignIndex])

  // Handle design change for a specific slot
  const handleDesignChange = useCallback((index, data) => {
    setDesigns(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], data }
      return updated
    })
  }, [])

  // Handle export for a specific slot
  const handleExport = useCallback((index, imageData) => {
    setDesigns(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], image: imageData }
      return updated
    })
  }, [])

  // Export all designs
  const exportAllDesigns = useCallback(async () => {
    const exports = []
    for (let i = 0; i < designs.length; i++) {
      if (designs[i].data?.hasImage && designerRefs.current[i]) {
        const exportData = await designerRefs.current[i].exportDesign()
        exports.push(exportData)
      }
    }
    return exports
  }, [designs])

  // Update parent with current state
  const updateParent = useCallback(() => {
    const pricing = getPricing()
    const validDesigns = designs.filter(d => d.image)
    
    onDesignsChange({
      category,
      designs: category === 'event' ? designs.slice(0, 1) : validDesigns,
      quantity: pricing.quantity,
      pricing,
      isValid: category === 'event' 
        ? designs[0]?.image && (parseInt(eventQuantity) || 0) >= 15
        : validDesigns.length > 0
    })
  }, [category, designs, eventQuantity, getPricing, onDesignsChange])

  // Update parent when designs or quantity changes
  useEffect(() => {
    updateParent()
  }, [updateParent])

  const pricing = getPricing()
  const validDesignsCount = designs.filter(d => d.image).length

  return (
    <div className="space-y-6">
      {/* Design Tabs (Personal only) */}
      {category === 'personal' && (
        <div className="flex items-center gap-2 flex-wrap">
          {designs.map((design, index) => (
            <button
              key={design.id}
              onClick={() => setActiveDesignIndex(index)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeDesignIndex === index
                  ? 'bg-badge-primary text-white'
                  : design.image
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Badge {index + 1}
              {design.image && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {designs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeDesign(index); }}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </button>
          ))}
          <button
            onClick={addDesign}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-badge-primary/10 text-badge-primary hover:bg-badge-primary/20 transition-all flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Badge
          </button>
        </div>
      )}

      {/* Active Designer */}
      <div className="relative">
        {designs.map((design, index) => (
          <div
            key={design.id}
            className={activeDesignIndex === index ? 'block' : 'hidden'}
          >
            <CircleBadgeDesigner
              ref={(ref) => { designerRefs.current[index] = ref }}
              onDesignChange={(data) => handleDesignChange(index, data)}
              onExport={(img) => {
                handleExport(index, img)
              }}
            />
          </div>
        ))}
      </div>

      {/* Quantity Selector (Event only) */}
      {category === 'event' && designs[0]?.image && (
        <div className="p-4 bg-badge-primary/5 rounded-xl">
          <label className="block text-sm font-medium text-badge-primary mb-2">
            How many badges do you need?
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setEventQuantity(prev => Math.max(15, (parseInt(prev) || 15) - 1))}
                className="w-10 h-10 rounded-l-lg bg-badge-primary/10 hover:bg-badge-primary/20 text-badge-primary font-bold text-xl transition-colors"
              >
                −
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={eventQuantity}
                onChange={(e) => {
                  const input = e.target.value.replace(/[^0-9]/g, '')
                  setEventQuantity(input === '' ? '' : parseInt(input))
                }}
                onBlur={() => {
                  const val = Math.max(15, parseInt(eventQuantity) || 15)
                  setEventQuantity(val)
                }}
                className="w-20 h-10 px-2 border-y border-badge-primary/20 text-center font-semibold text-badge-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setEventQuantity(prev => (parseInt(prev) || 15) + 1)}
                className="w-10 h-10 rounded-r-lg bg-badge-primary/10 hover:bg-badge-primary/20 text-badge-primary font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-badge-primary/60 text-sm">
              Minimum 15 pieces
            </span>
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      {(validDesignsCount > 0 || (category === 'event' && designs[0]?.image)) && (
        <div className="p-4 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5 rounded-xl border border-badge-primary/10">
          <h4 className="font-semibold text-badge-primary mb-3">Order Summary</h4>
          
          {category === 'personal' ? (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-badge-primary/70">Badges designed</span>
                  <span className="font-medium text-badge-primary">{validDesignsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-badge-primary/70">Price per badge</span>
                  <span className="font-medium text-badge-primary">
                    {pricing.pricePerBadge} AED
                    {validDesignsCount >= 5 && validDesignsCount < 10 && (
                      <span className="text-green-600 text-xs ml-1">(5+ discount)</span>
                    )}
                    {validDesignsCount >= 10 && (
                      <span className="text-green-600 text-xs ml-1">(10+ discount)</span>
                    )}
                  </span>
                </div>
              </div>
              
              {/* Pricing tiers info */}
              <div className="mt-3 pt-3 border-t border-badge-primary/10 text-xs text-badge-primary/50">
                <p>💡 1 badge = 20 AED • 5+ badges = 17 AED each • 10+ badges = 15 AED each</p>
              </div>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-badge-primary/70">Quantity</span>
                <span className="font-medium text-badge-primary">{eventQuantity} badges</span>
              </div>
              <div className="flex justify-between">
                <span className="text-badge-primary/70">Price per badge</span>
                <span className="font-medium text-badge-primary">15 AED</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-badge-primary/10">
            <span className="font-semibold text-badge-primary">Total</span>
            <span className="text-xl font-bold text-badge-secondary">
              {pricing.total} AED
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiDesignManager

