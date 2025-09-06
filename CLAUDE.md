# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

HelloEveryone.fun is a smart social matching platform that helps busy adults (25-50) find meaningful
connections through intelligent matching at local events. Built with Next.js 14, Supabase, and
TypeScript.

**Production URL**: https://helloeveryone.vercel.app  
**GitHub**: allan5050/helloeveryone

## Key Development Commands

### Development

```bash
npm run dev          # Start Next.js dev server on http://localhost:3000
npm run build        # Build production application
npm run start        # Start production server
```

### Testing & Quality

```bash
npm run test         # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright end-to-end tests
npm run test:integration  # Run integration tests
npm run lint         # Run Next.js linter
npm run type-check   # Run TypeScript type checking (tsc --noEmit)
```

### Database

```bash
npm run db:setup     # Initialize database tables and enable pgvector
npm run db:seed      # Populate database with sample data
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, PWA-enabled
- **Database**: Supabase (PostgreSQL with pgvector for semantic matching)
- **Matching Engine**: pgvector for semantic search with OpenAI embeddings
- **Auth**: Supabase Auth with AuthContext provider (email/password + Google OAuth)
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form with Zod validation
- **Typography**: Inter font (Google Fonts)
- **Deployment**: Vercel (automatic deployments from GitHub)

### Project Structure

```
app/                 # Next.js App Router pages
├── (public)/       # Public pages (login, signup, reset-password)
├── (dashboard)/    # Protected pages (events, profile, matches, chat)
├── api/           # API routes for matching, calendar, webhooks
├── auth/callback/ # OAuth callback handler
├── contexts/      # React contexts (AuthContext)
├── components/    # App-specific components (LogoutButton, ProtectedRoute)
components/         # Shared React components organized by feature
lib/               # Core business logic
├── supabase/      # Database client & queries
├── api/auth.ts    # Server-side auth helpers (requireAuth, getCurrentUser)
├── matching/      # Matching algorithms
├── calendar/      # ICS generation
hooks/             # Custom React hooks
types/             # TypeScript type definitions
```

### Path Aliases

- `@/*` maps to root directory
- `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*` for clean imports

## Core Features & Implementation

### Matching Algorithm

The matching system uses a sophisticated scoring algorithm:

- 40% common interests (exact and fuzzy matching)
- 30% bio semantic similarity (using pgvector cosine distance)
- 20% age proximity (±5 years optimal)
- 10% location and availability

Match scores must compute in <100ms. Uses materialized views for caching.

### Privacy-First Design

- **Mutual Visibility**: Users can only filter by fields they share
- **Progressive Disclosure**: Information revealed gradually as trust builds
- All tables have Row Level Security (RLS) policies
- Never expose raw embeddings or internal scores

### Database Schema

Key tables: `profiles`, `events`, `rsvps`, `favorites`, `messages`, `match_scores`

- Uses pgvector extension for semantic search
- JSONB for flexible profile fields and interests
- Materialized views for performance optimization

### PWA Requirements

- Manifest at `/public/manifest.json`
- Service worker via next-pwa
- Mobile-first responsive design
- Offline capability for critical features

## Development Guidelines

### Code Conventions

- Strict TypeScript (`strict: true` in tsconfig.json)
- Path aliases for clean imports
- Component-based architecture with feature organization
- Server components by default, client components when needed

### Testing Strategy

- Unit tests with Jest for business logic
- Integration tests for API endpoints
- E2E tests with Playwright for critical user flows
- Test coverage target: >80%

### Performance Targets

- Page load: <2s on 3G
- Match computation: <100ms
- PWA score: >90
- Bundle size optimization with code splitting

### Specialized Agents

The `.claude/agents/` directory contains specialized agent configurations:

- **db-architect**: Database schema, migrations, pgvector optimization
- **api-engineer**: Next.js API routes, Supabase queries, OpenAI integration
- **frontend-builder**: React/Next.js UI, Tailwind CSS, PWA features
- **match-engineer**: Matching algorithms, scoring, recommendations
- **privacy-guardian**: Privacy controls, GDPR compliance, RLS policies
- **test-engineer**: Testing strategy, Jest, Playwright
- **devops-engineer**: Vercel deployment, environment management
- **integration-specialist**: Calendar systems, file uploads, third-party services

## Important Notes

- Never commit secrets or API keys - use environment variables
- All database changes require proper migrations
- Follow mutual visibility rules for all matching features
- Prioritize mobile experience (PWA-first approach)
- Use ICS files for calendar integration (no OAuth complexity)

## Authentication Implementation

- **Auth Provider**: `app/contexts/AuthContext.tsx` - Client-side auth state management
- **Server Auth**: `lib/api/auth.ts` - Server-side auth helpers (requireAuth, getCurrentUser)
- **Auth Routes**: `/login`, `/signup`, `/auth/reset-password`
- **Protected Routes**: Use `ProtectedRoute` component or `requireAuth()` helper
- **Session Management**: Automatic via Supabase Auth with cookie-based sessions
- **OAuth**: Google OAuth ready (requires Google Client ID configuration)

## Database Access (MCP Tools)

The `mcp/` folder contains Model Context Protocol tools for direct database access:

```bash
# Quick database context for LLMs
node mcp/quick-start.js

# Interactive query mode
node mcp/query.js

# Export complete schema
node mcp/get-schema.js json      # Machine-readable JSON
node mcp/get-schema.js markdown  # Human-readable documentation

# Database inspection
node mcp/inspect-db.js

# Query shortcuts
node mcp/query.js :tables        # List all tables
node mcp/query.js :count profiles  # Get row count
node mcp/query.js :sample events 3 # Sample data
```

**Key Files:**
- `mcp/db-client.js` - Database connection and utility methods
- `mcp/schema.json` - Auto-generated complete database schema
- `mcp/README.md` - Full documentation for MCP tools

Use these tools to autonomously query and understand the database without manual schema sharing.

## Documentation

The `docs/` folder contains comprehensive project documentation:

**Architecture & Planning:**
- `ARCHITECTURE.md` - System architecture and design patterns
- `DATABASE_SCHEMA.md` - Complete database schema documentation
- `database-schema.md` - Updated schema with pgvector support
- `IMPLEMENTATION_PLAN.md` - Development roadmap

**Features & Systems:**
- `MATCHING_SYSTEM.md` - AI-powered matching algorithm details
- `RSVP_SYSTEM.md` - Event RSVP functionality
- `AUTHENTICATION.md` - Auth flow and session management
- `PWA.md` - Progressive Web App implementation

**Development:**
- `API_ROUTES.md` - API endpoint documentation
- `COMPONENTS.md` - React component hierarchy
- `HOOKS.md` - Custom React hooks documentation
- `TESTING.md` - Testing strategy and guidelines
- `DEPLOYMENT.md` - Deployment process and configuration

**Database:**
- `DATABASE_SETUP.md` - Database initialization guide
- `DATABASE_FIXES_SUMMARY.md` - Migration history
- `rls-policies.md` - Row Level Security documentation

**Reference:**
- `INDEX.md` - Documentation index and navigation
- `KNOWN_ISSUES.md` - Current issues and workarounds
- `TESTING_CHECKLIST.md` - Pre-deployment testing checklist
- `DEPLOYMENT_CHECKLIST.md` - Deployment verification steps

## Environment Variables

Required in `.env.local` and Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DB_PASSWORD=your-database-password  # Required for MCP tools
SUPABASE_SERVICE_ROLE_API_KEY=your-service-role-key  # For admin operations
```

See `env.example` for complete environment variable documentation.
