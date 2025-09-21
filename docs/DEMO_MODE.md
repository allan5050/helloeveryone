# Demo Mode & Fallback Data System

## Overview

The application includes a robust fallback system that allows it to operate without a database connection, perfect for demonstrations, presentations, or when Supabase is unavailable.

## Features

- **Automatic Fallback**: Detects database failures and automatically switches to local data
- **Manual Toggle**: Switch between live and demo mode via `/demo-mode` page
- **Complete Data Backup**: Includes profiles, events, matches, favorites, and AI insights
- **Visual Indicator**: Shows when demo mode is active
- **Zero Dependencies**: Works completely offline

## Data Backup

### Current Backup Stats
- **Profiles**: 25 demo profiles
- **Match Scores**: 301 pre-calculated matches
- **Export Date**: September 21, 2025
- **Location**: `/data/demo-backup.json`

### Updating Demo Data

```bash
# Export latest data from Supabase
npm run export-demo

# Or run directly
node scripts/export-demo-data.js
```

## Usage

### Accessing Demo Mode Control

1. Navigate to `/demo-mode` in the app
2. Toggle between Live and Demo mode
3. View backup data statistics
4. Export new data if needed

### Automatic Fallback

If the database connection fails:
1. The app automatically switches to demo mode
2. A notification appears in the bottom-right corner
3. All features continue working with local data
4. Click "Retry Connection" to reconnect

### Manual Testing

To test demo mode without disconnecting:

```javascript
// In browser console
localStorage.setItem('forceDemoMode', 'true')
location.reload()
```

## Files Structure

```
/data/
  demo-backup.json      # Full backup with all data
  demo-minimal.json     # Lightweight version for quick loading

/lib/fallback/
  demo-data.ts          # Fallback data service

/hooks/
  useFallbackData.ts    # React hook for fallback data

/scripts/
  export-demo-data.js   # Export script

/app/(protected)/demo-mode/
  page.tsx              # Demo mode control panel
```

## Demo Profiles

All demo profiles have names starting with "Demo:" for easy identification:

- Demo: David Kim (Software Engineer)
- Demo: Emily Zhang (Data Engineer)
- Demo: Michael Brown (Product Manager)
- Demo: Sarah Martinez (UX Designer)
- Demo: Alex Thompson (Marketing Manager)
- And 20 more...

## Presentation Tips

1. **Before Presentation**:
   - Run `npm run export-demo` to get latest data
   - Test demo mode toggle at `/demo-mode`
   - Verify all features work offline

2. **During Presentation**:
   - If internet fails, the app auto-switches to demo mode
   - All matching, favorites, and browsing features work
   - Changes are temporary and not persisted

3. **Fallback Indicator**:
   - Orange indicator appears when in demo mode
   - Can be minimized but stays visible
   - Shows "Demo Mode Active" status

## API Endpoints in Demo Mode

When demo mode is active, these endpoints use local data:
- `/api/matches/*` - Returns cached match scores
- `/api/profiles/*` - Returns demo profiles
- `/api/favorites/*` - Simulates favorites (not persisted)

## Limitations

- Changes made in demo mode are not saved
- New profiles cannot be created
- Messages are not functional
- AI insights use cached data only

## Troubleshooting

### Demo Mode Not Working
```bash
# Verify backup files exist
ls data/*.json

# Re-export data
npm run export-demo
```

### Can't Toggle Mode
- Check browser console for errors
- Ensure you're on `/demo-mode` page
- Clear localStorage and reload

### Missing Profiles
- Re-run export script
- Check Supabase connection
- Verify `.env` variables are set