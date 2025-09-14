# Local Authentication Setup Guide

## Fixing CORS Errors for Localhost Development

### 1. Configure Supabase for Localhost

1. **Go to your Supabase Dashboard**
   - Visit: https://app.supabase.com/project/amarmxbvuzxakjzvntzv/auth/url-configuration
   - Or navigate: Dashboard → Authentication → URL Configuration

2. **Update Redirect URLs**
   Add these URLs to the "Redirect URLs" section:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   http://localhost:3001/auth/callback
   http://localhost:3001
   ```

3. **Update Site URL**
   - Set Site URL to: `http://localhost:3000`
   - This is under Authentication → URL Configuration → Site URL

4. **Check Email Templates** (Optional)
   - Go to Authentication → Email Templates
   - Make sure the confirmation URL uses `{{ .SiteURL }}`

### 2. Setting Up Google OAuth

1. **Create Google OAuth Credentials**
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth Client ID
   - Application type: Web application
   - Add authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:3001
     https://amarmxbvuzxakjzvntzv.supabase.co
     ```
   - Add authorized redirect URIs:
     ```
     https://amarmxbvuzxakjzvntzv.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/callback
     ```

2. **Add to Supabase**
   - Copy your Client ID and Client Secret
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

3. **Update Environment Variables**
   Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### 3. Setting Up Facebook OAuth

1. **Create Facebook App**
   - Go to: https://developers.facebook.com/
   - Create App → Consumer
   - Add Facebook Login product

2. **Configure Facebook Login**
   - Settings → Basic:
     - App Domains: `localhost`, `supabase.co`
   - Facebook Login → Settings:
     - Valid OAuth Redirect URIs:
       ```
       https://amarmxbvuzxakjzvntzv.supabase.co/auth/v1/callback
       http://localhost:3000/auth/callback
       http://localhost:3001/auth/callback
       ```
     - Enable: Client OAuth Login, Web OAuth Login

3. **Add to Supabase**
   - Copy App ID and App Secret
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Facebook
   - Paste App ID and App Secret
   - Save

### 4. Quick Local Testing Workaround

If you need to test immediately without full OAuth setup, you can:

1. **Use Supabase's built-in test mode**
   - Email signup works immediately
   - Check Supabase Dashboard → Authentication → Users to see signups
   - Manually confirm users for testing

2. **Disable email confirmation temporarily** (Development only!)
   - Supabase Dashboard → Authentication → Settings
   - Under "Email Auth" disable "Enable email confirmations"
   - ⚠️ Remember to re-enable for production!

### 5. Testing the Flow

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test signup flow:**
   - Go to http://localhost:3000/signup
   - Enter email
   - Create password
   - Check Supabase Dashboard → Authentication → Users

3. **If email confirmation is enabled:**
   - Check your email for confirmation link
   - Or manually confirm in Supabase Dashboard

### 6. Common Issues & Solutions

**CORS Error:**
- Make sure localhost URLs are in Supabase Redirect URLs
- Clear browser cache and cookies
- Try incognito mode

**Email not sending:**
- Check Supabase Dashboard → Settings → Email
- For development, manually confirm users in dashboard

**OAuth redirect issues:**
- Ensure callback URL matches exactly
- Check browser console for specific errors
- Verify OAuth app is not in development/test mode

### 7. Environment Variables Checklist

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://amarmxbvuzxakjzvntzv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side operations)
```

### 8. Quick Development Setup (Minimal)

For immediate local testing:

1. **Just fix the CORS issue:**
   - Go to: https://app.supabase.com/project/amarmxbvuzxakjzvntzv/auth/url-configuration
   - Add `http://localhost:3000` and `http://localhost:3001` to Redirect URLs
   - Save changes

2. **Disable email confirmation:**
   - Authentication → Settings → Email Auth
   - Uncheck "Enable email confirmations"
   - Save

3. **Test with email/password only:**
   - Skip OAuth for now
   - Use the email/password flow
   - Manually verify users in dashboard if needed

This should get you running locally immediately!