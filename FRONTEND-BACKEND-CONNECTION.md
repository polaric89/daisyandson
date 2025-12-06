# Frontend-Backend Connection Status

## ✅ Current Setup

### Development Mode
- **Frontend**: Runs on `http://localhost:3000` (Vite dev server)
- **Backend**: PHP API at `http://localhost/php-api`
- **Proxy**: Vite automatically forwards `/api/*` requests to PHP backend

### How It Works
1. Frontend makes request: `fetch('/api/referrer/login')`
2. Vite proxy intercepts it (because it starts with `/api`)
3. Vite forwards to: `http://localhost/php-api/api/referrer/login`
4. PHP backend processes and returns response
5. Frontend receives the response

## ✅ Connection Status

**YES - It's connected!** 

The `vite.config.js` proxy configuration handles the connection automatically in development.

## 🧪 Testing the Connection

1. **Start PHP Backend:**
   - Make sure Apache/MySQL is running
   - Visit: `http://localhost/php-api/api/health`
   - Should see: `{"status":"ok","database":"connected"}`

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test from Frontend:**
   - Open browser console
   - Try logging in as a referrer
   - Check Network tab - you should see requests to `/api/...` being proxied

## 📝 Frontend API Calls

All frontend components use relative paths like:
- `fetch('/api/referrer/login')`
- `fetch('/api/save-design')`
- `fetch('/api/orders')`

These automatically work with the Vite proxy in development!

## 🚀 Production Setup

For production, you'll need to:
1. Build frontend: `npm run build`
2. Upload `dist/` to `public_html/`
3. Update API URL in `.env`:
   ```
   VITE_API_URL=https://api.daisyandson.co
   ```
4. Rebuild: `npm run build`

Or configure your web server to handle API routing.

