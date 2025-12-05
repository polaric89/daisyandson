# 🚀 Deployment Guide for daisyandson.co

This guide will help you deploy your application to a production server and configure your domain and email.

## 📋 Prerequisites

- A VPS/server (DigitalOcean, Linode, AWS EC2, etc.) with Ubuntu 20.04+
- Domain name: `daisyandson.co` (already configured)
- SSH access to your server
- Root or sudo access

## 🔧 Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/daisyandson.co
sudo chown $USER:$USER /var/www/daisyandson.co

# Clone your repository
cd /var/www/daisyandson.co
git clone https://github.com/polaric89/daisyandson.git .

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 3. Environment Variables

Create `.env` file in the root directory:

```bash
cd /var/www/daisyandson.co
nano .env
```

Add the following:

```env
# Production Environment
NODE_ENV=production
PORT=5000

# PayPal Configuration (use LIVE credentials)
VITE_PAYPAL_CLIENT_ID=your_live_paypal_client_id

# API URL
VITE_API_URL=https://daisyandson.co
```

Create `server/.env`:

```bash
cd /var/www/daisyandson.co/server
nano .env
```

```env
PORT=5000
NODE_ENV=production
```

### 4. Build Frontend

```bash
cd /var/www/daisyandson.co
npm run build
```

### 5. Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/daisyandson.co

# Create symlink
sudo ln -s /etc/nginx/sites-available/daisyandson.co /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. Setup SSL Certificate (Let's Encrypt)

```bash
# Obtain SSL certificate
sudo certbot --nginx -d daisyandson.co -d www.daisyandson.co

# Auto-renewal is set up automatically, but test it:
sudo certbot renew --dry-run
```

### 7. Start Application with PM2

```bash
cd /var/www/daisyandson.co

# Create logs directory
mkdir -p logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

### 8. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📧 Email Configuration

### Option 1: Using Your Domain Provider's Email Service

Most domain providers (Namecheap, GoDaddy, etc.) offer email hosting:

1. **Log into your domain registrar**
2. **Navigate to Email/Mail settings**
3. **Create email accounts:**
   - `info@daisyandson.co`
   - `support@daisyandson.co`
4. **Configure email clients** (Gmail, Outlook, etc.) using the provided IMAP/SMTP settings

### Option 2: Using Google Workspace (Recommended)

1. **Sign up for Google Workspace** (paid, ~$6/user/month)
2. **Verify domain ownership** with Google
3. **Add MX records** to your DNS (Google provides these)
4. **Create users:**
   - `info@daisyandson.co`
   - `support@daisyandson.co`

### Option 3: Using Zoho Mail (Free)

1. **Sign up at** https://www.zoho.com/mail/
2. **Add your domain** `daisyandson.co`
3. **Verify domain** by adding DNS records
4. **Create email accounts** for info and support

### DNS Records for Email

Add these MX records in your domain's DNS settings:

**For Google Workspace:**
```
Type: MX
Priority: 1
Host: @
Value: aspmx.l.google.com
```

**For Zoho:**
```
Type: MX
Priority: 10
Host: @
Value: mx.zoho.com
```

## 🔗 GitHub Integration

### Manual Deployment

1. **SSH into your server**
2. **Navigate to app directory**
3. **Pull latest changes:**
   ```bash
   cd /var/www/daisyandson.co
   git pull origin main
   npm install
   cd server && npm install && cd ..
   npm run build
   pm2 restart ecosystem.config.js
   ```

### Automated Deployment with GitHub Actions

1. **Add GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `HOST`: Your server IP address
     - `USERNAME`: Your SSH username
     - `SSH_KEY`: Your private SSH key
     - `PORT`: SSH port (usually 22)
     - `VITE_PAYPAL_CLIENT_ID`: Your PayPal client ID

2. **Push to main branch** - deployment will trigger automatically

### SSH Key Setup

```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id username@your-server-ip

# Test connection
ssh username@your-server-ip
```

## 🔄 Update Server Code

The server needs to serve the frontend build. Update `server/index.js` to add:

```javascript
// Serve static files from React app (add before API routes)
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}
```

## 📊 Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/daisyandson.co.access.log

# Error logs
sudo tail -f /var/log/nginx/daisyandson.co.error.log
```

## 🔒 Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled (disable password auth)
- [ ] Environment variables secured (not in git)
- [ ] Regular backups of `/var/www/daisyandson.co/server/data`
- [ ] PM2 process manager running
- [ ] Nginx security headers configured
- [ ] Regular system updates

## 🆘 Troubleshooting

### Application not starting
```bash
pm2 logs daisyandson-api
# Check for errors
```

### Nginx 502 Bad Gateway
- Check if Node.js app is running: `pm2 status`
- Check if port 5000 is correct
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Certificate Issues
```bash
sudo certbot certificates
sudo certbot renew
```

### Domain not resolving
- Check DNS records: `dig daisyandson.co`
- Verify A record points to your server IP
- Wait for DNS propagation (can take up to 48 hours)

## 📞 Support

For deployment issues, check:
- Server logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs: `/var/www/daisyandson.co/logs/`

---

**Domain:** daisyandson.co  
**Emails:** info@daisyandson.co, support@daisyandson.co  
**Repository:** https://github.com/polaric89/daisyandson

