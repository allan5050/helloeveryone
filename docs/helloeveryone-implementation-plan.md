# HelloEveryone.fun - Enhanced Implementation Plan
## Smart Social Matching Platform for Real Connections

---

## 🎯 **Core Mission**
Help busy 25-50 year olds find **relevant** friends through smart matching at local events, emphasizing quality connections over quantity.

---

## 🏗️ **Tech Stack (Pragmatic Choices)**

### Core Infrastructure
- **Frontend**: Next.js 14+ (App Router) - PWA enabled for mobile
- **Database**: Supabase (PostgreSQL + Auth + Realtime + Storage + Vector embeddings)
- **Matching Engine**: PostgreSQL with pgvector for semantic search
- **Calendar Integration**: ics.js for universal calendar files
- **Chat**: Simple async chat in Supabase (Discord for group discussions)
- **File Storage**: Supabase Storage for profile photos
- **Hosting**: Vercel (automatic edge deployment)
- **Search**: Supabase full-text search + pgvector for semantic matching

### Why This Stack?
- **Supabase pgvector**: Built-in semantic similarity without external services
- **PWA over native**: One codebase, works everywhere
- **ICS files**: Universal calendar format, no API integrations needed
- **PostgreSQL JSON**: Flexible profile fields without NoSQL complexity

---

## 📊 **Enhanced Database Schema**

```sql
-- Enable vector extension for semantic matching
CREATE EXTENSION IF NOT EXISTS vector;

-- User profiles with privacy controls
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  age INTEGER,
  occupation TEXT,
  photo_url TEXT,
  bio TEXT, -- free text for semantic matching
  bio_embedding vector(1536), -- OpenAI embeddings for semantic search
  
  -- Privacy settings (field-level visibility)
  visible_fields JSONB DEFAULT '{"first_name": true, "photo": true}'::jsonb,
  
  -- Structured interests for exact matching
  interests JSONB DEFAULT '{}'::jsonb, -- {music: ["rock", "jazz"], food: ["italian", "thai"]}
  
  city TEXT DEFAULT 'Current City',
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Events remain simple
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue_name TEXT NOT NULL,
  address TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  max_attendees INT DEFAULT 15,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced RSVPs with match suggestions
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('going', 'interested')) DEFAULT 'going',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Favorites/Stars for profiles
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  favorited_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, favorited_user_id)
);

-- Simple async chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meeting schedules within events (15-min slots)
CREATE TABLE meeting_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slot_time TIMESTAMP NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blocks for privacy
CREATE TABLE blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Match scores cache (computed periodically)
CREATE TABLE match_scores (
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score FLOAT NOT NULL, -- 0-100 match percentage
  reasons JSONB, -- {age_similarity: 20, interests: 40, bio: 30}
  computed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user1_id, user2_id)
);
```

---

## 🎨 **Priority Features (MVP to Full Product)**

### **Phase 1: Core Platform** (Week 1-2)
✅ **Must Have**
- User registration with email verification
- Basic profile (name, age, photo, 3 interests)
- Event listing and RSVP
- Simple profile privacy (show/hide photo)

### **Phase 2: Smart Matching** (Week 3-4)
✅ **High Value**
- Semantic bio matching using pgvector
- Interest-based matching (exact + fuzzy)
- "People to Meet" suggestions at events
- Match score visualization

### **Phase 3: Connection Tools** (Week 5)
✅ **Medium Value**
- Profile favorites/bookmarks
- Simple 1-on-1 async chat
- Calendar download (.ics files)
- Block/report functionality

### **Phase 4: Enhanced Experience** (Week 6)
🔄 **Nice to Have**
- 15-minute meeting scheduler
- Event suggestions based on favorites attending
- Past events archive
- GDPR compliance tools

### **Descoped Features** ❌
- Discussion boards (use Discord)
- Payment processing
- Native mobile apps
- Complex privacy controls (keep it simple)
- AI chat matching (future enhancement)

---

## 🤖 **Claude Code Agent Configurations**

### **1. Database Architect Agent** (`db-architect`)
```markdown
---
name: db-architect
description: Database and matching algorithm specialist. MUST BE USED for schema changes, pgvector setup, and matching queries.
tools: bash, write, read, grep
---
You are a PostgreSQL and Supabase expert specializing in efficient matching algorithms.

PRIMARY RESPONSIBILITIES:
1. Set up Supabase with pgvector extension for semantic search
2. Create all tables with proper indexes for performance
3. Implement RLS policies for privacy (mutual visibility)
4. Write efficient matching queries using:
   - Semantic similarity (cosine distance on embeddings)
   - Fuzzy text matching (pg_trgm)
   - Range queries (age ± 5 years)
   - JSON field matching (interests)
5. Create match_scores computation function
6. Set up database backup strategy

MATCHING ALGORITHM PRIORITIES:
- Age similarity (±5 years): 20% weight
- Common interests: 40% weight  
- Bio semantic similarity: 30% weight
- Location: 10% weight

Keep queries performant with proper indexes.
```

### **2. Frontend Builder Agent** (`ui-builder`)
```markdown
---
name: ui-builder
description: React/Next.js UI specialist with PWA expertise. Builds mobile-first, accessible interfaces.
tools: write, read, bash
---
You are a frontend expert focused on clean, mobile-first interfaces.

PRIMARY TASKS:
1. Set up Next.js with PWA configuration (next-pwa)
2. Build responsive components with Tailwind CSS
3. Create profile setup flow with photo upload
4. Build event cards showing match indicators
5. Implement "People to Meet" section with match scores
6. Add favorites/bookmark UI with star icons
7. Create simple chat interface
8. Build privacy controls (field toggles)
9. Add calendar download buttons (using ics.js)

DESIGN PRINCIPLES:
- Mobile-first (60% mobile users)
- Clear match indicators (percentage badges)
- Trust signals (verified badges, public venues)
- Accessibility (WCAG 2.1 AA)
```

### **3. Matching Engine Agent** (`match-engine`)
```markdown
---
name: match-engine
description: Builds semantic matching and recommendation systems. PROACTIVELY optimizes match quality.
tools: write, read, bash, grep
---
You specialize in building efficient matching algorithms.

PRIMARY TASKS:
1. Implement bio embedding generation (using OpenAI API)
2. Create match scoring algorithm:
   - Age proximity scoring
   - Interest overlap calculation
   - Semantic similarity computation
   - Mutual visibility enforcement
3. Build event recommendation engine
4. Create "suggested matches" API endpoint
5. Implement privacy-aware matching (mutual fields only)
6. Add match reason explanations

OPTIMIZATION GOALS:
- Match computation < 100ms
- Batch process embeddings
- Cache match scores (refresh hourly)
- Progressive disclosure of match reasons
```

### **4. Integration Agent** (`integration-agent`)
```markdown
---
name: integration-agent
description: Handles external integrations and file formats. Specializes in calendar systems and PWA features.
tools: write, read, bash
---
You handle all external integrations and cross-platform compatibility.

PRIMARY TASKS:
1. Implement .ics file generation for events
2. Add PWA manifest and service worker
3. Set up Supabase Storage for photos
4. Configure push notifications (web push)
5. Add "Add to Home Screen" prompts
6. Implement Discord webhook for event announcements
7. Create data export for GDPR compliance

COMPATIBILITY REQUIREMENTS:
- Support all major calendars (Google, Outlook, Apple)
- Work on iOS Safari, Android Chrome
- Offline-capable PWA features
```

### **5. Test Engineer Agent** (`test-engineer`)
```markdown
---
name: test-engineer
description: Testing specialist ensuring code quality. PROACTIVELY writes tests before and after feature implementation.
tools: bash, write, read, grep
---
You ensure comprehensive test coverage and quality.

PRIMARY TASKS:
1. Set up Jest + React Testing Library
2. Write unit tests for:
   - Matching algorithms
   - Privacy controls
   - RSVP limits
   - Chat functionality
3. Create integration tests for:
   - User registration flow
   - Event RSVP with matching
   - Calendar download
4. Add E2E tests with Playwright for:
   - Complete user journey
   - Mobile PWA installation
   - Match viewing at events
5. Performance testing:
   - Match algorithm speed
   - Database query optimization
   - Image upload/compression

COVERAGE GOALS:
- Unit tests: 80% coverage
- Critical paths: 100% E2E coverage
- Load testing: 100 concurrent users
```

### **6. Privacy Guardian Agent** (`privacy-guardian`)
```markdown
---
name: privacy-guardian
description: Privacy and security specialist. Ensures GDPR compliance and mutual visibility rules.
tools: write, read, grep
---
You specialize in privacy-first architecture and compliance.

PRIMARY TASKS:
1. Implement mutual visibility system:
   - Field-level privacy controls
   - Bidirectional matching restrictions
   - Block list enforcement
2. Create GDPR compliance features:
   - Data export endpoint
   - Complete account deletion
   - Consent management
3. Add security measures:
   - Rate limiting
   - Input sanitization
   - SQL injection prevention
4. Build reporting system:
   - User report handling
   - Content moderation queue
   - Automatic flag triggers

PRIVACY PRINCIPLES:
- Default to private
- Mutual consent for visibility
- Clear data ownership
- Right to be forgotten
```

---

## 🚀 **Parallel Execution Plan**

### **Week 1: Foundation Sprint**
Run these 3 agents in parallel:

**Terminal 1 - Database Setup:**
```bash
claude --subagent db-architect "Set up Supabase project with pgvector. Create all tables from the schema including profiles, events, rsvps, favorites, messages, blocks, and match_scores. Add RLS policies for mutual visibility."
```

**Terminal 2 - Frontend Setup:**
```bash
claude --subagent ui-builder "Create Next.js app with TypeScript, Tailwind, and PWA support using next-pwa. Set up basic layout components and mobile-first responsive design."
```

**Terminal 3 - Testing Setup:**
```bash
claude --subagent test-engineer "Set up Jest, React Testing Library, and Playwright. Create test structure and write initial test cases for user registration and event RSVP flows."
```

### **Week 2: Authentication & Profiles**
Run these 3 agents in parallel:

**Terminal 1 - Auth System:**
```bash
claude --subagent privacy-guardian "Implement Supabase Auth with email verification and Google OAuth. Add password reset flow and session management with proper security headers."
```

**Terminal 2 - Profile UI:**
```bash
claude --subagent ui-builder "Build profile creation flow with photo upload to Supabase Storage. Add interest selection (music, food, activities) and bio field. Make it mobile-friendly."
```

**Terminal 3 - Profile Tests:**
```bash
claude --subagent test-engineer "Write comprehensive tests for profile creation, photo upload, and privacy settings. Include edge cases for file size limits and invalid data."
```

### **Week 3: Matching Engine**
Run these 2 agents in parallel:

**Terminal 1 - Matching Algorithm:**
```bash
claude --subagent match-engine "Implement bio embedding generation using OpenAI API. Create match scoring with age similarity (±5 years), interest overlap, and semantic similarity. Store in match_scores table."
```

**Terminal 2 - Matching UI:**
```bash
claude --subagent ui-builder "Create 'People to Meet' component showing match percentages and reasons. Add visual indicators for high matches (80%+). Include profile preview cards."
```

### **Week 4: Events & Calendar**
Run these 3 agents in parallel:

**Terminal 1 - Event Features:**
```bash
claude --subagent db-architect "Create event CRUD operations with attendee matching. Add queries to find best matches among event attendees. Include favorited people indicators."
```

**Terminal 2 - Calendar Integration:**
```bash
claude --subagent integration-agent "Implement .ics file generation for events using ics.js library. Support recurring reminders and meeting slots. Ensure compatibility with Google Calendar, Outlook, and Apple Calendar."
```

**Terminal 3 - Event UI:**
```bash
claude --subagent ui-builder "Build event pages showing attendee matches. Add RSVP with match preview. Include calendar download buttons and 'Add to Calendar' functionality."
```

### **Week 5: Communication & Privacy**
Run these 3 agents in parallel:

**Terminal 1 - Chat System:**
```bash
claude --subagent ui-builder "Build simple 1-on-1 async chat interface using Supabase Realtime. Add message deletion and typing indicators. Keep it lightweight - no file sharing."
```

**Terminal 2 - Privacy Controls:**
```bash
claude --subagent privacy-guardian "Implement mutual visibility rules - if someone hides their age, they can't filter by age. Add block functionality and GDPR data export/deletion endpoints."
```

**Terminal 3 - Integration Tests:**
```bash
claude --subagent test-engineer "Write E2E tests for complete user journey: signup → profile → browse events → RSVP → view matches → chat. Test on mobile browsers."
```

### **Week 6: Polish & Deploy**
Run these 2 agents in parallel:

**Terminal 1 - Performance:**
```bash
claude --subagent match-engine "Optimize match queries with proper indexes. Implement caching strategy for match scores. Add batch processing for embeddings."
```

**Terminal 2 - Deployment:**
```bash
claude --subagent integration-agent "Deploy to Vercel with environment variables. Configure custom domain helloeveryone.fun. Set up monitoring and error tracking."
```

---

## 📁 **Project Structure (Simple Monolith)**

```
helloeveryone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected pages
│   │   ├── events/
│   │   ├── profile/
│   │   ├── matches/
│   │   └── chat/
│   ├── api/               # API routes
│   │   ├── match/
│   │   ├── calendar/
│   │   └── webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/               # Reusable UI components
│   ├── events/          # Event-specific components
│   ├── matching/        # Match cards, scores
│   └── chat/           # Chat interface
├── lib/
│   ├── supabase/       # Database client & queries
│   ├── matching/       # Matching algorithms
│   ├── calendar/       # ICS generation
│   └── utils/         # Helper functions
├── hooks/              # Custom React hooks
├── public/
│   └── manifest.json  # PWA manifest
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 🎯 **Success Metrics**

### **Technical KPIs**
- Match computation: < 100ms
- Page load: < 2s on 3G
- PWA score: > 90
- Test coverage: > 80%

### **User KPIs**
- Event → Connection rate: > 30%
- Match accuracy satisfaction: > 70%
- Return user rate: > 40%
- Average connections per event: 2-3

---

## 💡 **Architecture Decisions**

### **Why These Choices**
1. **pgvector over Pinecone**: Free, integrated with Supabase
2. **ICS files over Calendar APIs**: No OAuth complexity
3. **PWA over React Native**: Single codebase, easier updates
4. **Supabase Realtime for chat**: Built-in, no additional service
5. **Discord for groups**: Offload community management

### **What We're NOT Building**
- ❌ Video chat (use Discord)
- ❌ AI conversation starters (future)
- ❌ Personality quizzes (keep it simple)
- ❌ Karma/rating system (avoid gamification)
- ❌ Paid tier (not yet)

---

## 🔐 **Privacy-First Design**

### **Mutual Visibility Rules**
```typescript
// If user hides age, they can't filter by age
if (!profile.visible_fields.age) {
  disableAgeFiltering();
}

// Matches only shown if both users share the field
if (user1.visible_fields.occupation && user2.visible_fields.occupation) {
  showOccupationMatch();
}
```

### **Progressive Disclosure**
1. **Public**: First name, photo (optional)
2. **After RSVP**: Interests, bio preview
3. **After Chat**: Full profile
4. **Never Shown**: Email, phone, last name

---

## 🚦 **Go-Live Checklist**

- [ ] 10 test events created
- [ ] 50 beta users registered
- [ ] Match algorithm validated (survey users)
- [ ] Calendar downloads tested (all platforms)
- [ ] PWA installable on iOS/Android
- [ ] GDPR compliance verified
- [ ] Load tested (100 concurrent users)
- [ ] Discord server ready
- [ ] Privacy policy published
- [ ] Domain configured

---

**Remember: Focus on helping busy adults find 2-3 quality connections per event, not 20 superficial ones.**