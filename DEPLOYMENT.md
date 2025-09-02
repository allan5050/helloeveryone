# Deployment Configuration

## Vercel Deployment Details
- **Production URL**: https://helloeveryone.vercel.app
- **Deployment URL**: https://helloeveryone-31n2m8k6j-allans-projects-e7b58c50.vercel.app
- **Status**: Ready

## Required Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Configuration

### 1. Authentication Settings
Go to Supabase Dashboard → Authentication → URL Configuration

**Site URL:**
```
https://helloeveryone.vercel.app
```

**Redirect URLs** (add all of these):
```
https://helloeveryone.vercel.app/auth/callback
https://helloeveryone.vercel.app/auth/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

### 2. Email Templates (Optional)
Go to Authentication → Email Templates to customize:
- Confirmation email
- Password reset email
- Magic link email

### 3. Email Settings
Go to Authentication → Providers → Email
- Enable Email provider
- Disable "Confirm email" if you want users to login immediately
- Or keep it enabled for email verification

## Testing Authentication

### Local Development:
```bash
npm run dev
```
Visit: http://localhost:3000/login

### Production:
Visit: https://helloeveryone.vercel.app/login

## Available Auth Routes
- `/login` - User login page
- `/signup` - User registration page  
- `/auth/reset-password` - Password reset page
- `/auth/callback` - OAuth callback handler (automatic)

## Troubleshooting

### If authentication redirects fail:
1. Check Supabase redirect URLs include your domain
2. Verify environment variables in Vercel
3. Check browser console for errors

### If emails don't send:
1. Check Supabase email settings
2. For production, consider setting up custom SMTP
3. Check spam folder for test emails

### If Google OAuth doesn't work:
1. It's currently disabled - enable in Supabase if needed
2. Add Google Client ID and Secret in Supabase
3. Update redirect URLs in Google Cloud Console