import { useState, useEffect } from 'react'

/**
 * Admin Dashboard Component
 * Manage orders, view designs, and export for printing
 */
function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, completed
  const [categoryFilter, setCategoryFilter] = useState('all') // all, personal, event

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      // Use mock data for demo
      setOrders([])
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status } : o
      ))
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from local state
        setOrders(orders.filter(o => o.id !== orderId))
      } else {
        alert('Failed to delete order')
      }
    } catch (error) {
      console.error('Failed to delete order:', error)
      alert('Failed to delete order')
    }
  }

  const createShipment = async (order) => {
    if (!order.shipping) {
      alert('No shipping address found for this order')
      return
    }

    if (order.shipping.trackingNumber) {
      alert(`This order already has a tracking number: ${order.shipping.trackingNumber}`)
      return
    }

    if (!window.confirm('Create Aramex shipment for this order?')) {
      return
    }

    try {
      const response = await fetch('/api/shipping/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          recipient: {
            name: order.shipping.name,
            phone: order.shipping.phone,
            address: order.shipping.address,
            city: order.shipping.city,
            countryCode: order.shipping.country || 'AE',
            email: order.payment?.payerEmail
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Shipment created!\nTracking Number: ${result.trackingNumber}`)
        fetchOrders() // Refresh orders
      } else {
        alert(`Failed to create shipment: ${result.error}`)
      }
    } catch (error) {
      console.error('Failed to create shipment:', error)
      alert('Failed to create shipment')
    }
  }

  const downloadDesign = (order) => {
    // Handle multiple designs
    if (order.designs && order.designs.length > 0) {
      order.designs.forEach((design, idx) => {
        if (design.image) {
          const link = document.createElement('a')
          link.href = design.image
          link.download = `badge-order-${order.id?.slice(-8) || 'unknown'}-design-${idx + 1}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      })
    } else if (order.image) {
      // Fallback for single image orders
      const link = document.createElement('a')
      link.href = order.image
      link.download = `badge-order-${order.id?.slice(-8) || 'unknown'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const filteredOrders = orders.filter(order => {
    // Filter by status
    const statusMatch = filter === 'all' || order.status === filter
    // Filter by category
    const categoryMatch = categoryFilter === 'all' || order.category === categoryFilter
    return statusMatch && categoryMatch
  })

  // Count orders by category
  const personalCount = orders.filter(o => o.category === 'personal').length
  const eventCount = orders.filter(o => o.category === 'event').length

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'printing': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L14.14 13.14L16.18 20L12 16.27L7.82 20L9.86 13.14L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-badge-primary">Admin Dashboard</h1>
                <p className="text-xs text-badge-primary/60">Manage orders & printing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchOrders}
                className="btn-secondary text-sm py-2 px-4"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button 
                onClick={onLogout}
                className="text-sm text-badge-primary/60 hover:text-badge-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-badge-primary">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'printing').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              categoryFilter === 'all'
                ? 'bg-badge-primary text-white shadow-lg shadow-badge-primary/25'
                : 'bg-white text-badge-primary/70 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Orders
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'all' ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('personal')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              categoryFilter === 'personal'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            👤 Personal
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'personal' ? 'bg-white/20' : 'bg-blue-50'
            }`}>
              {personalCount}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('event')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              categoryFilter === 'event'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            🎉 Event
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'event' ? 'bg-white/20' : 'bg-purple-50'
            }`}>
              {eventCount}
            </span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'printing', 'shipped', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 mx-auto border-2 border-badge-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-badge-primary/60">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Orders will appear here when customers complete purchases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Badge Preview(s) */}
                    <div className="flex-shrink-0 flex gap-1">
                      {order.designs && order.designs.length > 0 ? (
                        order.designs.slice(0, 3).map((design, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-full overflow-hidden border-3 border-gray-100 shadow-inner relative">
                            <img 
                              src={design.image || order.image} 
                              alt={`Badge ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            {idx === 2 && order.designs.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                +{order.designs.length - 3}
                              </div>
                            )}
                          </div>
                        ))
                      ) : order.image ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner">
                          <img 
                            src={order.image} 
                            alt="Badge design" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-grow">
                      <div>
                        <h3 className="font-semibold text-badge-primary">
                          Order #{order.id?.slice(-8) || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.shipping?.phone || order.payment?.payerEmail || 'No contact'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.timestamp ? new Date(order.timestamp).toLocaleString() : 'Unknown date'}
                        </p>
                      </div>

                      {/* Order Details */}
                      <div className="mt-3 flex items-center flex-wrap gap-2 text-sm">
                        <span className="text-gray-700 font-medium">
                          {order.shipping?.name || order.payment?.payerName || 'Customer'}
                        </span>
                        {order.quantity && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium">
                            {order.quantity} badge{order.quantity > 1 ? 's' : ''}
                          </span>
                        )}
                        {order.pricing && (
                          <span className="text-badge-secondary font-semibold">
                            {order.pricing.total} AED
                          </span>
                        )}
                        {order.category && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.category === 'personal' 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-purple-50 text-purple-600'
                          }`}>
                            {order.category === 'personal' ? '👤 Personal' : '🎉 Event'}
                          </span>
                        )}
                        {order.referralId && (
                          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded">
                            Ref: {order.referralId}
                          </span>
                        )}
                        {/* Status Dropdown */}
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs px-2 py-0.5 rounded border cursor-pointer ${getStatusColor(order.status || 'pending')}`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="printing">🖨️ Printing</option>
                          <option value="shipped">📦 Shipped</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </div>

                      {/* Shipping Info */}
                      {order.shipping && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-xs text-gray-600 flex-grow">
                              <p className="font-medium text-gray-800">{order.shipping.name}</p>
                              <p>{order.shipping.phone}</p>
                              <p>{order.shipping.address}, {order.shipping.city}</p>
                              {order.shipping.country && order.shipping.country !== 'AE' && (
                                <p className="text-blue-600">🌍 International: {order.shipping.country}</p>
                              )}
                              {order.shipping.notes && (
                                <p className="text-gray-400 italic mt-1">Note: {order.shipping.notes}</p>
                              )}
                              
                              {/* Aramex Tracking */}
                              {order.shipping.trackingNumber ? (
                                <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                  <p className="text-xs text-orange-600 font-medium">📦 Aramex Tracking:</p>
                                  <p className="font-mono text-sm text-orange-800">{order.shipping.trackingNumber}</p>
                                  <a
                                    href={`https://www.aramex.com/track/results?ShipmentNumber=${order.shipping.trackingNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-orange-600 hover:underline"
                                  >
                                    Track on Aramex →
                                  </a>
                                </div>
                              ) : (
                                <p className="text-xs text-amber-600 mt-1">⚠️ No tracking number yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => downloadDesign(order)}
                        disabled={!order.image && (!order.designs || order.designs.length === 0)}
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {order.designs?.length > 1 ? `Export All (${order.designs.length})` : 'Export'}
                      </button>
                      
                      {/* Ship with Aramex */}
                      {order.shipping && !order.shipping.trackingNumber && (
                        <button
                          onClick={() => createShipment(order)}
                          className="text-sm py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all"
                        >
                          <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          Ship (Aramex)
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-sm py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard

