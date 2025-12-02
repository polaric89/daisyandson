import { useState, useEffect, useCallback } from 'react'

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
  
  // Payouts state
  const [activeView, setActiveView] = useState('orders') // 'orders' or 'payouts'
  const [payouts, setPayouts] = useState([])
  const [payoutsLoading, setPayoutsLoading] = useState(false)
  const [expandedPayouts, setExpandedPayouts] = useState(new Set())
  const [payoutTab, setPayoutTab] = useState('pending') // 'pending' or 'processed'

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch payouts when switching to payouts view
  useEffect(() => {
    if (activeView === 'payouts') {
      fetchPayouts()
    }
  }, [activeView])

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

  const fetchPayouts = async () => {
    setPayoutsLoading(true)
    try {
      const response = await fetch('/api/admin/payouts')
      if (response.ok) {
        const data = await response.json()
        setPayouts(data.payouts || [])
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error)
      setPayouts([])
    }
    setPayoutsLoading(false)
  }

  const togglePayoutExpanded = (payoutId) => {
    setExpandedPayouts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(payoutId)) {
        newSet.delete(payoutId)
      } else {
        newSet.add(payoutId)
      }
      return newSet
    })
  }

  const processPayout = async (payoutId, status, adminNotes = '') => {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      })
      
      if (response.ok) {
        fetchPayouts()
        alert(`Payout ${status === 'paid' ? 'marked as paid' : 'updated'} successfully`)
      } else {
        alert('Failed to update payout')
      }
    } catch (error) {
      console.error('Failed to process payout:', error)
      alert('Failed to process payout')
    }
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

  // Export with print marks (bleed, cut line)
  const exportForPrint = useCallback(async (order) => {
    const designs = order.designs?.length > 0 ? order.designs : (order.image ? [{ image: order.image }] : [])
    
    for (let idx = 0; idx < designs.length; idx++) {
      const design = designs[idx]
      if (!design.image) continue

      try {
        // Load the image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = design.image
        })

        // Create print-ready canvas with bleed (600 DPI for sharp prints)
        const DPI = 600
        const MM_TO_PX = DPI / 25.4
        const BADGE_MM = 58
        const BLEED_MM = 3
        
        const cuttingDiameter = Math.round(BADGE_MM * MM_TO_PX)
        const bleedDiameter = Math.round((BADGE_MM + BLEED_MM * 2) * MM_TO_PX)
        const margin = Math.round(10 * MM_TO_PX)
        const canvasSize = bleedDiameter + margin * 2

        const canvas = document.createElement('canvas')
        canvas.width = canvasSize
        canvas.height = canvasSize
        const ctx = canvas.getContext('2d')

        // White background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvasSize, canvasSize)

        const centerX = canvasSize / 2
        const centerY = canvasSize / 2

        // Draw the badge image (scaled to fill bleed area)
        ctx.save()
        ctx.beginPath()
        ctx.arc(centerX, centerY, bleedDiameter / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()

        // Scale image to fit bleed diameter
        const scale = bleedDiameter / Math.min(img.width, img.height)
        const drawWidth = img.width * scale
        const drawHeight = img.height * scale

        ctx.drawImage(
          img,
          centerX - drawWidth / 2,
          centerY - drawHeight / 2,
          drawWidth,
          drawHeight
        )
        ctx.restore()

        // Download
        const dataUrl = canvas.toDataURL('image/png', 1.0)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `PRINT-badge-${order.id?.slice(-8) || 'unknown'}-design-${idx + 1}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

      } catch (error) {
        console.error('Failed to export for print:', error)
        alert(`Failed to export design ${idx + 1} for print`)
      }
    }
  }, [])

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
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">Admin Dashboard</h1>
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
        {/* View Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveView('orders')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'orders'
                ? 'bg-badge-primary text-white shadow-lg'
                : 'bg-white/80 text-badge-primary border border-badge-primary/20 hover:bg-white'
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActiveView('payouts')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'payouts'
                ? 'bg-badge-secondary text-white shadow-lg'
                : 'bg-white/80 text-badge-secondary border border-badge-secondary/20 hover:bg-white'
            }`}
          >
            💰 Referrer Payouts
            {payouts.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {payouts.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeView === 'orders' ? (
          <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-badge-primary/10">
            <p className="text-sm text-badge-primary/60">Total Orders</p>
            <p className="text-2xl font-semibold text-badge-primary">{orders.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-badge-primary/10">
            <p className="text-sm text-badge-primary/60">Pending</p>
            <p className="text-2xl font-semibold text-badge-secondary">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-badge-primary/10">
            <p className="text-sm text-badge-primary/60">In Progress</p>
            <p className="text-2xl font-semibold text-badge-leaf">
              {orders.filter(o => o.status === 'printing').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-badge-primary/10">
            <p className="text-sm text-badge-primary/60">Completed</p>
            <p className="text-2xl font-semibold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-badge-primary text-white shadow-lg shadow-badge-primary/25'
                : 'bg-white/80 text-badge-primary/70 hover:bg-white border border-badge-primary/10'
            }`}
          >
            All Orders
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'all' ? 'bg-white/20' : 'bg-badge-primary/10'
            }`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('personal')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              categoryFilter === 'personal'
                ? 'bg-badge-leaf text-white shadow-lg shadow-badge-leaf/25'
                : 'bg-white/80 text-badge-leaf hover:bg-white border border-badge-leaf/20'
            }`}
          >
            👤 Personal
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'personal' ? 'bg-white/20' : 'bg-badge-leaf/10'
            }`}>
              {personalCount}
            </span>
          </button>
          <button
            onClick={() => setCategoryFilter('event')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              categoryFilter === 'event'
                ? 'bg-badge-secondary text-white shadow-lg shadow-badge-secondary/25'
                : 'bg-white/80 text-badge-secondary hover:bg-white border border-badge-secondary/20'
            }`}
          >
            🎉 Event
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              categoryFilter === 'event' ? 'bg-white/20' : 'bg-badge-secondary/10'
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
                  ? 'bg-badge-primary text-white' 
                  : 'bg-white/80 text-badge-primary/60 hover:bg-white border border-badge-primary/10'
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
          <div className="text-center py-12 bg-white/80 backdrop-blur rounded-xl border border-badge-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-badge-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-badge-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-badge-primary/70">No orders yet</p>
            <p className="text-badge-primary/50 text-sm mt-1">Orders will appear here when customers complete purchases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white/80 backdrop-blur rounded-xl border border-badge-primary/10 overflow-hidden hover:shadow-md transition-shadow"
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
                        <span className="text-badge-primary font-medium">
                          {order.shipping?.name || order.payment?.payerName || 'Customer'}
                        </span>
                        {order.quantity && (
                          <span className="bg-badge-primary/10 text-badge-primary text-xs px-2 py-0.5 rounded font-medium">
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
                              ? 'bg-badge-leaf/10 text-badge-leaf' 
                              : 'bg-badge-secondary/10 text-badge-secondary'
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
                        <div className="mt-3 pt-3 border-t border-badge-primary/10">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-badge-primary/40 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-xs text-badge-primary/70 flex-grow">
                              <p className="font-medium text-badge-primary">{order.shipping.name}</p>
                              <p>{order.shipping.phone}</p>
                              <p>{order.shipping.address}, {order.shipping.city}</p>
                              {order.shipping.country && order.shipping.country !== 'AE' && (
                                <p className="text-badge-leaf">🌍 International: {order.shipping.country}</p>
                              )}
                              {order.shipping.notes && (
                                <p className="text-badge-primary/50 italic mt-1">Note: {order.shipping.notes}</p>
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
                        {order.designs?.length > 1 ? `Export (${order.designs.length})` : 'Export'}
                      </button>
                      
                      {/* Print Ready Export with bleed/cut lines */}
                      <button
                        onClick={() => exportForPrint(order)}
                        disabled={!order.image && (!order.designs || order.designs.length === 0)}
                        className="text-sm py-2 px-4 rounded-xl bg-gradient-to-r from-badge-primary to-badge-leaf text-white hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Ready
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
          </>
        ) : (
          /* Payouts Section */
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-badge-primary">
              Referrer Payouts
            </h2>

            {/* Payout Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPayoutTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  payoutTab === 'pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/80 text-badge-primary/70 border border-badge-primary/20 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 bg-current rounded-full"></span>
                Pending
                {payouts.filter(p => p.status === 'pending').length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    payoutTab === 'pending' ? 'bg-white/20' : 'bg-amber-500 text-white'
                  }`}>
                    {payouts.filter(p => p.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPayoutTab('processed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  payoutTab === 'processed'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/80 text-badge-primary/70 border border-badge-primary/20 hover:bg-white'
                }`}
              >
                <span className="w-2 h-2 bg-current rounded-full"></span>
                Processed
                {payouts.filter(p => p.status !== 'pending').length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    payoutTab === 'processed' ? 'bg-white/20' : 'bg-green-500 text-white'
                  }`}>
                    {payouts.filter(p => p.status !== 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {payoutsLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 mx-auto border-2 border-badge-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-badge-primary/60">Loading payouts...</p>
              </div>
            ) : payoutTab === 'pending' ? (
              /* Pending Payouts Tab */
              payouts.filter(p => p.status === 'pending').length === 0 ? (
                <div className="text-center py-12 bg-white/80 backdrop-blur rounded-xl border border-badge-primary/10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-badge-primary/60">No pending payout requests</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payouts.filter(p => p.status === 'pending').map(payout => (
                        <div key={payout.id} className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                          {/* Accordion Header */}
                          <button
                            onClick={() => togglePayoutExpanded(payout.id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-100/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono bg-amber-200 text-amber-800 px-2 py-1 rounded">
                                #{payout.id.slice(-8)}
                              </span>
                              <span className="font-medium text-badge-primary">{payout.referrerName}</span>
                              <span className="text-badge-secondary font-bold">{payout.amount.toFixed(2)} AED</span>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-badge-primary/50 transition-transform ${expandedPayouts.has(payout.id) ? 'rotate-180' : ''}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Accordion Content */}
                          {expandedPayouts.has(payout.id) && (
                            <div className="px-4 pb-4 border-t border-amber-200 bg-white/50">
                              <div className="pt-4 grid md:grid-cols-2 gap-4">
                                {/* User Info */}
                                <div>
                                  <p className="text-sm text-badge-primary/60 mb-2">Referrer Details</p>
                                  <p className="font-medium text-badge-primary">{payout.referrerName}</p>
                                  <p className="text-sm text-badge-primary/70">{payout.referrerEmail}</p>
                                  <p className="text-xs text-badge-primary/50 mt-2">
                                    Requested: {new Date(payout.requestedAt).toLocaleString()}
                                  </p>
                                </div>
                                
                                {/* Payment Details */}
                                <div>
                                  <p className="text-sm text-badge-primary/60 mb-2">💳 Payment Details</p>
                                  {payout.paymentMethod === 'paypal' ? (
                                    <div className="text-sm">
                                      <p className="font-medium text-badge-primary">PayPal</p>
                                      <p className="text-badge-primary/70 font-mono">{payout.paymentDetails?.paypalEmail || 'Not provided'}</p>
                                    </div>
                                  ) : payout.paymentMethod === 'bank_transfer' ? (
                                    <div className="text-sm space-y-1">
                                      <p className="font-medium text-badge-primary">Bank Transfer</p>
                                      <p className="text-badge-primary/70">Bank: {payout.paymentDetails?.bankName || 'Not provided'}</p>
                                      <p className="text-badge-primary/70 font-mono text-xs">{payout.paymentDetails?.iban || 'No IBAN'}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-badge-primary/70">{payout.paymentMethod || 'Not specified'}</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-3 mt-4 pt-4 border-t border-amber-100">
                                <button
                                  onClick={() => processPayout(payout.id, 'paid')}
                                  className="px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Mark as Paid
                                </button>
                                <button
                                  onClick={() => processPayout(payout.id, 'rejected', 'Rejected by admin')}
                                  className="px-4 py-2.5 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              )
            ) : (
              /* Processed Payouts Tab */
              payouts.filter(p => p.status !== 'pending').length === 0 ? (
                <div className="text-center py-12 bg-white/80 backdrop-blur rounded-xl border border-badge-primary/10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-badge-primary/60">No processed payouts yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payouts.filter(p => p.status !== 'pending').map(payout => (
                    <div key={payout.id} className={`rounded-xl overflow-hidden ${
                      payout.status === 'paid' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => togglePayoutExpanded(payout.id)}
                        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
                          payout.status === 'paid' ? 'hover:bg-green-100/50' : 'hover:bg-red-100/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono px-2 py-1 rounded ${
                            payout.status === 'paid' 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-200 text-red-800'
                          }`}>
                            #{payout.id.slice(-8)}
                          </span>
                          <span className="font-medium text-badge-primary">{payout.referrerName}</span>
                          <span className="text-badge-primary/70 font-bold">{payout.amount.toFixed(2)} AED</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            payout.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </span>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-badge-primary/50 transition-transform ${expandedPayouts.has(payout.id) ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Accordion Content */}
                      {expandedPayouts.has(payout.id) && (
                        <div className={`px-4 pb-4 border-t ${
                          payout.status === 'paid' ? 'border-green-200 bg-white/50' : 'border-red-200 bg-white/50'
                        }`}>
                          <div className="pt-4 grid md:grid-cols-2 gap-4">
                            {/* User Info */}
                            <div>
                              <p className="text-sm text-badge-primary/60 mb-2">Referrer Details</p>
                              <p className="font-medium text-badge-primary">{payout.referrerName}</p>
                              <p className="text-sm text-badge-primary/70">{payout.referrerEmail}</p>
                              <p className="text-xs text-badge-primary/50 mt-2">
                                Processed: {payout.processedAt ? new Date(payout.processedAt).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                            
                            {/* Payment Details */}
                            <div>
                              <p className="text-sm text-badge-primary/60 mb-2">💳 Payment Details</p>
                              {payout.paymentMethod === 'paypal' ? (
                                <div className="text-sm">
                                  <p className="font-medium text-badge-primary">PayPal</p>
                                  <p className="text-badge-primary/70 font-mono">{payout.paymentDetails?.paypalEmail || 'Not provided'}</p>
                                </div>
                              ) : payout.paymentMethod === 'bank_transfer' ? (
                                <div className="text-sm space-y-1">
                                  <p className="font-medium text-badge-primary">Bank Transfer</p>
                                  <p className="text-badge-primary/70">Bank: {payout.paymentDetails?.bankName || 'Not provided'}</p>
                                  <p className="text-badge-primary/70 font-mono text-xs">{payout.paymentDetails?.iban || 'No IBAN'}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-badge-primary/70">{payout.paymentMethod || 'Not specified'}</p>
                              )}
                            </div>
                          </div>
                          {payout.adminNotes && (
                            <div className="mt-3 pt-3 border-t border-badge-primary/10">
                              <p className="text-xs text-badge-primary/50">Admin Notes: {payout.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard

