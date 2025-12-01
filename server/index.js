/**
 * Badge Designer Backend API
 * 
 * Simple Express server for:
 * - Saving design data and exported images
 * - Storing PayPal payment responses
 * - Tracking referral clicks and commissions
 * 
 * This is a placeholder/scaffold that can be expanded for:
 * - Shopify integration
 * - WordPress plugin API
 * - Full database integration
 * - Courier booking integration
 */

import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import aramex from './services/aramex.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' })) // Large limit for base64 images

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data')
const DESIGNS_FILE = path.join(DATA_DIR, 'designs.json')
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json')
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Initialize JSON files if they don't exist
const initJsonFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
  }
}

initJsonFile(DESIGNS_FILE)
initJsonFile(PAYMENTS_FILE)
initJsonFile(REFERRALS_FILE, { clicks: [], conversions: [], commissions: [] })

// Helper to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

// Helper to write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * POST /api/save-design
 * 
 * Saves the exported badge design(s) and order details
 * Supports both single image (legacy) and multiple designs (new format)
 */
app.post('/api/save-design', async (req, res) => {
  try {
    const { image, designs: designImages, category, quantity, pricing, payment, shipping, referralId, timestamp, status } = req.body

    const orderId = generateId()
    const savedDesigns = []

    // Handle multiple designs (new format)
    if (designImages && Array.isArray(designImages) && designImages.length > 0) {
      for (let i = 0; i < designImages.length; i++) {
        const design = designImages[i]
        if (design.image) {
          const base64Data = design.image.replace(/^data:image\/png;base64,/, '')
          const fileName = `${orderId}-design-${i + 1}.png`
          const imagePath = path.join(UPLOADS_DIR, fileName)
          fs.writeFileSync(imagePath, base64Data, 'base64')
          savedDesigns.push({
            id: design.id,
            image: design.image, // Keep base64 for admin preview
            imagePath: `/uploads/${fileName}`
          })
        }
      }
    }
    // Handle single image (legacy format)
    else if (image) {
      const base64Data = image.replace(/^data:image\/png;base64,/, '')
      const fileName = `${orderId}.png`
      const imagePath = path.join(UPLOADS_DIR, fileName)
      fs.writeFileSync(imagePath, base64Data, 'base64')
      savedDesigns.push({
        id: 1,
        image: image,
        imagePath: `/uploads/${fileName}`
      })
    }

    if (savedDesigns.length === 0) {
      return res.status(400).json({ error: 'No design images provided' })
    }

    // Save order record
    const orders = readJsonFile(DESIGNS_FILE)
    const orderRecord = {
      id: orderId,
      category: category || 'personal',
      designs: savedDesigns,
      quantity: quantity || savedDesigns.length,
      pricing: pricing || null,
      payment: payment || null,
      shipping: shipping || null,
      referralId: referralId || null,
      timestamp: timestamp || new Date().toISOString(),
      status: status || 'pending'
    }
    orders.push(orderRecord)
    writeJsonFile(DESIGNS_FILE, orders)

    console.log('Order saved:', orderId, '- Designs:', savedDesigns.length, '- Quantity:', quantity, '- Shipping:', shipping?.name || 'N/A')

    // If there's a referral, record the conversion
    if (referralId && payment) {
      const referrals = readJsonFile(REFERRALS_FILE)
      referrals.conversions = referrals.conversions || []
      referrals.conversions.push({
        referralId,
        orderId,
        amount: pricing?.total || payment.amount || 29,
        commission: (pricing?.total || payment.amount || 29) * 0.15,
        timestamp: new Date().toISOString()
      })
      writeJsonFile(REFERRALS_FILE, referrals)
    }

    res.json({
      success: true,
      orderId,
      designCount: savedDesigns.length,
      message: 'Order saved successfully'
    })
  } catch (error) {
    console.error('Error saving order:', error)
    res.status(500).json({ error: 'Failed to save order' })
  }
})

/**
 * POST /api/save-payment
 * 
 * Saves PayPal payment response details
 */
app.post('/api/save-payment', async (req, res) => {
  try {
    const paymentData = req.body

    if (!paymentData.orderId) {
      return res.status(400).json({ error: 'No payment order ID provided' })
    }

    const payments = readJsonFile(PAYMENTS_FILE)
    const paymentRecord = {
      ...paymentData,
      id: generateId(),
      savedAt: new Date().toISOString()
    }
    payments.push(paymentRecord)
    writeJsonFile(PAYMENTS_FILE, payments)

    res.json({
      success: true,
      message: 'Payment saved successfully'
    })
  } catch (error) {
    console.error('Error saving payment:', error)
    res.status(500).json({ error: 'Failed to save payment' })
  }
})

/**
 * POST /api/track-referral
 * 
 * Tracks referral link clicks
 */
app.post('/api/track-referral', async (req, res) => {
  try {
    const { referralId, timestamp, source } = req.body

    if (!referralId) {
      return res.status(400).json({ error: 'No referral ID provided' })
    }

    const referrals = readJsonFile(REFERRALS_FILE)
    referrals.clicks = referrals.clicks || []
    referrals.clicks.push({
      referralId,
      timestamp: timestamp || new Date().toISOString(),
      source: source || 'unknown',
      ip: req.ip || 'unknown'
    })
    writeJsonFile(REFERRALS_FILE, referrals)

    res.json({
      success: true,
      message: 'Referral click tracked'
    })
  } catch (error) {
    console.error('Error tracking referral:', error)
    res.status(500).json({ error: 'Failed to track referral' })
  }
})

/**
 * POST /api/record-conversion
 * 
 * Records a referral conversion (sale)
 */
app.post('/api/record-conversion', async (req, res) => {
  try {
    const { referrerId, orderDetails, timestamp } = req.body

    if (!referrerId) {
      return res.status(400).json({ error: 'No referrer ID provided' })
    }

    const referrals = readJsonFile(REFERRALS_FILE)
    referrals.conversions = referrals.conversions || []
    
    const amount = orderDetails?.amount || 29
    const commission = amount * 0.15 // 15% commission

    referrals.conversions.push({
      referrerId,
      orderDetails,
      amount,
      commission,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    })

    // Track commission
    referrals.commissions = referrals.commissions || []
    referrals.commissions.push({
      referrerId,
      amount: commission,
      status: 'pending',
      timestamp: new Date().toISOString()
    })

    writeJsonFile(REFERRALS_FILE, referrals)

    res.json({
      success: true,
      commission,
      message: 'Conversion recorded'
    })
  } catch (error) {
    console.error('Error recording conversion:', error)
    res.status(500).json({ error: 'Failed to record conversion' })
  }
})

/**
 * GET /api/referral-stats/:referralId
 * 
 * Get referral statistics for a user
 */
app.get('/api/referral-stats/:referralId', async (req, res) => {
  try {
    const { referralId } = req.params
    const referrals = readJsonFile(REFERRALS_FILE)

    const clicks = (referrals.clicks || []).filter(c => c.referralId === referralId).length
    const conversions = (referrals.conversions || []).filter(c => c.referrerId === referralId)
    const earnings = conversions.reduce((sum, c) => sum + (c.commission || 0), 0)

    res.json({
      clicks,
      conversions: conversions.length,
      earnings,
      conversionDetails: conversions
    })
  } catch (error) {
    console.error('Error getting referral stats:', error)
    res.status(500).json({ error: 'Failed to get referral stats' })
  }
})

/**
 * GET /api/designs
 * 
 * Get all saved designs (admin endpoint)
 */
app.get('/api/designs', async (req, res) => {
  try {
    const designs = readJsonFile(DESIGNS_FILE)
    res.json(designs)
  } catch (error) {
    console.error('Error getting designs:', error)
    res.status(500).json({ error: 'Failed to get designs' })
  }
})

/**
 * GET /api/orders
 * 
 * Get all orders (admin endpoint)
 */
app.get('/api/orders', async (req, res) => {
  try {
    const designs = readJsonFile(DESIGNS_FILE)
    const payments = readJsonFile(PAYMENTS_FILE)
    
    // Combine designs with payment info
    const orders = designs.map(design => ({
      ...design,
      paymentDetails: payments.find(p => p.orderId === design.payment?.orderId)
    }))

    res.json(orders)
  } catch (error) {
    console.error('Error getting orders:', error)
    res.status(500).json({ error: 'Failed to get orders' })
  }
})

/**
 * GET /api/orders/track/:orderId
 * 
 * Track order by Order ID (public endpoint for customers)
 */
app.get('/api/orders/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const designs = readJsonFile(DESIGNS_FILE)
    
    const order = designs.find(d => d.id === orderId)
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Return order info (without sensitive admin data)
    res.json({
      id: order.id,
      category: order.category,
      quantity: order.quantity,
      pricing: order.pricing,
      timestamp: order.timestamp,
      status: order.status || 'pending',
      designs: order.designs?.map(d => ({ image: d.image })) || [],
      payment: order.payment ? {
        payerName: order.payment.payerName,
        payerEmail: order.payment.payerEmail
      } : null,
      shipping: order.shipping ? {
        name: order.shipping.name,
        phone: order.shipping.phone,
        address: order.shipping.address,
        city: order.shipping.city,
        country: order.shipping.country,
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        cost: order.shipping.cost,
        estimatedDelivery: order.shipping.estimatedDelivery,
        shippedAt: order.shipping.shippedAt
      } : null
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    res.status(500).json({ error: 'Failed to track order' })
  }
})

/**
 * GET /api/orders/track-by-email/:email
 * 
 * Track orders by PayPal email (public endpoint for customers)
 */
app.get('/api/orders/track-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const designs = readJsonFile(DESIGNS_FILE)
    
    // Find the most recent order with this email
    const orders = designs.filter(d => 
      d.payment?.payerEmail?.toLowerCase() === email.toLowerCase()
    )
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this email' })
    }

    // Return the most recent order
    const order = orders[orders.length - 1]

    res.json({
      id: order.id,
      category: order.category,
      quantity: order.quantity,
      pricing: order.pricing,
      timestamp: order.timestamp,
      status: order.status || 'pending',
      designs: order.designs?.map(d => ({ image: d.image })) || [],
      payment: order.payment ? {
        payerName: order.payment.payerName,
        payerEmail: order.payment.payerEmail
      } : null,
      shipping: order.shipping ? {
        name: order.shipping.name,
        phone: order.shipping.phone,
        address: order.shipping.address,
        city: order.shipping.city,
        country: order.shipping.country,
        trackingNumber: order.shipping.trackingNumber,
        carrier: order.shipping.carrier,
        cost: order.shipping.cost,
        estimatedDelivery: order.shipping.estimatedDelivery,
        shippedAt: order.shipping.shippedAt
      } : null
    })
  } catch (error) {
    console.error('Error tracking order by email:', error)
    res.status(500).json({ error: 'Failed to track order' })
  }
})

/**
 * PATCH /api/orders/:id/status
 * 
 * Update order status (admin endpoint)
 */
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const validStatuses = ['pending', 'printing', 'shipped', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const designs = readJsonFile(DESIGNS_FILE)
    const orderIndex = designs.findIndex(d => d.id === id)

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' })
    }

    designs[orderIndex].status = status
    designs[orderIndex].updatedAt = new Date().toISOString()
    writeJsonFile(DESIGNS_FILE, designs)

    res.json({
      success: true,
      message: 'Order status updated',
      order: designs[orderIndex]
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

/**
 * DELETE /api/orders/:id
 * 
 * Delete an order (admin endpoint)
 */
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params

    const designs = readJsonFile(DESIGNS_FILE)
    const orderIndex = designs.findIndex(d => d.id === id)

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Get the order to delete its image files
    const order = designs[orderIndex]
    
    // Delete associated image files
    if (order.designs && order.designs.length > 0) {
      order.designs.forEach(design => {
        if (design.imagePath) {
          const filePath = path.join(__dirname, design.imagePath)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }
      })
    }

    // Remove from array
    designs.splice(orderIndex, 1)
    writeJsonFile(DESIGNS_FILE, designs)

    console.log('Order deleted:', id)

    res.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

/**
 * GET /api/orders/:id
 * 
 * Get single order (admin endpoint)
 */
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    const designs = readJsonFile(DESIGNS_FILE)
    const order = designs.find(d => d.id === id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Error getting order:', error)
    res.status(500).json({ error: 'Failed to get order' })
  }
})

// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Badge Designer API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      saveDesign: 'POST /api/save-design',
      savePayment: 'POST /api/save-payment',
      trackReferral: 'POST /api/track-referral',
      recordConversion: 'POST /api/record-conversion',
      referralStats: 'GET /api/referral-stats/:id',
      designs: 'GET /api/designs',
      orders: 'GET /api/orders',
      health: 'GET /api/health',
      shippingRates: 'GET /api/shipping/rates',
      shippingCalculate: 'POST /api/shipping/calculate',
      shippingCreate: 'POST /api/shipping/create',
      shippingTrack: 'GET /api/shipping/track/:trackingNumber'
    }
  })
})

// ============================================
// SHIPPING ENDPOINTS (Aramex Integration)
// ============================================

/**
 * GET /api/shipping/rates
 * 
 * Get available shipping rates (static fallback rates)
 */
app.get('/api/shipping/rates', (req, res) => {
  res.json({
    success: true,
    rates: aramex.SHIPPING_RATES
  })
})

/**
 * POST /api/shipping/calculate
 * 
 * Calculate shipping rate for a destination
 */
app.post('/api/shipping/calculate', async (req, res) => {
  try {
    const { destination, shipmentDetails } = req.body

    if (!destination || !destination.countryCode) {
      return res.status(400).json({ error: 'Destination country is required' })
    }

    // Try Aramex API first, fallback to static rates
    const result = await aramex.calculateRate(destination, shipmentDetails || {})
    
    if (result.success) {
      res.json(result)
    } else {
      // Fallback to static rates
      const fallbackRate = aramex.getShippingRate(destination.countryCode)
      res.json({
        success: true,
        ...fallbackRate,
        totalAmount: fallbackRate.price,
        isEstimate: true
      })
    }
  } catch (error) {
    console.error('Shipping calculation error:', error)
    res.status(500).json({ error: 'Failed to calculate shipping' })
  }
})

/**
 * POST /api/shipping/create
 * 
 * Create a shipment for an order
 */
app.post('/api/shipping/create', async (req, res) => {
  try {
    const { orderId, recipient } = req.body

    if (!orderId || !recipient) {
      return res.status(400).json({ error: 'Order ID and recipient are required' })
    }

    // Get order details
    const designs = readJsonFile(DESIGNS_FILE)
    const order = designs.find(d => d.id === orderId)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Create shipment with Aramex
    const result = await aramex.createShipment(order, recipient)

    if (result.success) {
      // Update order with tracking number
      const orderIndex = designs.findIndex(d => d.id === orderId)
      designs[orderIndex].shipping = {
        ...designs[orderIndex].shipping,
        trackingNumber: result.trackingNumber,
        labelUrl: result.labelUrl,
        carrier: 'Aramex',
        shippedAt: new Date().toISOString()
      }
      designs[orderIndex].status = 'shipped'
      writeJsonFile(DESIGNS_FILE, designs)

      res.json({
        success: true,
        trackingNumber: result.trackingNumber,
        labelUrl: result.labelUrl
      })
    } else {
      res.status(400).json({ error: result.error })
    }
  } catch (error) {
    console.error('Shipment creation error:', error)
    res.status(500).json({ error: 'Failed to create shipment' })
  }
})

/**
 * GET /api/shipping/track/:trackingNumber
 * 
 * Track a shipment
 */
app.get('/api/shipping/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params

    const result = await aramex.trackShipment(trackingNumber)

    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json({ error: result.error })
    }
  } catch (error) {
    console.error('Shipment tracking error:', error)
    res.status(500).json({ error: 'Failed to track shipment' })
  }
})

/**
 * GET /api/shipping/rate/:countryCode
 * 
 * Get shipping rate by country code (simple lookup)
 */
app.get('/api/shipping/rate/:countryCode', (req, res) => {
  const { countryCode } = req.params
  const rate = aramex.getShippingRate(countryCode.toUpperCase())
  
  res.json({
    success: true,
    countryCode: countryCode.toUpperCase(),
    ...rate
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎨 Badge Designer API Server                        ║
║                                                       ║
║   Server running on: http://localhost:${PORT}           ║
║                                                       ║
║   Endpoints:                                          ║
║   POST /api/save-design     - Save badge design       ║
║   POST /api/save-payment    - Save payment details    ║
║   POST /api/track-referral  - Track referral click    ║
║   POST /api/record-conversion - Record sale           ║
║   GET  /api/referral-stats/:id - Get ref stats        ║
║   GET  /api/designs         - List all designs        ║
║   GET  /api/orders          - List all orders         ║
║   GET  /api/health          - Health check            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
})

export default app

