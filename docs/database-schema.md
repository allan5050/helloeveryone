# Database Schema Documentation

## Overview
This document provides the definitive source of truth for the HelloEveryone database schema. It documents the actual database structure as deployed in Supabase, resolving discrepancies between TypeScript interfaces and database columns.

NOTE: you can use MCP tools to directly query Supabase to get the latest info because this document might go out of date (see 'C:\Users\Allan\source\repos\helloeveryone\mcp')

## Tables

### profiles
The main user profile table storing user information and preferences.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated profile ID |
| user_id | UUID | UNIQUE NOT NULL | References auth.users |
| display_name | TEXT | NOT NULL | User's display name |
| bio | TEXT | | User's biography |
| age | INTEGER | CHECK (18-100) | User's age |
| location | TEXT | | User's location |
| interests | TEXT[] | | Array of interest keywords |
| embedding | VECTOR(1536) | | OpenAI embedding for semantic matching |
| role | user_role | DEFAULT 'user' | User role (user/admin) |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Profile creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Important Notes:**
- NO `avatar_url` column - avatars should be handled separately or via storage
- NO `first_name` or `last_name` columns - using `display_name` instead
- NO `photo_url` column
- NO `visible_fields` JSONB column

### events
Stores event information created by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated event ID |
| title | TEXT | NOT NULL | Event title |
| description | TEXT | | Event description |
| location | TEXT | NOT NULL | Event location |
| start_time | TIMESTAMPTZ | NOT NULL | Event start time |
| end_time | TIMESTAMPTZ | NOT NULL | Event end time |
| max_attendees | INTEGER | CHECK > 0 | Maximum number of attendees |
| created_by | UUID | NOT NULL FK | References profiles.user_id |
| is_active | BOOLEAN | DEFAULT true | Event active status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Important Notes:**
- NO `date` column - use `start_time` instead
- NO `event_type` column
- NO `capacity` column - use `max_attendees` instead

### match_scores
Stores matching scores between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated match ID |
| user_id_1 | UUID | NOT NULL FK | First user in match |
| user_id_2 | UUID | NOT NULL FK | Second user in match |
| combined_score | REAL | CHECK (0-1) | Overall match score (0-1) |
| interest_score | REAL | | Interest similarity score |
| bio_similarity | REAL | | Bio text similarity score |
| age_compatibility | REAL | | Age compatibility score |
| location_score | REAL | | Location proximity score |
| common_interests | TEXT[] | | Shared interests array |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Score calculation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

**Important Notes:**
- NO `total_score` column - use `combined_score` instead
- Scores are stored as 0-1 decimals, multiply by 100 for percentage display

### rsvps
Tracks event attendance.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated RSVP ID |
| event_id | UUID | NOT NULL FK | References events.id |
| user_id | UUID | NOT NULL FK | References profiles.user_id |
| status | rsvp_status | NOT NULL | going/maybe/not_going |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | RSVP creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### messages
Stores user-to-user messages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated message ID |
| sender_id | UUID | NOT NULL FK | References profiles.user_id |
| recipient_id | UUID | NOT NULL FK | References profiles.user_id |
| content | TEXT | NOT NULL | Message content |
| is_read | BOOLEAN | DEFAULT false | Read status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Send time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### favorites
Tracks user favorite relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated favorite ID |
| user_id | UUID | NOT NULL FK | User who favorited |
| favorite_user_id | UUID | NOT NULL FK | User being favorited |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Favorite creation time |

### blocks
Tracks user blocking relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated block ID |
| blocker_id | UUID | NOT NULL FK | User who blocked |
| blocked_id | UUID | NOT NULL FK | User being blocked |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Block creation time |

### meeting_slots
Tracks scheduled meetings between matched users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated slot ID |
| event_id | UUID | NOT NULL FK | References events.id |
| user_id_1 | UUID | NOT NULL FK | First participant |
| user_id_2 | UUID | NOT NULL FK | Second participant |
| slot_time | TIMESTAMPTZ | NOT NULL | Meeting time |
| duration_minutes | INTEGER | DEFAULT 30 | Meeting duration |
| status | meeting_status | | proposed/confirmed/completed/cancelled |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

## Enum Types

### user_role
- `user` - Regular user
- `admin` - Administrator

### rsvp_status
- `going` - Attending event
- `maybe` - Tentative attendance
- `not_going` - Not attending

### meeting_status
- `proposed` - Meeting suggested
- `confirmed` - Meeting accepted
- `completed` - Meeting occurred
- `cancelled` - Meeting cancelled

## Common Column Mapping Issues

### TypeScript Interface vs Database Reality

| TypeScript Interface | Database Column | Notes |
|---------------------|-----------------|-------|
| `first_name` | ❌ Does not exist | Use `display_name` |
| `last_name` | ❌ Does not exist | Use `display_name` |
| `avatar_url` | ❌ Does not exist | Handle via storage/CDN |
| `photo_url` | ❌ Does not exist | Handle via storage/CDN |
| `total_score` | `combined_score` | Renamed in database |
| `date` (events) | `start_time` | Use timestamp field |
| `event_type` | ❌ Does not exist | Could be added if needed |
| `capacity` | `max_attendees` | Different naming |

## Migration History

- `001_initial_schema.sql` - Initial database setup with all core tables
- `20250106_fix_rls_infinite_recursion.sql` - Fixed RLS policy recursion issues

## Best Practices

1. **Always check this document** before writing queries or updating TypeScript interfaces
2. **Use `display_name`** for user identification, not first/last name
3. **Multiply `combined_score` by 100** when displaying as percentage
4. **Use `start_time`** for event dates, not a separate date field
5. **Handle avatars externally** - no avatar_url in profiles table

## TypeScript Interface Updates Needed

To align with the actual database schema, the following TypeScript interfaces need updates:

1. Remove `avatar_url`, `photo_url`, `first_name`, `last_name` from Profile interface
2. Change `total_score` to `combined_score` in MatchScore interface
3. Ensure all queries use correct column names

## Storage Strategy for Avatars

Since `avatar_url` doesn't exist in the database, consider:
1. Using Supabase Storage for avatar images
2. Generating avatars based on `display_name` initials
3. Using a separate avatars table if needed
4. Using external CDN/service for avatar management