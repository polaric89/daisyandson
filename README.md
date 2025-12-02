# 🌼 Daisy & Son Co.

A premium custom badge and pin designer web application built with React. Create beautiful 58mm photo badges for personal use or events.

![Daisy & Son Co.](public/images/ds_logo.png)

## ✨ Features

### 🎨 Badge Designer
- **Easy Image Upload**: Drag & drop or click to upload photos
- **Circle Preview**: Interactive 300×300px circular preview
- **Pan & Zoom**: Drag to position, scroll or slider to zoom
- **Rotation Control**: Precise rotation adjustment
- **Multi-Design Support**: Create multiple unique badge designs in one order
- **High-DPI Export**: 2000×2000px print-ready PNG output

### 🛒 Order Types
- **Personal Orders**: Multiple unique designs with tiered pricing
  - 1-4 badges: 20 AED each
  - 5-9 badges: 17 AED each
  - 10+ badges: 15 AED each
- **Event Orders**: Same design, multiple copies
  - Minimum 15 pieces: 13 AED each
  - Perfect for parties, weddings, corporate events

### 💳 Payment & Checkout
- Secure PayPal integration
- Real-time shipping cost calculation
- Support for UAE and international shipping via Aramex

### 📦 Order Management
- **Order Tracking**: Customers can track orders by Order ID
- **Admin Dashboard**: Manage orders, update statuses, export designs
- **Aramex Integration**: Create shipments and track deliveries

### 📄 Legal Pages
- Terms of Service
- Privacy Policy
- Comprehensive FAQ

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Teal) | `#3d5a5a` | Main brand color |
| Secondary (Gold) | `#c9a86c` | Accents, CTAs |
| Leaf | `#536b6b` | Gradients |
| Rose | `#9c7b70` | Subtle accents |
| Cream | `#fdfcfa` | Backgrounds |
| Beige | `#f5f0e8` | Surfaces |

### Typography
- **Font**: Outfit (Google Fonts)
- Clean, modern sans-serif with thin to bold weights

## 📁 Project Structure

```
daisy-and-son/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx    # Order management
│   │   │   └── AdminLogin.jsx        # Admin authentication
│   │   ├── CategoryModal/
│   │   │   └── CategoryModal.jsx     # Personal/Event selection
│   │   ├── Designer/
│   │   │   ├── CircleBadgeDesigner.jsx
│   │   │   └── MultiDesignManager.jsx
│   │   ├── Landing/
│   │   │   └── LandingPage.jsx       # Homepage
│   │   ├── Legal/
│   │   │   ├── TermsOfService.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   └── FAQ.jsx
│   │   ├── OrderTracking/
│   │   │   └── OrderTracking.jsx     # Customer order tracking
│   │   ├── Payment/
│   │   │   └── PayPalCheckout.jsx
│   │   └── Referrals/
│   │       ├── ReferralBanner.jsx
│   │       ├── ReferralContext.jsx
│   │       └── useReferral.js
│   ├── utils/
│   │   └── canvas/
│   │       ├── exportToPng.js
│   │       └── imageValidation.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── index.js                      # Express API
│   ├── services/
│   │   └── aramex.js                 # Shipping integration
│   ├── data/                         # JSON storage
│   └── uploads/                      # Design exports
├── public/
│   └── images/
│       ├── ds_logo.png               # Main logo
│       └── ds_icon.png               # Favicon
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/polaric89/daisyandson.git
   cd daisyandson
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your PayPal credentials
   ```

5. **Start development servers**

   Terminal 1 - Backend:
   ```bash
   cd server
   npm start
   ```

   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/save-design` | Save order with designs |
| GET | `/api/orders` | List all orders (admin) |
| GET | `/api/orders/track/:id` | Track order by ID |
| PATCH | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

### Shipping
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipping/rate/:country` | Get shipping rate |
| POST | `/api/shipping/create` | Create Aramex shipment |

### Referrals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/track-referral` | Track referral click |
| POST | `/api/record-conversion` | Record referral sale |
| GET | `/api/referral-stats/:id` | Get referral stats |

## 🎯 User Flow

### For Customers
1. **Landing Page**: Browse features and pricing
2. **Select Category**: Choose Personal or Event
3. **Design Badges**: Upload and position images
4. **Enter Details**: Add shipping information
5. **Checkout**: Pay securely via PayPal
6. **Track Order**: Monitor order status and shipping

### For Admins
1. Navigate to `/admin`
2. Login with admin credentials
3. View and manage orders
4. Export badge designs for printing
5. Create Aramex shipments
6. Update order statuses

## 🔧 Configuration

### PayPal Setup
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a Sandbox/Live app
3. Add Client ID to environment:
   ```
   VITE_PAYPAL_CLIENT_ID=your_client_id
   ```

### Customization

**Colors** - Edit `tailwind.config.js`:
```javascript
badge: {
  primary: '#3d5a5a',    // Dark teal
  secondary: '#c9a86c',  // Gold
  leaf: '#536b6b',       // Muted teal
  rose: '#9c7b70',       // Dusty rose
  cream: '#fdfcfa',      // Background
  beige: '#f5f0e8',      // Surface
}
```

**Pricing** - Edit pricing logic in `MultiDesignManager.jsx`

**Badge Size** - Edit export size in `CircleBadgeDesigner.jsx`:
```javascript
const EXPORT_SIZE = 2000  // pixels
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

Deploy the `dist/` folder to your hosting provider.

## 📱 Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page with features |
| Designer | `/` (after category) | Badge design tool |
| Track Order | Click "Track Order" | Order tracking |
| Terms | Click "Terms" | Terms of Service |
| Privacy | Click "Privacy" | Privacy Policy |
| FAQ | Click "FAQ" | Frequently Asked Questions |
| Admin | `/admin` | Admin dashboard |

## 📧 Support

For support, email support@daisyandson.com

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ by Daisy & Son Co. using React, Vite, and TailwindCSS
