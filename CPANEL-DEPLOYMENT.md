# 🚀 cPanel Deployment Guide for daisyandson.co

This guide is specifically for **Namecheap Stellar Shared Hosting with cPanel**.

## ⚠️ Important Considerations

Shared hosting has limitations:
- ❌ No long-running Node.js processes (PM2 not available)
- ❌ No direct server access (SSH may be limited)
- ✅ Static files work perfectly
- ✅ cPanel File Manager for uploads
- ✅ Email hosting included

## 🎯 Recommended Approach: Hybrid Deployment

**Best Solution:** Deploy frontend to cPanel, backend to a free Node.js hosting service.

### Option 1: Frontend on cPanel + Backend on Railway/Render (Recommended)

This is the easiest and most reliable approach.

#### Step 1: Deploy Backend to Railway or Render

1. **Sign up for free hosting:**
   - [Railway.app](https://railway.app) - Free tier available
   - [Render.com](https://render.com) - Free tier available
   - [Fly.io](https://fly.io) - Free tier available

2. **Connect your GitHub repository**

3. **Set environment variables:**
   ```
   NODE_ENV=production
   PORT=5000
   ```

4. **Deploy the `server` folder** (or configure root directory)

5. **Get your backend URL:** `https://your-app.railway.app` or `https://your-app.onrender.com`

#### Step 2: Deploy Frontend to cPanel

1. **Build your frontend locally:**
   ```bash
   npm run build
   ```

2. **Update API URL in `.env`:**
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. **Upload to cPanel:**
   - Log into cPanel
   - Go to **File Manager**
   - Navigate to `public_html` (or your domain's root folder)
   - Upload all files from the `dist` folder
   - Make sure `index.html` is in the root

5. **Create `.htaccess` file** (for React routing):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 2: Use cPanel Node.js App (If Available)

Some Namecheap plans include Node.js support. Check if yours does:

1. **In cPanel, look for "Node.js" or "Node.js Selector"**

2. **If available:**
   - Create a new Node.js app
   - Set the application root to your `server` folder
   - Set startup file to `index.js`
   - Set Node.js version to 18+
   - Set application URL (e.g., `api.daisyandson.co` or subdomain)

3. **Upload your files:**
   - Upload entire project via File Manager or Git
   - Install dependencies via cPanel terminal or SSH

4. **Update frontend `.env`:**
   ```env
   VITE_API_URL=https://api.daisyandson.co
   ```

### Option 3: Full cPanel Deployment (Advanced)

If you want everything on cPanel and have Node.js support:

1. **Upload entire project to cPanel**
   - Use File Manager or Git
   - Place in `public_html` or a subdirectory

2. **Install dependencies via cPanel Terminal:**
   ```bash
   cd ~/public_html
   npm install
   cd server
   npm install
   ```

3. **Build frontend:**
   ```bash
   cd ~/public_html
   npm run build
   ```

4. **Configure Node.js app in cPanel:**
   - Point to `server` folder
   - Set startup file: `index.js`
   - Configure subdomain or path for API

5. **Update `.htaccess` for frontend routing**

## 📁 File Structure on cPanel

```
public_html/
├── index.html          (from dist/)
├── assets/             (from dist/assets/)
├── .htaccess          (for React routing)
└── server/             (if using Option 2 or 3)
    ├── index.js
    ├── data/
    └── uploads/
```

## 🔧 Configuration Steps

### 1. Update Frontend API URL

Before building, update your `.env` file:

```env
VITE_API_URL=https://your-backend-url.railway.app
# OR
VITE_API_URL=https://api.daisyandson.co
# OR (if same domain)
VITE_API_URL=https://daisyandson.co
```

### 2. Build Frontend

```bash
npm run build
```

### 3. Upload via cPanel File Manager

1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain folder)
4. Delete old files (if any)
5. Upload all contents from `dist` folder
6. Upload `.htaccess` file

### 4. Set File Permissions

- Folders: `755`
- Files: `644`
- `.htaccess`: `644`

## 📧 Email Setup (Namecheap)

Namecheap includes email hosting:

1. **In cPanel, go to "Email Accounts"**
2. **Create email accounts:**
   - `info@daisyandson.co`
   - `support@daisyandson.co`
3. **Set passwords**
4. **Access via:**
   - Webmail: `https://webmail.daisyandson.co`
   - Or configure in email client (Gmail, Outlook, etc.)

## 🌐 Domain Configuration

### Point Domain to Namecheap

1. **In Namecheap account:**
   - Go to Domain List
   - Click "Manage" next to `daisyandson.co`
   - Under "Nameservers", select "Namecheap BasicDNS"

2. **In cPanel:**
   - Go to "Addon Domains" or "Parked Domains"
   - Add `daisyandson.co`
   - Point to `public_html` or subdirectory

### SSL Certificate

1. **In cPanel, go to "SSL/TLS Status"**
2. **Install Let's Encrypt SSL** (free)
3. **Enable "Force HTTPS Redirect"**

## 🔄 Updating Your Site

### Manual Update Process:

1. **Pull latest code locally:**
   ```bash
   git pull origin main
   npm install
   npm run build
   ```

2. **Upload new `dist` files to cPanel:**
   - Delete old files in `public_html`
   - Upload new files from `dist`

3. **If backend changed:**
   - Update on Railway/Render (auto-deploys if connected to GitHub)
   - Or update via cPanel if using Node.js app

## 🆘 Troubleshooting

### 404 Errors on Routes

- Ensure `.htaccess` file is uploaded
- Check file permissions (644)
- Verify mod_rewrite is enabled (contact support if not)

### API Not Working

- Check CORS settings in backend
- Verify API URL in frontend `.env`
- Check backend is running (Railway/Render dashboard)

### Build Errors

- Ensure Node.js 18+ is installed locally
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### File Upload Issues

- Check folder permissions (755 for directories)
- Verify `server/uploads` folder exists and is writable

## 📊 Recommended Setup Summary

**Best Practice:**
- ✅ Frontend: cPanel (`public_html`)
- ✅ Backend: Railway.app or Render.com (free tier)
- ✅ Email: Namecheap email hosting
- ✅ Domain: Namecheap DNS

**Why this works:**
- Frontend is just static files (perfect for shared hosting)
- Backend runs on proper Node.js hosting (reliable, scalable)
- Email included with hosting
- Cost-effective and easy to maintain

## 🔗 Quick Links

- **Railway.app:** https://railway.app
- **Render.com:** https://render.com
- **Namecheap cPanel:** https://cpanel.net (your hosting URL)
- **Namecheap Email:** https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-create-an-email-account-in-cpanel/

---

**Domain:** daisyandson.co  
**Emails:** info@daisyandson.co, support@daisyandson.co

