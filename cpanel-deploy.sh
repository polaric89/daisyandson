#!/bin/bash
# cPanel Deployment Script
# Builds frontend and prepares files for cPanel upload

set -e

echo "🚀 Preparing files for cPanel deployment..."
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

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Please create .env file with:"
    echo "  VITE_API_URL=https://your-backend-url.com"
    echo "  VITE_PAYPAL_CLIENT_ID=your_paypal_client_id"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Copy .htaccess to dist
echo "📄 Copying .htaccess..."
cp .htaccess dist/

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_DIR="cpanel-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"
cp -r dist/* "$DEPLOY_DIR/"
cp .htaccess "$DEPLOY_DIR/"

echo ""
echo "${GREEN}✅ Build complete!${NC}"
echo ""
echo "📁 Files ready in: $DEPLOY_DIR"
echo ""
echo "Next steps:"
echo "1. Log into cPanel"
echo "2. Open File Manager"
echo "3. Navigate to public_html (or your domain folder)"
echo "4. Upload all files from: $DEPLOY_DIR"
echo "5. Set file permissions:"
echo "   - Folders: 755"
echo "   - Files: 644"
echo ""
echo "Or use FTP/SFTP to upload the $DEPLOY_DIR folder"
echo ""

