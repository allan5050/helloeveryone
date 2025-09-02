# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
HelloEveryone.fun is a smart social matching platform that helps busy adults (25-50) find meaningful connections through intelligent matching at local events. Built with Next.js 14, Supabase, and TypeScript.

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
- **Auth**: Supabase Auth with AuthContext provider
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form with Zod validation
- **Typography**: Inter font (Google Fonts)

### Project Structure
```
app/                 # Next.js App Router pages
├── (auth)/         # Authentication pages
├── (dashboard)/    # Protected pages (events, profile, matches, chat)
├── api/           # API routes for matching, calendar, webhooks
├── contexts/      # React contexts (AuthContext)
components/         # React components organized by feature
lib/               # Core business logic
├── supabase/      # Database client & queries
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