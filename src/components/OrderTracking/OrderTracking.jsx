import { useState } from 'react'

/**
 * Order Tracking Component
 * Allows buyers to check their order status by Order ID or email
 */
function OrderTracking({ onBack }) {
  const [searchType, setSearchType] = useState('orderId') // orderId or email
  const [searchValue, setSearchValue] = useState('')
  const [order, setOrder] = useState(null) // Single order (for Order ID search)
  const [orders, setOrders] = useState(null) // Multiple orders (for email search)
  const [expandedOrderId, setExpandedOrderId] = useState(null) // For accordion
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
        // Check if response has 'orders' array (multiple orders) or single order
        if (data.orders && Array.isArray(data.orders)) {
          // Multiple orders from email search
          setOrders(data.orders)
          setOrder(null)
          // Expand the first order by default
          if (data.orders.length > 0) {
            setExpandedOrderId(data.orders[0].id)
          }
        } else {
          // Single order (from Order ID search or single match)
          setOrder(data)
          setOrders(null)
          setExpandedOrderId(null)
        }
      } else if (response.status === 404) {
        setOrder(null)
        setOrders(null)
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

  // Helper function to render order details (used for both single and multiple orders)
  const renderOrderDetails = (orderItem) => {
    const stepIndex = statusSteps.indexOf(orderItem.status || 'pending')
    
    return (
      <>
        {/* Progress Steps */}
        <div className="p-6 bg-badge-beige/50">
          <div className="flex items-center justify-between mb-2">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  idx <= stepIndex 
                    ? 'bg-badge-primary text-white' 
                    : 'bg-badge-primary/20 text-badge-primary/40'
                }`}>
                  {getStatusInfo(step).icon}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  idx <= stepIndex ? 'text-badge-primary font-medium' : 'text-badge-primary/40'
                }`}>
                  {getStatusInfo(step).label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress Bar */}
          <div className="relative h-1 bg-badge-primary/20 rounded-full mt-4">
            <div 
              className="absolute left-0 top-0 h-full bg-badge-primary rounded-full transition-all duration-500"
              style={{ width: `${(stepIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-badge-primary/70 mt-4">
            {getStatusInfo(orderItem.status).description}
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
                orderItem.category === 'personal' 
                  ? 'bg-badge-leaf/10 text-badge-leaf' 
                  : 'bg-badge-secondary/10 text-badge-secondary'
              }`}>
                {orderItem.category === 'personal' ? '👤 Personal' : '🎉 Event'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex justify-between text-sm">
              <span className="text-badge-primary/60">Quantity</span>
              <span className="font-medium text-badge-primary">{orderItem.quantity} badge{orderItem.quantity > 1 ? 's' : ''}</span>
            </div>

            {/* Price */}
            {orderItem.pricing && (
              <div className="flex justify-between text-sm">
                <span className="text-badge-primary/60">Total Paid</span>
                <span className="font-semibold text-badge-secondary">{orderItem.pricing.total} AED</span>
              </div>
            )}

            {/* Customer */}
            {orderItem.payment?.payerName && (
              <div className="flex justify-between text-sm">
                <span className="text-badge-primary/60">Customer</span>
                <span className="text-badge-primary">{orderItem.payment.payerName}</span>
              </div>
            )}

            {/* Shipping Info */}
            {orderItem.shipping?.cost && (
              <div className="flex justify-between text-sm">
                <span className="text-badge-primary/60">Shipping</span>
                <span className="text-badge-primary">{orderItem.shipping.cost} AED</span>
              </div>
            )}
          </div>

          {/* Aramex Shipping Info */}
          {orderItem.shipping && (orderItem.shipping.carrier === 'Aramex' || orderItem.shipping.trackingNumber) && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Aramex Shipping</p>
                  <p className="text-xs text-gray-500">
                    {orderItem.shipping.estimatedDelivery || orderItem.shipping.deliveryTime || 'Preparing for shipment'}
                  </p>
                </div>
              </div>
              
              {orderItem.shipping.trackingNumber && (
                <>
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                    <p className="font-mono text-sm font-bold text-gray-800 select-all">
                      {orderItem.shipping.trackingNumber}
                    </p>
                  </div>

                  <a
                    href={`https://www.aramex.com/track/results?ShipmentNumber=${orderItem.shipping.trackingNumber}`}
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
                </>
              )}
              
              {!orderItem.shipping.trackingNumber && (
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">Tracking number will be available once your order ships.</p>
                </div>
              )}
            </div>
          )}

          {/* Shipping Address */}
          {orderItem.shipping?.address && (
            <div className="mt-4 pt-4 border-t border-badge-primary/10">
              <h4 className="text-sm font-medium text-badge-primary/60 mb-2">Delivery Address</h4>
              <div className="text-sm text-badge-primary">
                <p className="font-medium">{orderItem.shipping.name}</p>
                <p>{orderItem.shipping.phone}</p>
                <p>{orderItem.shipping.address}</p>
                <p>{orderItem.shipping.city}</p>
              </div>
            </div>
          )}

          {/* Badge Previews */}
          {orderItem.designs && orderItem.designs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-badge-primary/10">
              <h4 className="text-sm font-medium text-badge-primary/60 mb-3">Your Badge{orderItem.designs.length > 1 ? 's' : ''}</h4>
              <div className="flex flex-wrap gap-3">
                {orderItem.designs.map((design, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-full overflow-hidden border-2 border-badge-primary/10 shadow">
                    <img src={design.image} alt={`Badge ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">Track Your Order</h1>
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
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-badge-primary mb-4">
            Find Your Order
          </h2>
          
          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { 
                setSearchType('orderId'); 
                setSearchValue(''); 
                setOrder(null); 
                setOrders(null);
                setExpandedOrderId(null);
                setSearched(false); 
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'orderId'
                  ? 'bg-badge-primary text-white'
                  : 'bg-badge-beige text-badge-primary/70 hover:bg-badge-primary/10'
              }`}
            >
              Order ID
            </button>
            <button
              onClick={() => { 
                setSearchType('email'); 
                setSearchValue(''); 
                setOrder(null); 
                setOrders(null);
                setExpandedOrderId(null);
                setSearched(false); 
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'email'
                  ? 'bg-badge-primary text-white'
                  : 'bg-badge-beige text-badge-primary/70 hover:bg-badge-primary/10'
              }`}
            >
              Email Address
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type={searchType === 'email' ? 'email' : 'text'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'orderId' ? 'Enter your Order ID' : 'Enter your email address'}
              className="flex-1 px-4 py-3 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20 focus:border-badge-primary bg-white"
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

        {/* Single Order Result (Order ID search) */}
        {order && !orders && (
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-badge-primary/10">
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
            {renderOrderDetails(order)}
          </div>
        )}

        {/* Multiple Orders Result (Email search - Accordion) */}
        {orders && orders.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow border border-badge-primary/10 p-4 mb-4">
              <p className="text-sm text-badge-primary/70 text-center">
                Found <span className="font-semibold text-badge-primary">{orders.length}</span> order{orders.length > 1 ? 's' : ''} for this email
              </p>
            </div>
            
            {orders.map((orderItem) => {
              const isExpanded = expandedOrderId === orderItem.id
              return (
                <div 
                  key={orderItem.id} 
                  className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : orderItem.id)}
                    className="w-full p-6 border-b border-badge-primary/10 hover:bg-badge-beige/30 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-sm text-badge-primary/60">Order ID</p>
                          <p className="font-mono font-semibold text-badge-primary">{orderItem.id}</p>
                        </div>
                        <p className="text-sm text-badge-primary/60">
                          Ordered on {orderItem.timestamp ? new Date(orderItem.timestamp).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Unknown date'}
                        </p>
                        {orderItem.pricing && (
                          <p className="text-sm font-medium text-badge-secondary mt-1">
                            {orderItem.pricing.total} AED
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusInfo(orderItem.status).color}`}>
                          {getStatusInfo(orderItem.status).icon} {getStatusInfo(orderItem.status).label}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-badge-primary/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      {renderOrderDetails(orderItem)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {searched && !order && !orders && !error && !loading && (
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-badge-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-badge-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-badge-primary/60">No order found with that {searchType === 'orderId' ? 'Order ID' : 'email'}.</p>
            <p className="text-sm text-badge-primary/40 mt-2">Double-check your {searchType === 'orderId' ? 'Order ID' : 'email address'} and try again.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default OrderTracking

