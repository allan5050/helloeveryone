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

### **Phase 1: Core Platform** 
✅ **Must Have**
- User registration with email verification
- Basic profile (name, age, photo, 3 interests)
- Event listing and RSVP
- Simple profile privacy (show/hide photo)

### **Phase 2: Smart Matching** 
✅ **High Value**
- Semantic bio matching using pgvector
- Interest-based matching (exact + fuzzy)
- "People to Meet" suggestions at events
- Match score visualization

### **Phase 3: Connection Tools** 
✅ **Medium Value**
- Profile favorites/bookmarks
- Simple 1-on-1 async chat
- Calendar download (.ics files)
- Block/report functionality

### **Phase 4: Enhanced Experience** 
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