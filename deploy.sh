#!/bin/bash
# Quick Deployment Script
# Run this on your server after initial setup

set -e

echo "🚀 Deploying daisyandson.co..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install
cd server && npm install && cd ..

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

echo ""
echo "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Check status: pm2 status"
echo "View logs: pm2 logs"
echo ""

