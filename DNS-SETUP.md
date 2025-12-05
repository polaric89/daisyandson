# 🌐 DNS Configuration for daisyandson.co

This guide will help you configure DNS records for your domain to point to your server and set up email.

## 📍 Required DNS Records

### 1. A Record (Point Domain to Server)

Add an A record to point your domain to your server's IP address:

```
Type: A
Host: @
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600 (or Auto)
```

**Example:**
```
Type: A
Host: @
Value: 192.0.2.1
TTL: 3600
```

### 2. A Record for WWW (Optional but Recommended)

```
Type: A
Host: www
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600
```

### 3. CNAME Record (Alternative to WWW A Record)

Instead of a WWW A record, you can use a CNAME:

```
Type: CNAME
Host: www
Value: daisyandson.co
TTL: 3600
```

## 📧 Email DNS Records

### Option 1: Google Workspace

Add these MX (Mail Exchange) records:

```
Priority: 1   |  Host: @  |  Value: aspmx.l.google.com
Priority: 5   |  Host: @  |  Value: alt1.aspmx.l.google.com
Priority: 5   |  Host: @  |  Value: alt2.aspmx.l.google.com
Priority: 10  |  Host: @  |  Value: alt3.aspmx.l.google.com
Priority: 10  |  Host: @  |  Value: alt4.aspmx.l.google.com
```

Add TXT record for SPF:
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.google.com ~all
```

Add TXT record for DKIM (Google will provide this):
```
Type: TXT
Host: google._domainkey
Value: [Provided by Google Workspace]
```

### Option 2: Zoho Mail

Add MX records:
```
Priority: 10  |  Host: @  |  Value: mx.zoho.com
Priority: 20  |  Host: @  |  Value: mx2.zoho.com
```

Add TXT record for SPF:
```
Type: TXT
Host: @
Value: v=spf1 include:zoho.com ~all
```

Add TXT record for DKIM (Zoho will provide this):
```
Type: TXT
Host: zmail._domainkey
Value: [Provided by Zoho]
```

### Option 3: Domain Registrar Email

Your registrar will provide specific MX records. Common examples:

**Namecheap:**
```
Priority: 10  |  Host: @  |  Value: mail.privateemail.com
```

**GoDaddy:**
```
Priority: 0   |  Host: @  |  Value: smtp.secureserver.net
Priority: 10  |  Host: @  |  Value: mailstore1.secureserver.net
```

## 🔒 SSL Certificate (Let's Encrypt)

After setting up your A record, Certbot will automatically configure DNS verification. No manual DNS records needed for SSL.

## 📝 Complete DNS Record Summary

Here's a complete example for a typical setup:

```
# Domain pointing
A      @              YOUR_SERVER_IP     3600
A      www            YOUR_SERVER_IP     3600
# OR
CNAME  www            daisyandson.co     3600

# Email (Google Workspace example)
MX     @              1  aspmx.l.google.com
MX     @              5  alt1.aspmx.l.google.com
MX     @              5  alt2.aspmx.l.google.com
MX     @              10 alt3.aspmx.l.google.com
MX     @              10 alt4.aspmx.l.google.com
TXT    @              v=spf1 include:_spf.google.com ~all
```

## ✅ Verification

After adding DNS records:

1. **Check A Record:**
   ```bash
   dig daisyandson.co +short
   # Should return your server IP
   ```

2. **Check MX Records:**
   ```bash
   dig daisyandson.co MX +short
   # Should return your email server records
   ```

3. **Check DNS Propagation:**
   - Use https://dnschecker.org/
   - Enter your domain and check A and MX records globally

4. **Test Email:**
   - Send a test email to info@daisyandson.co
   - Send a test email to support@daisyandson.co

## ⏱️ DNS Propagation Time

- **A Records:** Usually 5 minutes to 1 hour
- **MX Records:** Usually 15 minutes to 4 hours
- **Full Global Propagation:** Can take up to 48 hours

## 🆘 Troubleshooting

### Domain not resolving
- Wait for DNS propagation (up to 48 hours)
- Check if A record is correct: `dig daisyandson.co`
- Clear your DNS cache: `sudo systemd-resolve --flush-caches` (Linux)

### Email not working
- Verify MX records: `dig daisyandson.co MX`
- Check SPF record: `dig daisyandson.co TXT`
- Wait for MX record propagation (can take longer than A records)

### SSL certificate issues
- Ensure A record is pointing correctly
- Wait for DNS propagation before running Certbot
- Check: `sudo certbot certificates`

---

**Domain:** daisyandson.co  
**Emails:** info@daisyandson.co, support@daisyandson.co

