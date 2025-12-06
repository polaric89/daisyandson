# Troubleshooting Guide

## "Session Expired" or "Referrer Not Found" Error

If you're getting this error when trying to login:

### Most Common Cause: Account Doesn't Exist

**You need to REGISTER first before you can login!**

1. Go to the Referrer Auth page
2. Click "Register now" (or switch to registration mode)
3. Fill in your details:
   - Name
   - Email
   - Password (min 6 characters)
   - Phone (optional)
4. Submit registration
5. Then you can login with your email and password

### Check if Account Exists

1. Open phpMyAdmin
2. Go to `badge_designer` database
3. Check the `referrers` table
4. See if your email exists there

### If Account Already Exists

If you've registered before but still getting this error:

1. **Check the referrer ID format** - Open browser console and check what ID is being used
2. **Check database** - Verify the referrer exists in phpMyAdmin
3. **Check PHP error logs** - Look for database errors

### Debug Steps

1. **Check browser console** - Look for error messages
2. **Check Network tab** - See what API call is failing
3. **Check PHP error logs** - Look in your server error log

### Still Not Working?

1. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Try registering again
3. Check that the database connection is working (test health endpoint)

