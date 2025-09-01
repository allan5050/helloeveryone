# Implementation Phases - Parallel Execution Plan

## Pre-Setup (10 minutes)

### 1. Create Project Structure
```bash
# Create project
npx create-next-app@latest helloeveryone --typescript --tailwind --app --no-src-dir
cd helloeveryone

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install ics date-fns zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install next-pwa
npm install -D @types/node

# Create docs folder and copy architecture files
mkdir -p docs .claude/agents

# Create Supabase project at supabase.com
# Get your project URL and anon key
```

### 2. Setup Environment Variables
```bash
# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
EOF
```

---

## Phase 1: Foundation (Day 1 Morning)

### Parallel Terminal Commands

**Terminal 1 - Database Setup:**
```bash
claude "Review docs/DATABASE_SCHEMA.md and docs/ARCHITECTURE.md. Set up the complete Supabase database schema including: 1) Enable vector, uuid-ossp, pg_trgm extensions, 2) Create all tables from the schema (profiles, events, rsvps, match_scores, messages, favorites, blocks, meeting_slots), 3) Create all database functions especially calculate_match_score and get_event_matches, 4) Set up RLS policies for security, 5) Create indexes for performance. Test each table with sample data."
```

**Terminal 2 - Project Structure:**
```bash
claude "Review docs/ARCHITECTURE.md. Set up the Next.js project structure with: 1) App router folder structure for (public) and (protected) routes, 2) Create lib folder with supabase/client.ts and supabase/server.ts setup, 3) Set up middleware.ts for auth protection, 4) Create all API route folders under app/api/, 5) Install and configure shadcn/ui components, 6) Set up the layout.tsx with proper metadata."
```

**Terminal 3 - Auth System:**
```bash
claude "Review docs/ARCHITECTURE.md and docs/API_ROUTES.md. Implement complete authentication system: 1) Set up Supabase Auth with email/password and Google OAuth, 2) Create login and signup pages under app/(public)/, 3) Implement auth context provider, 4) Create protected route wrapper, 5) Add session management hooks, 6) Implement logout functionality, 7) Add password reset flow."
```

---

## Phase 2: Profile & Matching Core (Day 1 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Profile System:**
```bash
claude "Review docs/ARCHITECTURE.md and docs/DATABASE_SCHEMA.md. Build the profile system: 1) Create profile setup flow with 3-step wizard (basic info, interests selection, bio), 2) Implement photo upload to Supabase Storage with compression, 3) Create profile edit page with privacy controls (visible_fields toggles), 4) Build the interests selector with categories (music, food, activities, etc), 5) Add the API route /api/profile/update with validation."
```

**Terminal 2 - Matching Engine Backend:**
```bash
claude "Review docs/MATCHING_SYSTEM.md and docs/API_ROUTES.md. Implement the core matching engine: 1) Create /api/match/generate-embeddings route using OpenAI text-embedding-3-small, 2) Implement /api/match/calculate route with caching logic, 3) Build the calculate_match_score PostgreSQL function with bio similarity, interest overlap, and age proximity scoring, 4) Create the match_scores caching table and refresh logic, 5) Add mutual visibility enforcement in matching."
```

**Terminal 3 - Testing Foundation:**
```bash
claude "Set up comprehensive testing: 1) Configure Jest and React Testing Library, 2) Write unit tests for matching algorithm functions, 3) Create integration tests for auth flow, 4) Add tests for profile creation and updates, 5) Write tests for privacy controls and mutual visibility, 6) Set up test database with sample users."
```

---

## Phase 3: Events & Calendar (Day 2 Morning)

### Parallel Terminal Commands

**Terminal 1 - Event Management:**
```bash
claude "Review docs/DATABASE_SCHEMA.md. Build event management: 1) Create event listing page at app/(protected)/events/page.tsx showing upcoming events, 2) Build event detail page at app/(protected)/events/[id]/page.tsx, 3) Implement RSVP functionality with capacity checking, 4) Add event cards showing attendee count and match potential, 5) Create past events archive page, 6) Build event filtering by date and location."
```

**Terminal 2 - Event Matching:**
```bash
claude "Review docs/MATCHING_SYSTEM.md. Implement event-specific matching: 1) Create /api/match/event/[eventId] route that calls get_event_matches database function, 2) Build 'People to Meet' component showing top 5 matches with photos and percentages, 3) Add match explanation display (shared interests, reasons), 4) Create /api/events/suggested route for personalized event recommendations, 5) Build favorited attendee indicators."
```

**Terminal 3 - Calendar Integration:**
```bash
claude "Review docs/API_ROUTES.md. Implement calendar features: 1) Create /api/calendar/event/[eventId] route generating ICS files, 2) Use ics.js library to create proper calendar events with reminders, 3) Add match information to event description, 4) Build calendar download button component, 5) Test with Google Calendar, Outlook, and Apple Calendar, 6) Add 15-minute meeting slot suggestions within events."
```

---

## Phase 4: Communication & Social (Day 2 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Chat System:**
```bash
claude "Review docs/DATABASE_SCHEMA.md and docs/API_ROUTES.md. Build messaging: 1) Create chat interface at app/(protected)/chat/page.tsx, 2) Implement /api/chat/send and /api/chat/conversations routes, 3) Add real-time updates using Supabase Realtime, 4) Build conversation list with last message preview, 5) Implement message deletion and read receipts, 6) Add blocking check before sending messages."
```

**Terminal 2 - Social Features:**
```bash
claude "Implement social features: 1) Create favorites/bookmarks system with star button on profiles, 2) Build favorites page showing bookmarked profiles, 3) Add 'Favorites Attending' indicator on events, 4) Implement /api/profile/favorite route, 5) Create meeting scheduler for 15-minute slots at events, 6) Build notification system for high matches (80%+)."
```

**Terminal 3 - Privacy & Safety:**
```bash
claude "Review docs/DATABASE_SCHEMA.md. Implement privacy features: 1) Create blocking system with /api/privacy/block route, 2) Build report user functionality with reason selection, 3) Implement GDPR data export at /api/privacy/export, 4) Add account deletion with cascading deletes, 5) Create privacy settings page with field-level controls, 6) Test mutual visibility rules thoroughly."
```

---

## Phase 5: PWA & Mobile (Day 3 Morning)

### Parallel Terminal Commands

**Terminal 1 - PWA Setup:**
```bash
claude "Configure PWA features: 1) Set up next-pwa with manifest.json, 2) Create service worker with offline caching strategy, 3) Add install prompt for mobile devices, 4) Configure icons and splash screens, 5) Implement background sync for messages, 6) Add push notifications for event reminders."
```

**Terminal 2 - Mobile UI Polish:**
```bash
claude "Optimize for mobile: 1) Make all components responsive with Tailwind breakpoints, 2) Add touch-friendly buttons (min 44px), 3) Implement swipe gestures for navigation, 4) Create bottom navigation for mobile, 5) Optimize images with next/image, 6) Add loading skeletons for better perceived performance."
```

**Terminal 3 - Performance:**
```bash
claude "Optimize performance: 1) Implement React Query for server state caching, 2) Add pagination to event and profile lists, 3) Optimize database queries with proper indexes, 4) Implement image lazy loading, 5) Add Vercel Edge caching for API routes, 6) Create loading states and error boundaries."
```

---

## Phase 6: Polish & Deploy (Day 3 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Final Features:**
```bash
claude "Add final touches: 1) Create landing page with clear value proposition, 2) Build onboarding tour for new users, 3) Add analytics tracking with Vercel Analytics, 4) Create admin panel for event management, 5) Implement email notifications for RSVPs, 6) Add Discord webhook integration for event announcements."
```

**Terminal 2 - Testing & QA:**
```bash
claude "Complete testing: 1) Write E2E tests with Playwright for critical user paths, 2) Test the complete flow: signup → profile → browse → RSVP → match → chat, 3) Load test with 100 concurrent users, 4) Test on multiple browsers and devices, 5) Verify GDPR compliance, 6) Check accessibility with screen readers."
```

**Terminal 3 - Deployment:**
```bash
claude "Deploy to production: 1) Set up Vercel project with environment variables, 2) Configure custom domain helloeveryone.fun, 3) Set up preview deployments for branches, 4) Configure CORS and security headers, 5) Set up error monitoring with Sentry, 6) Create deployment checklist and verify all features."
```

---

## Quick Reference Commands

### Check Progress
```bash
# Terminal 1
claude "Review the codebase and list what's been completed and what's remaining from docs/IMPLEMENTATION_PHASES.md Phase X"
```

### Fix Issues
```bash
# If tests fail
claude "Run the test suite, identify failures, and fix them"

# If build fails
claude "Run next build, identify the errors, and resolve them"
```

### Code Review
```bash
# After each phase
claude "Review the code for the [feature] implementation, check for security issues, performance problems, and suggest improvements"
```

---

## Success Criteria Checklist

### Phase 1 ✓
- [ ] Database schema created with all tables
- [ ] Auth system working (email + Google)
- [ ] Project structure matches architecture docs

### Phase 2 ✓
- [ ] Profile creation and editing works
- [ ] Photos upload successfully
- [ ] Matching algorithm returns scores

### Phase 3 ✓
- [ ] Events display with RSVP
- [ ] Calendar downloads work
- [ ] Event matches show correctly

### Phase 4 ✓
- [ ] Chat system functional
- [ ] Favorites/bookmarks work
- [ ] Privacy controls enforced

### Phase 5 ✓
- [ ] PWA installable on mobile
- [ ] Offline mode works
- [ ] Performance optimized

### Phase 6 ✓
- [ ] All tests passing
- [ ] Deployed to Vercel
- [ ] Domain configured

---

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
```bash
claude "Check .env.local variables and verify Supabase client setup in lib/supabase/"
```

2. **TypeScript Errors**
```bash
claude "Run npm run type-check and fix all TypeScript errors"
```

3. **Build Failures**
```bash
claude "Run npm run build, identify the specific error, and fix it"
```

4. **Database Migration Issues**
```bash
claude "Connect to Supabase SQL editor and manually run the failed migration, then debug"
```

Remember: Each agent can work independently on their assigned tasks. The architecture is designed to minimize conflicts between parallel work streams.