# 🚀 Backend Deployment Guide

Since your frontend is on cPanel (shared hosting), deploy the backend to a free Node.js hosting service.

## 🎯 Recommended: Railway.app (Easiest)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your `daisyandson` repository
3. Railway will auto-detect it's a Node.js app

### Step 3: Configure
1. **Set Root Directory:** `server`
2. **Set Start Command:** `node index.js`
3. **Set Node Version:** 18+

### Step 4: Environment Variables
Add these in Railway dashboard → Variables:
```
NODE_ENV=production
PORT=5000
```

### Step 5: Get Your URL
1. Railway will assign a URL like: `https://daisyandson-production.up.railway.app`
2. Copy this URL
3. Update your frontend `.env`:
   ```
   VITE_API_URL=https://daisyandson-production.up.railway.app
   ```

### Step 6: Custom Domain (Optional)
1. In Railway → Settings → Domains
2. Add custom domain: `api.daisyandson.co`
3. Add CNAME record in Namecheap DNS:
   ```
   Type: CNAME
   Host: api
   Value: [Railway provided value]
   ```

## 🎯 Alternative: Render.com

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `daisyandson-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Environment:** Node 18

### Step 3: Environment Variables
Add in Render dashboard:
```
NODE_ENV=production
PORT=10000
```

### Step 4: Get Your URL
- Render URL: `https://daisyandson-api.onrender.com`
- Update frontend `.env` with this URL

## 🔄 Auto-Deploy

Both Railway and Render auto-deploy when you push to your `main` branch!

## 📊 Monitoring

- **Railway:** Dashboard shows logs, metrics, and deployments
- **Render:** Dashboard shows logs and deployment history

## 💰 Free Tier Limits

**Railway:**
- $5 free credit/month
- Sleeps after inactivity (wakes on request)

**Render:**
- Free tier available
- Sleeps after 15 minutes inactivity
- Wakes up on first request (may take 30-60 seconds)

**Recommendation:** Railway is faster and more reliable for free tier.

## 🆘 Troubleshooting

### Backend not starting
- Check logs in Railway/Render dashboard
- Verify `server/package.json` has correct start script
- Ensure Node.js version is 18+

### CORS errors
- Backend already has CORS enabled
- Verify `VITE_API_URL` in frontend matches backend URL exactly

### 404 on API routes
- Check backend is running (not sleeping)
- Verify API URL in frontend `.env`
- Check Railway/Render logs for errors

---

**Next:** Follow `CPANEL-DEPLOYMENT.md` to deploy frontend to cPanel.

