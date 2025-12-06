import { memo } from 'react'

/**
 * Shipping information form component
 */
const ShippingForm = memo(function ShippingForm({ 
  buyerInfo, 
  errors, 
  shippingRate, 
  loadingShipping,
  onUpdateField 
}) {
  return (
    <div className="glass-card p-6 lg:p-8">
      <h2 className="font-display text-xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">3</span>
        Delivery Information
      </h2>
      
      {/* Aramex Shipping - Prominent Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-300 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Aramex Shipping</p>
              {shippingRate ? (
                <>
                  <p className="text-xs text-gray-600">{shippingRate.name}</p>
                  <p className="text-xs text-gray-500">{shippingRate.deliveryTime}</p>
                </>
              ) : (
                <p className="text-xs text-gray-500">Select country to see shipping rate</p>
              )}
            </div>
          </div>
          <div className="text-right">
            {loadingShipping ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : shippingRate ? (
              <>
                <p className="text-lg font-bold text-orange-600">{shippingRate.price} AED</p>
                <p className="text-xs text-gray-500">via Aramex</p>
              </>
            ) : (
              <p className="text-xs text-gray-400">—</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-badge-primary mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={buyerInfo.name}
            onChange={(e) => onUpdateField('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
              errors.name ? 'border-red-400' : 'border-badge-primary/20'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-badge-primary mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={buyerInfo.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            placeholder="your@email.com"
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
              errors.email ? 'border-red-400' : 'border-badge-primary/20'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-badge-primary mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={buyerInfo.phone}
            onChange={(e) => onUpdateField('phone', e.target.value)}
            placeholder="e.g., +971 50 123 4567"
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
              errors.phone ? 'border-red-400' : 'border-badge-primary/20'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
              onChange={(e) => onUpdateField('country', e.target.value)}
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
              onChange={(e) => onUpdateField('city', e.target.value)}
              placeholder="e.g., Dubai"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 ${
                errors.city ? 'border-red-400' : 'border-badge-primary/20'
              }`}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-badge-primary mb-1">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={buyerInfo.address}
            onChange={(e) => onUpdateField('address', e.target.value)}
            placeholder="Building name, street, area..."
            rows={2}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 resize-none ${
              errors.address ? 'border-red-400' : 'border-badge-primary/20'
            }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-badge-primary mb-1">
            Delivery Notes <span className="text-badge-primary/40">(optional)</span>
          </label>
          <input
            type="text"
            value={buyerInfo.notes}
            onChange={(e) => onUpdateField('notes', e.target.value)}
            placeholder="Any special instructions..."
            className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
          />
        </div>
      </div>
    </div>
  )
})

export default ShippingForm

