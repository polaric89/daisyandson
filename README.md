# 🎨 Photo Badge Designer

A full React web application for designing custom photo badges and pins with:
- Circular image upload, drag, zoom, and crop
- High-resolution print export (2000–3000px PNG)
- PayPal Sandbox checkout integration
- Referral/commission tracking system
- Ready for Shopify or WordPress embedding

![Badge Designer Preview](https://via.placeholder.com/800x400?text=Badge+Designer+Preview)

## ✨ Features

### 🖼️ Badge Designer
- **Image Upload**: Drag & drop or click to upload photos
- **Circle Mask Preview**: 300×300px interactive preview
- **Pan & Zoom**: Drag to position, scroll or slider to zoom
- **Rotation Control**: Rotate images with precision slider
- **Quality Validation**: Minimum 800px requirement for print quality
- **High-DPI Export**: 2000×2000px transparent PNG output

### 💳 PayPal Integration
- PayPal Sandbox support for testing
- Fixed price checkout (AED 29)
- Secure payment processing
- Payment confirmation callbacks

### 🎁 Referral System
- Unique referral link generation
- Click tracking
- 15% commission on sales
- Local and server-side tracking

### 🚀 Deployment Ready
- Vite-powered fast builds
- Embeddable via iframe
- Shopify/WordPress integration ready

## 📁 Project Structure

```
badge-designer/
├── src/
│   ├── components/
│   │   ├── Designer/
│   │   │   ├── CircleBadgeDesigner.jsx  # Main badge editor
│   │   │   └── index.js
│   │   ├── Payment/
│   │   │   ├── PayPalCheckout.jsx       # PayPal integration
│   │   │   └── index.js
│   │   └── Referrals/
│   │       ├── ReferralContext.jsx      # Referral state
│   │       ├── ReferralBanner.jsx       # Share UI
│   │       ├── useReferral.js           # Custom hook
│   │       └── index.js
│   ├── utils/
│   │   └── canvas/
│   │       ├── exportToPng.js           # High-res export
│   │       ├── imageValidation.js       # Quality checks
│   │       └── index.js
│   ├── App.jsx                          # Main app component
│   ├── main.jsx                         # Entry point
│   └── index.css                        # Tailwind styles
├── server/
│   ├── index.js                         # Express API server
│   ├── package.json                     # Server dependencies
│   ├── data/                            # JSON data storage
│   └── uploads/                         # Exported images
├── public/
│   └── badge-icon.svg                   # App icon
├── package.json                         # Frontend dependencies
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind configuration
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/badge-designer.git
   cd badge-designer
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
   cp .env.example .env
   # Edit .env with your PayPal credentials
   ```

5. **Start development servers**

   Terminal 1 - Frontend:
   ```bash
   npm run dev
   ```

   Terminal 2 - Backend:
   ```bash
   npm run server
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💳 PayPal Configuration

### Sandbox Testing

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a Sandbox account
3. Get your Client ID from App Settings
4. Add to `.env`:
   ```
   VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id
   ```

### Production

Replace with your live PayPal Client ID:
```
VITE_PAYPAL_CLIENT_ID=your_live_client_id
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/save-design` | Save exported badge design |
| POST | `/api/save-payment` | Save PayPal payment details |
| POST | `/api/track-referral` | Track referral link clicks |
| POST | `/api/record-conversion` | Record referral sale |
| GET | `/api/referral-stats/:id` | Get referral statistics |
| GET | `/api/designs` | List all designs (admin) |
| GET | `/api/orders` | List all orders (admin) |
| GET | `/api/health` | Server health check |

## 🎯 Usage Flow

1. **Upload Image**: Drag & drop or click to select a photo
2. **Position & Zoom**: Drag to position, use slider or scroll to zoom
3. **Rotate (Optional)**: Adjust rotation with the slider
4. **Export**: Click "Generate Print File" for high-res PNG
5. **Download**: Save the print-ready file locally
6. **Checkout**: Complete payment via PayPal
7. **Share**: Use your referral link to earn commissions

## 🖼️ Embedding in Shopify/WordPress

### Shopify

Add a Custom HTML section with:
```html
<iframe 
  src="https://your-badge-designer-url.com"
  width="100%"
  height="800"
  frameborder="0"
  allow="payment"
></iframe>
```

### WordPress

Use the HTML block or a custom shortcode:
```html
<iframe 
  src="https://your-badge-designer-url.com"
  width="100%"
  height="800"
  frameborder="0"
  allow="payment"
></iframe>
```

## 🔧 Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder, ready for deployment.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
badge: {
  bg: '#1a1a2e',      // Background
  surface: '#16213e', // Card surface
  accent: '#e94560',  // Primary accent
  gold: '#f4d03f',    // Secondary accent
}
```

### Price
Edit the price in `src/App.jsx`:
```jsx
<PayPalCheckout 
  amount="29.00"  // Change price here
  currency="AED"  // Change currency here
  onSuccess={handlePaymentSuccess}
/>
```

### Export Size
Edit export resolution in `src/components/Designer/CircleBadgeDesigner.jsx`:
```javascript
const EXPORT_SIZE = 2000  // Change to 3000 for larger
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📧 Support

For support, email support@badgedesigner.com or open an issue.

---

Built with ❤️ using React, Vite, and TailwindCSS

