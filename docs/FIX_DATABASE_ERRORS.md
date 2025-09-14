# How to Fix Database Errors

## Quick Fix Instructions

You're seeing these errors because the database schema is missing some required columns and storage buckets. Here's how to fix it:

### Step 1: Run the Database Fix Script

1. **Go to Supabase SQL Editor:**
   https://app.supabase.com/project/amarmxbvuzxakjzvntzv/sql/new

2. **Copy the entire contents of** `scripts/fix-database.sql`

3. **Paste it into the SQL editor and click "Run"**

This script will:
- Add missing columns (`is_profile_complete`, `photo_url`, etc.)
- Create the `profile-photos` storage bucket
- Set up proper storage policies
- Fix RLS (Row Level Security) policies
- Create performance indexes

### Step 2: Verify the Fix

After running the script:

1. **Check Storage Buckets:**
   - Go to: https://app.supabase.com/project/amarmxbvuzxakjzvntzv/storage/buckets
   - You should see `profile-photos` bucket

2. **Check Table Schema:**
   - Go to: https://app.supabase.com/project/amarmxbvuzxakjzvntzv/editor
   - Click on `profiles` table
   - Verify these columns exist:
     - `is_profile_complete` (boolean)
     - `photo_url` (text)
     - `display_name` (text)
     - `preferred_age_min` (integer)
     - `preferred_age_max` (integer)
     - `looking_for` (text[])
     - `availability` (text[])

### Step 3: Test the Profile Flow

1. Go back to `http://localhost:3000/profile/setup`
2. Try uploading a photo again
3. Fill out the profile form
4. Click "Complete Profile"

## Common Issues & Solutions

### "Bucket not found" Error
- **Cause:** Storage bucket doesn't exist
- **Fix:** Run the SQL script above, it creates the bucket

### "Column not found" Error
- **Cause:** Database schema is outdated
- **Fix:** Run the SQL script above, it adds all missing columns

### "Permission denied" Error
- **Cause:** RLS policies not configured
- **Fix:** Run the SQL script above, it sets up proper policies

### Photo Upload Still Fails
If photo upload still fails after running the script:

1. **Check bucket permissions:**
   - Go to Storage → Buckets → profile-photos
   - Click "Policies"
   - Make sure policies are enabled

2. **Make bucket public (if needed):**
   ```sql
   UPDATE storage.buckets 
   SET public = true 
   WHERE id = 'profile-photos';
   ```

## Alternative: Manual Setup

If the script doesn't work, you can set up manually:

### 1. Create Storage Bucket
- Go to Storage in Supabase
- Click "New bucket"
- Name: `profile-photos`
- Public: Yes

### 2. Add Missing Columns
Go to Table Editor → profiles → Add column:
- `is_profile_complete` (boolean, default: false)
- `photo_url` (text, nullable)
- `display_name` (text, nullable)
- `preferred_age_min` (int8, default: 18)
- `preferred_age_max` (int8, default: 99)
- `looking_for` (text[], default: {})
- `availability` (text[], default: {})

### 3. Enable RLS
- Go to Authentication → Policies
- Enable RLS for profiles table
- Add policies for INSERT, UPDATE, SELECT

## Need More Help?

- Check Supabase logs: https://app.supabase.com/project/amarmxbvuzxakjzvntzv/logs/explorer
- Review the database schema: `docs/DATABASE_SCHEMA.md`
- Check the original setup: `scripts/setup-database.sql`