# HelloEveryone.fun 🤝

> **Smart social matching for meaningful connections** - Helping busy adults (25-50) find real
> friends through intelligent matching at local events.

🌐 **Live at**: [https://helloeveryone.vercel.app](https://helloeveryone.vercel.app)

## 🎯 Problem We Solve

Adults waste precious time at social events talking to random people with whom they have nothing in
common. We solve this by showing you **exactly who to meet** based on compatibility scores.

## ✨ Key Features

- **Smart Matching**: See compatibility scores (65-95%) with other attendees
- **"People to Meet"**: Top 3-5 matches highlighted at each event
- **Privacy-First**: Mutual visibility - you can't search what you don't share
- **Universal Calendar**: Download events to any calendar app
- **Mobile-Ready**: Progressive Web App works on all devices
- **Simple Chat**: Connect 1-on-1 before or after events

## 🚀 Quick Start

```bash
# Prerequisites
node >= 18.0.0
npm >= 9.0.0

# Clone and install
git clone https://github.com/allan5050/helloeveryone.git
cd helloeveryone
npm install

# Environment setup
cp .env.example .env.local
# Add your Supabase and OpenAI keys to .env.local

# Database setup
npm run db:setup    # Creates tables and enables pgvector
npm run db:seed     # Adds sample data

# Development
npm run dev         # Starts Next.js on http://localhost:3000

# Testing
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
```

## 📁 Project Structure

```
helloeveryone/
├── app/                    # Next.js 14 App Router
│   ├── (public)/          # Public routes (login, signup)
│   ├── (dashboard)/       # Protected routes
│   ├── auth/callback/     # OAuth callback handler
│   └── contexts/          # AuthContext provider
├── components/            # React components
├── lib/                   # Core business logic
│   └── api/auth.ts        # Server auth helpers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── public/               # Static assets + PWA manifest
├── supabase/             # Database migrations
├── mcp/                  # Database access tools for LLMs
│   ├── db-client.js      # Database connection utilities
│   ├── query.js          # Interactive query tool
│   └── schema.json       # Auto-generated schema
├── tests/                # Test suites
├── docs/                 # Comprehensive documentation
└── .claude/              # AI agent configurations
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL + pgvector)
- **Matching**: Semantic search with OpenAI embeddings
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Calendar**: ics.js for universal compatibility
- **Hosting**: Vercel Edge Network (auto-deploy from GitHub)

## 📊 Matching Algorithm

Our matching engine considers:

- **40%** - Common interests (music, food, activities)
- **30%** - Bio semantic similarity
- **20%** - Age proximity (±5 years optimal)
- **10%** - Location and availability

Match scores range from 0-100%, with 70%+ indicating high compatibility.

## 🔒 Privacy & Security

- **Mutual Visibility**: Can only filter by fields you share
- **Progressive Disclosure**: More info revealed as trust builds
- **GDPR Compliant**: Full data export and deletion
- **Secure by Default**: RLS policies, input sanitization

## 📈 Success Metrics

- Event → Connection Rate: >30%
- Match Satisfaction: >70%
- Page Load (3G): <2s
- Match Computation: <100ms

## 🧪 Testing

```bash
npm run test              # Jest unit tests
npm run test:integration  # API integration tests
npm run test:e2e         # Playwright E2E tests
npm run test:load        # K6 load testing
```

## 🗄️ Database Tools (MCP)

The `mcp/` folder contains powerful database introspection and query tools:

```bash
# Quick database overview
node mcp/quick-start.js

# Interactive query mode
node mcp/query.js

# Export schema documentation
node mcp/get-schema.js json      # Machine-readable
node mcp/get-schema.js markdown  # Human-readable

# Common queries
node mcp/query.js :tables        # List all tables
node mcp/query.js :count users   # Get row count
node mcp/query.js :sample events 5  # Sample data
```

These tools enable LLMs and developers to autonomously explore the database without manual schema sharing.

## 📝 Documentation

**Core Documentation:**
- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Technical architecture
- [Deployment Guide](./DEPLOYMENT.md) - Vercel & Supabase setup
- [CLAUDE.md](./CLAUDE.md) - AI/LLM development guide

**In `docs/` folder:**
- [Architecture](./docs/ARCHITECTURE.md) - System design patterns
- [API Routes](./docs/API_ROUTES.md) - Endpoint reference
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Table structures
- [Matching System](./docs/MATCHING_SYSTEM.md) - How matching works
- [Components](./docs/COMPONENTS.md) - UI component patterns
- [Testing](./docs/TESTING.md) - Test strategies
- [Authentication](./docs/AUTHENTICATION.md) - Auth flows
- [PWA](./docs/PWA.md) - Progressive Web App features
- [Index](./docs/INDEX.md) - Complete documentation index

## 🤝 Contributing

This is currently a private project. See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for
development guidelines.

## 📄 License

Proprietary - All rights reserved

## 🚦 Status

🟡 **Beta Development** - Target launch: 6 weeks

---

**Built with ❤️ **
