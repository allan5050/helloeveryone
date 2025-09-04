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
claude --subagent db-architect "Read docs/DATABASE_SCHEMA.md carefully. Connect to Supabase and: 1) Enable vector, uuid-ossp, pg_trgm extensions, 2) Create ALL tables from the schema (profiles with vector column, events, rsvps, match_scores, messages, favorites, blocks, meeting_slots), 3) Create the calculate_match_score and get_event_matches functions, 4) Set up all RLS policies, 5) Create all indexes especially the ivfflat index for vector search. Test by inserting sample data into each table."
```

**Terminal 2 - Project Structure:**

```bash
claude --subagent frontend-builder "Read docs/ARCHITECTURE.md. Initialize Next.js project structure: 1) Create app/(public) and app/(protected) route groups, 2) Set up lib/supabase/client.ts and server.ts using the environment variables, 3) Create middleware.ts for auth protection, 4) Create empty API route folders (api/match, api/events, api/profile, api/chat, api/calendar), 5) Install and configure shadcn/ui with 'npx shadcn-ui@latest init', 6) Update layout.tsx with proper metadata and font configuration."
```

**Terminal 3 - Auth System:**

```bash
claude --subagent api-engineer "Read docs/API_ROUTES.md. Build authentication: 1) Configure Supabase Auth for email/password and Google OAuth in Supabase dashboard, 2) Create app/(public)/login/page.tsx with email and Google login, 3) Create app/(public)/signup/page.tsx with email signup, 4) Build auth context provider using Supabase auth helpers, 5) Create lib/api/auth.ts with requireAuth() helper, 6) Add logout functionality, 7) Implement password reset flow with Supabase's resetPasswordForEmail."
```

---

## Phase 2: Profile & Matching Core (Day 1 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Profile System:**

```bash
claude --subagent frontend-builder "Build complete profile system: 1) Create app/(protected)/profile/setup/page.tsx with 3-step wizard (basic info with age, interests categories from docs/DATABASE_SCHEMA.md, bio text), 2) Implement photo upload component using Supabase Storage, 3) Build app/(protected)/profile/edit/page.tsx with privacy toggles for visible_fields, 4) Create reusable InterestSelector component with music/food/activities categories, 5) Add form validation with react-hook-form and zod."
```

**Terminal 2 - Matching Engine Backend:**

```bash
claude --subagent match-engineer "Read docs/MATCHING_SYSTEM.md. Build matching engine: 1) Create app/api/match/generate-embeddings/route.ts using OpenAI text-embedding-3-small model, 2) Implement app/api/match/calculate/route.ts with caching to match_scores table, 3) In Supabase SQL editor, create the calculate_match_score function with bio similarity (30%), interest overlap (40%), age proximity (20%), 4) Create helper functions for each scoring component, 5) Test with sample user pairs."
```

**Terminal 3 - Testing Foundation:**

```bash
claude --subagent test-engineer "Set up testing infrastructure: 1) Configure Jest and React Testing Library in jest.config.js, 2) Write tests/__tests__/matching.test.ts for scoring algorithms, 3) Create tests/__tests__/auth.test.tsx for login/signup flows, 4) Write tests/__tests__/profile.test.tsx for profile CRUD operations, 5) Add tests/__tests__/privacy.test.ts for mutual visibility rules, 6) Create test fixtures with 10 sample users."
```

---

## Phase 3: Events & Calendar (Day 2 Morning)

### Parallel Terminal Commands

**Terminal 1 - Event Management:**

```bash
claude --subagent frontend-builder "Create event system UI: 1) Build app/(protected)/events/page.tsx with upcoming events grid using Tailwind cards, 2) Create app/(protected)/events/[id]/page.tsx showing event details and attendees, 3) Implement RSVP component with optimistic updates using React Query, 4) Add attendee counter with capacity indicator, 5) Build app/(protected)/events/past/page.tsx for event history, 6) Add date/location filters using URL search params."
```

**Terminal 2 - Event Matching:**

```bash
claude --subagent match-engineer "Read docs/MATCHING_SYSTEM.md. Build event matching features: 1) Create app/api/match/event/[eventId]/route.ts that calls the get_event_matches database function, 2) Build PeopleToMeet component showing top 5 matches with photos and match percentages, 3) Create match explanation cards showing shared interests, 4) Implement app/api/events/suggested/route.ts for personalized event recommendations based on match potential, 5) Add visual indicators for events where favorited users are attending."
```

**Terminal 3 - Calendar Integration:**

```bash
claude --subagent integration-specialist "Read docs/API_ROUTES.md. Build calendar integration: 1) Install ics package and create app/api/calendar/event/[eventId]/route.ts, 2) Generate proper ICS files with event details and top 3 matches in description, 3) Add recurring reminders at 24h and 1h before event, 4) Create CalendarDownloadButton component with icon, 5) Test downloads with Google Calendar, Outlook, and Apple Calendar, 6) Add timezone handling with date-fns-tz."
```

---

## Phase 4: Communication & Social (Day 2 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Chat System:**

```bash
claude --subagent api-engineer "Read docs/DATABASE_SCHEMA.md and docs/API_ROUTES.md. Build messaging system: 1) Create app/(protected)/chat/page.tsx with conversation list, 2) Implement app/api/chat/send/route.ts with blocking checks, 3) Create app/api/chat/conversations/route.ts to fetch message threads, 4) Set up Supabase Realtime subscription for new messages, 5) Add message deletion with soft delete flags, 6) Implement read receipts and typing indicators."
```

**Terminal 2 - Social Features:**

```bash
claude --subagent frontend-builder "Add social features: 1) Create FavoriteButton component with star icon that calls app/api/profile/favorite/route.ts, 2) Build app/(protected)/favorites/page.tsx showing bookmarked profiles in a grid, 3) Add 'Favorites Attending' badge on event cards, 4) Create meeting request system with 15-minute slots using meeting_slots table, 5) Build notification toast component for high matches (80%+), 6) Add social proof indicators throughout the UI."
```

**Terminal 3 - Privacy & Safety:**

```bash
claude --subagent privacy-guardian "Read docs/DATABASE_SCHEMA.md. Implement privacy features: 1) Create app/api/privacy/block/route.ts with bidirectional blocking, 2) Build ReportUserModal component with reason selection dropdown, 3) Implement app/api/privacy/export/route.ts for GDPR data export as JSON, 4) Add app/api/privacy/delete/route.ts for complete account deletion with CASCADE, 5) Create app/(protected)/settings/privacy/page.tsx with field visibility toggles, 6) Write tests to verify mutual visibility rules work correctly."
```

---

## Phase 5: PWA & Mobile (Day 3 Morning)

### Parallel Terminal Commands

**Terminal 1 - PWA Setup:**

```bash
claude --subagent integration-specialist "Configure PWA features: 1) Install next-pwa and create next.config.js with PWA configuration, 2) Create public/manifest.json with app metadata and icons, 3) Generate app icons in multiple sizes (192x192, 512x512) and add to public/, 4) Create service worker with cache-first strategy for static assets, 5) Implement install prompt component for mobile browsers, 6) Set up background sync for offline message queue."
```

**Terminal 2 - Mobile UI Polish:**

```bash
claude --subagent frontend-builder "Optimize all UI for mobile: 1) Add responsive breakpoints to all components using Tailwind's sm/md/lg prefixes, 2) Ensure all buttons are minimum 44px touch targets, 3) Implement swipe gestures using react-swipeable for navigation, 4) Create MobileNavigation component with bottom tab bar, 5) Replace all img tags with next/image for optimization, 6) Add loading skeletons using shadcn/ui Skeleton component."
```

**Terminal 3 - Performance:**

```bash
claude --subagent api-engineer "Optimize performance: 1) Set up React Query in app/providers.tsx with proper cache configuration, 2) Add pagination to app/api/events/route.ts and app/api/profiles/route.ts, 3) Review and optimize all database queries in Supabase, 4) Implement image optimization with sharp in photo upload, 5) Add Vercel Edge Config for API route caching, 6) Create proper error boundaries with error.tsx files."
```

---

## Phase 6: Polish & Deploy (Day 3 Afternoon)

### Parallel Terminal Commands

**Terminal 1 - Final Features:**

```bash
claude --subagent frontend-builder "Add final UI touches: 1) Create landing page at app/(public)/page.tsx with hero section and clear CTAs, 2) Build onboarding tour using intro.js or similar, 3) Add Vercel Analytics script to layout.tsx, 4) Create app/(protected)/admin/page.tsx for event management (check is_admin flag), 5) Set up email notification preferences UI, 6) Add loading states and error messages throughout."
```

**Terminal 2 - Testing & QA:**

```bash
claude --subagent test-engineer "Complete all testing: 1) Write E2E tests in tests/e2e/ using Playwright for signup→profile→event→RSVP→match flow, 2) Test complete user journey on mobile Safari and Chrome, 3) Run load testing with 100 concurrent users using k6 or similar, 4) Test all browsers (Chrome, Firefox, Safari, Edge), 5) Verify GDPR compliance with data export/delete, 6) Run accessibility audit with axe-core."
```

**Terminal 3 - Deployment:**

```bash
claude --subagent devops-engineer "Deploy to production: 1) Create Vercel project and connect GitHub repo, 2) Add all environment variables from .env.local to Vercel dashboard, 3) Configure custom domain helloeveryone.fun in Vercel settings, 4) Set up preview deployments for pull requests, 5) Add security headers in next.config.js, 6) Install Sentry and add error monitoring, 7) Run 'npm run build' and fix any build errors before deploying."
```

---

## Quick Reference Commands

### Check Progress

```bash
# Check what's completed in current phase
claude --subagent test-engineer "Review the codebase and run all tests. Report which features are working and which need fixes."
```

### Fix Issues

```bash
# If tests fail
claude --subagent test-engineer "Run npm test, identify all failures, and fix them one by one"

# If build fails
claude --subagent devops-engineer "Run npm run build, identify the errors, and resolve them"

# If TypeScript errors
claude --subagent api-engineer "Run npm run type-check and fix all TypeScript errors"
```

### Code Review

```bash
# After each phase
claude --subagent test-engineer "Review the implementation of [feature name], check for security issues, performance problems, and edge cases"
```

### Database Debugging

```bash
# If database issues
claude --subagent db-architect "Connect to Supabase SQL editor, check the schema, and fix any missing tables or functions"
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

Remember: Each agent can work independently on their assigned tasks. The architecture is designed to
minimize conflicts between parallel work streams.
