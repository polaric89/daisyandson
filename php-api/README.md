# Badge Designer PHP API

This is the PHP + MySQL version of the backend API, converted from Node.js.

## Status

✅ **ALL ENDPOINTS COMPLETED!**

- ✅ Database schema
- ✅ Config file with database connection
- ✅ Router/index.php
- ✅ All API endpoints created and working

## Structure

```
php-api/
├── config.php              # Database config & helpers
├── index.php              # Main router
├── helpers.php            # Helper functions
├── .htaccess             # Apache configuration
├── database/
│   └── schema.sql        # Database schema
├── endpoints/            # API endpoint files
│   ├── health.php        ✅
│   ├── save-design.php   ✅
│   ├── save-payment.php  ✅
│   ├── get-orders.php    ✅
│   ├── get-designs.php   ✅
│   ├── track-order.php   ✅
│   ├── update-order-status.php ✅
│   ├── delete-order.php  ✅
│   ├── track-referral.php ✅
│   ├── record-conversion.php ✅
│   ├── referral-stats.php ✅
│   ├── referrer-register.php ✅
│   ├── referrer-login.php ✅
│   ├── referrer-dashboard.php ✅
│   ├── referrer-request-payout.php ✅
│   ├── referrer-update-payment.php ✅
│   ├── admin-referrers.php ✅
│   ├── admin-payouts.php ✅
│   ├── admin-process-payout.php ✅
│   ├── shipping-rates.php ✅
│   ├── shipping-calculate.php ✅
│   ├── shipping-create.php ✅
│   └── shipping-track.php ✅
├── uploads/              # Uploaded images (create this folder)
└── LOCAL-SETUP.md        # Setup instructions
```

## Quick Start

1. **Setup Database:**
   - Create database `badge_designer` in phpMyAdmin
   - Import `database/schema.sql`

2. **Configure:**
   - Update `config.php` with your database credentials

3. **Test:**
   - Visit: `http://localhost/php-api/api/health`

## All Endpoints Available

### Orders & Designs
- `POST /api/save-design` - Save badge design and order
- `GET /api/designs` - Get all designs (admin)
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/track/:id` - Track order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Payments
- `POST /api/save-payment` - Save payment details

### Referrals
- `POST /api/track-referral` - Track referral click
- `POST /api/record-conversion` - Record referral sale
- `GET /api/referral-stats/:id` - Get referral stats

### Referrer System
- `POST /api/referrer/register` - Register as referrer
- `POST /api/referrer/login` - Login as referrer
- `GET /api/referrer/:id/dashboard` - Get referrer dashboard
- `POST /api/referrer/:id/request-payout` - Request payout
- `PUT /api/referrer/:id/payment-details` - Update payment details

### Admin
- `GET /api/admin/referrers` - Get all referrers
- `GET /api/admin/payouts` - Get all payouts
- `PUT /api/admin/payouts/:id` - Process payout (approve/reject)

### Shipping
- `GET /api/shipping/rates` - Get shipping rates
- `POST /api/shipping/calculate` - Calculate shipping cost
- `POST /api/shipping/create` - Create shipment
- `GET /api/shipping/track/:id` - Track shipment

**All endpoints are ready to use!** 🎉

