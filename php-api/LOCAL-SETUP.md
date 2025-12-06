# PHP API - Local Setup Guide

## Prerequisites

- XAMPP, WAMP, or MAMP installed (PHP 7.4+ and MySQL)
- phpMyAdmin running
- Your frontend React app

## Step 1: Setup Database

1. Open **phpMyAdmin** (usually at `http://localhost/phpmyadmin`)
2. Click **New** to create a database
3. Name it: `badge_designer`
4. Click **Create**
5. Select the `badge_designer` database
6. Click **Import** tab
7. Choose file: `database/schema.sql`
8. Click **Go**

## Step 2: Configure Database Connection

1. Open `config.php`
2. Update these lines if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'badge_designer');
   define('DB_USER', 'root');      // Usually 'root' for local
   define('DB_PASS', '');          // Usually empty for local
   ```
3. Update base URL:
   ```php
   define('BASE_URL', 'http://localhost/php-api');
   ```

## Step 3: Copy PHP API Files

1. Copy the entire `php-api` folder to:
   - **XAMPP**: `C:\xampp\htdocs\php-api\`
   - **WAMP**: `C:\wamp64\www\php-api\`
   - **MAMP**: `/Applications/MAMP/htdocs/php-api/`

## Step 4: Set Permissions

1. Create `uploads` folder inside `php-api` (if it doesn't exist)
2. Make sure the folder is writable (usually it is on local)

## Step 5: Test the API

1. Start Apache and MySQL in XAMPP/WAMP/MAMP
2. Open browser: `http://localhost/php-api/api/health`
3. Should see: `{"status":"ok","timestamp":"...","database":"connected"}`

## Step 6: Update Frontend

Update your frontend to point to the PHP API:

### Option 1: Update vite.config.js proxy

```javascript
proxy: {
  '/api': {
    target: 'http://localhost/php-api',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api')
  }
}
```

### Option 2: Use environment variable

Create `.env`:
```
VITE_API_URL=http://localhost/php-api
```

## Step 7: Test Endpoints

1. Health check: `http://localhost/php-api/api/health`
2. Try creating an order from your frontend
3. Check phpMyAdmin to see if data is saved

## Troubleshooting

### Database connection failed
- Check MySQL is running
- Verify database name, username, password in `config.php`
- Make sure you created the database and imported schema

### 404 errors
- Check `.htaccess` file exists
- Make sure mod_rewrite is enabled in Apache
- Try accessing `index.php` directly

### CORS errors
- Check `config.php` - `$allowed_origins` array
- Add your frontend URL if needed

### Upload errors
- Check `uploads/` folder exists and is writable
- Check PHP upload limits in `php.ini`

## Next Steps

Once local testing works:
1. Fix any issues
2. Test all features
3. Then we'll prepare for server upload!

