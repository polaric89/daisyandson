#!/bin/bash
# Email Setup Helper Script for daisyandson.co
# This script helps you configure email forwarding or setup

echo "📧 Email Setup for daisyandson.co"
echo "=================================="
echo ""
echo "You need to configure email for:"
echo "  - info@daisyandson.co"
echo "  - support@daisyandson.co"
echo ""
echo "Choose your email provider:"
echo "1. Google Workspace (Recommended, Paid ~\$6/month)"
echo "2. Zoho Mail (Free tier available)"
echo "3. Your domain registrar's email service"
echo "4. Custom SMTP server"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "📋 Google Workspace Setup:"
    echo "1. Sign up at: https://workspace.google.com/"
    echo "2. Choose 'Get Started' and select your domain"
    echo "3. Verify domain ownership"
    echo "4. Add these MX records in your DNS:"
    echo ""
    echo "   Priority: 1  |  Host: @  |  Value: aspmx.l.google.com"
    echo "   Priority: 5  |  Host: @  |  Value: alt1.aspmx.l.google.com"
    echo "   Priority: 5  |  Host: @  |  Value: alt2.aspmx.l.google.com"
    echo "   Priority: 10 |  Host: @  |  Value: alt3.aspmx.l.google.com"
    echo "   Priority: 10 |  Host: @  |  Value: alt4.aspmx.l.google.com"
    echo ""
    echo "5. Create users: info@daisyandson.co and support@daisyandson.co"
    ;;
  2)
    echo ""
    echo "📋 Zoho Mail Setup:"
    echo "1. Sign up at: https://www.zoho.com/mail/"
    echo "2. Add your domain: daisyandson.co"
    echo "3. Verify domain ownership"
    echo "4. Add these MX records in your DNS:"
    echo ""
    echo "   Priority: 10 |  Host: @  |  Value: mx.zoho.com"
    echo "   Priority: 20 |  Host: @  |  Value: mx2.zoho.com"
    echo ""
    echo "5. Add TXT record for SPF:"
    echo "   Type: TXT | Host: @ | Value: v=spf1 include:zoho.com ~all"
    echo ""
    echo "6. Create mailboxes: info@daisyandson.co and support@daisyandson.co"
    ;;
  3)
    echo ""
    echo "📋 Domain Registrar Email Setup:"
    echo "1. Log into your domain registrar (Namecheap, GoDaddy, etc.)"
    echo "2. Navigate to Email/Mail settings"
    echo "3. Create email accounts:"
    echo "   - info@daisyandson.co"
    echo "   - support@daisyandson.co"
    echo "4. Configure email client with provided IMAP/SMTP settings"
    ;;
  4)
    echo ""
    echo "📋 Custom SMTP Setup:"
    echo "You'll need to configure your application to use SMTP."
    echo "Common SMTP providers:"
    echo "  - SendGrid"
    echo "  - Mailgun"
    echo "  - Amazon SES"
    echo "  - Postmark"
    echo ""
    echo "Add SMTP credentials to your .env file:"
    echo "  SMTP_HOST=your-smtp-host"
    echo "  SMTP_PORT=587"
    echo "  SMTP_USER=your-username"
    echo "  SMTP_PASS=your-password"
    echo "  SMTP_FROM=info@daisyandson.co"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ After setup, test your email:"
echo "   Send a test email to info@daisyandson.co"
echo "   Send a test email to support@daisyandson.co"
echo ""
echo "📝 Note: DNS changes can take up to 48 hours to propagate"

