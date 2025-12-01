import { useState } from 'react'

/**
 * Order Tracking Component
 * Allows buyers to check their order status by Order ID or email
 */
function OrderTracking({ onBack }) {
  const [searchType, setSearchType] = useState('orderId') // orderId or email
  const [searchValue, setSearchValue] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const endpoint = searchType === 'orderId' 
        ? `/api/orders/track/${encodeURIComponent(searchValue.trim())}`
        : `/api/orders/track-by-email/${encodeURIComponent(searchValue.trim())}`
      
      const response = await fetch(endpoint)
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        setOrder(null)
        setError('Order not found. Please check your Order ID or email.')
      } else {
        throw new Error('Failed to fetch order')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Unable to look up order. Please try again later.')
    }
    setLoading(false)
  }

  const getStatusInfo = (status) => {
    const statuses = {
      pending: { 
        label: 'Order Received', 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: '📋',
        description: 'We have received your order and are preparing it for production.'
      },
      printing: { 
        label: 'Printing', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: '🖨️',
        description: 'Your badges are being printed! This usually takes 1-2 business days.'
      },
      shipped: { 
        label: 'Shipped', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: '📦',
        description: 'Your order is on its way! You should receive it soon.'
      },
      completed: { 
        label: 'Delivered', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: '✅',
        description: 'Your order has been delivered. Enjoy your badges!'
      }
    }
    return statuses[status] || statuses.pending
  }

  const statusSteps = ['pending', 'printing', 'shipped', 'completed']
  const currentStepIndex = order ? statusSteps.indexOf(order.status || 'pending') : -1

  return (
    <div className="min-h-screen bg-badge-bg">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-badge-primary">Track Your Order</h1>
                <p className="text-xs text-badge-primary/60">Check your badge order status</p>
              </div>
            </div>
            
            <button 
              onClick={onBack}
              className="text-sm text-badge-primary/60 hover:text-badge-primary flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-badge-primary mb-4">
            Find Your Order
          </h2>
          
          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setSearchType('orderId'); setSearchValue(''); setOrder(null); setSearched(false); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'orderId'
                  ? 'bg-badge-primary text-white'
                  : 'bg-gray-100 text-badge-primary/70 hover:bg-gray-200'
              }`}
            >
              Order ID
            </button>
            <button
              onClick={() => { setSearchType('email'); setSearchValue(''); setOrder(null); setSearched(false); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'email'
                  ? 'bg-badge-primary text-white'
                  : 'bg-gray-100 text-badge-primary/70 hover:bg-gray-200'
              }`}
            >
              PayPal Email
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type={searchType === 'email' ? 'email' : 'text'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'orderId' ? 'Enter your Order ID' : 'Enter your PayPal email'}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 focus:border-badge-primary"
            />
            <button
              type="submit"
              disabled={loading || !searchValue.trim()}
              className="btn-primary px-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-badge-primary/60">Order ID</p>
                  <p className="font-mono font-semibold text-badge-primary">{order.id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusInfo(order.status).color}`}>
                  {getStatusInfo(order.status).icon} {getStatusInfo(order.status).label}
                </span>
              </div>
              <p className="text-sm text-badge-primary/60 mt-2">
                Ordered on {order.timestamp ? new Date(order.timestamp).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Unknown date'}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      idx <= currentStepIndex 
                        ? 'bg-badge-primary text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {getStatusInfo(step).icon}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      idx <= currentStepIndex ? 'text-badge-primary font-medium' : 'text-gray-400'
                    }`}>
                      {getStatusInfo(step).label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Progress Bar */}
              <div className="relative h-1 bg-gray-200 rounded-full mt-4">
                <div 
                  className="absolute left-0 top-0 h-full bg-badge-primary rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm text-badge-primary/70 mt-4">
                {getStatusInfo(order.status).description}
              </p>
            </div>

            {/* Order Details */}
            <div className="p-6">
              <h3 className="font-semibold text-badge-primary mb-4">Order Details</h3>
              
              <div className="space-y-3">
                {/* Category */}
                <div className="flex justify-between text-sm">
                  <span className="text-badge-primary/60">Type</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.category === 'personal' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-purple-50 text-purple-600'
                  }`}>
                    {order.category === 'personal' ? '👤 Personal' : '🎉 Event'}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex justify-between text-sm">
                  <span className="text-badge-primary/60">Quantity</span>
                  <span className="font-medium text-badge-primary">{order.quantity} badge{order.quantity > 1 ? 's' : ''}</span>
                </div>

                {/* Price */}
                {order.pricing && (
                  <div className="flex justify-between text-sm">
                    <span className="text-badge-primary/60">Total Paid</span>
                    <span className="font-semibold text-badge-secondary">{order.pricing.total} AED</span>
                  </div>
                )}

                {/* Customer */}
                {order.payment?.payerName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-badge-primary/60">Customer</span>
                    <span className="text-badge-primary">{order.payment.payerName}</span>
                  </div>
                )}

                {/* Shipping Info */}
                {order.shipping?.cost && (
                  <div className="flex justify-between text-sm">
                    <span className="text-badge-primary/60">Shipping</span>
                    <span className="text-badge-primary">{order.shipping.cost} AED</span>
                  </div>
                )}
              </div>

              {/* Aramex Tracking */}
              {order.shipping?.trackingNumber && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Aramex Shipping</p>
                      <p className="text-xs text-gray-500">{order.shipping.estimatedDelivery || 'In transit'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                    <p className="font-mono text-sm font-bold text-gray-800 select-all">
                      {order.shipping.trackingNumber}
                    </p>
                  </div>

                  <a
                    href={`https://www.aramex.com/track/results?ShipmentNumber=${order.shipping.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Track on Aramex
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Shipping Address */}
              {order.shipping?.address && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-badge-primary/60 mb-2">Delivery Address</h4>
                  <div className="text-sm text-badge-primary">
                    <p className="font-medium">{order.shipping.name}</p>
                    <p>{order.shipping.phone}</p>
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.city}</p>
                  </div>
                </div>
              )}

              {/* Badge Previews */}
              {order.designs && order.designs.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-badge-primary/60 mb-3">Your Badge{order.designs.length > 1 ? 's' : ''}</h4>
                  <div className="flex flex-wrap gap-3">
                    {order.designs.map((design, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-full overflow-hidden border-2 border-badge-primary/10 shadow">
                        <img src={design.image} alt={`Badge ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {searched && !order && !error && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-badge-primary/60">No order found with that {searchType === 'orderId' ? 'Order ID' : 'email'}.</p>
            <p className="text-sm text-badge-primary/40 mt-2">Double-check your {searchType === 'orderId' ? 'Order ID' : 'PayPal email'} and try again.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default OrderTracking

