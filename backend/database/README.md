# Database Migrations

This directory contains Knex migration files for the DebateHub database schema.

## Prerequisites

- PostgreSQL 14+ installed and running
- Database created (see below)

## Setup

### 1. Create the Database

```bash
# Using psql
createdb debatehub

# Or using psql command line
psql -U postgres
CREATE DATABASE debatehub;
\q
```

### 2. Configure Environment Variables

Copy the `.env.example` file in the backend directory to `.env` and update the database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=debatehub
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

Or use a full database URL:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/debatehub
```

## Running Migrations

### Run All Pending Migrations

```bash
npm run migrate:latest
```

This will create all the tables in the following order:
1. `users` - User accounts
2. `debates` - Debate topics and information
3. `debate_participants` - Users participating in debates
4. `messages` - Messages posted in debates
5. `fact_checks` - AI fact-check results (for moderated mode)
6. `user_stats` - User statistics and rating history

### Rollback Last Migration

```bash
npm run migrate:rollback
```

### Check Migration Status

```bash
npm run migrate:status
```

### Create a New Migration

```bash
npm run migrate:make migration_name
```

## Database Schema

### Tables Overview

#### users
- Stores user account information
- Includes username, email, password hash, rating, and profile data
- Indexed on username, email, and rating

#### debates
- Stores debate topics and metadata
- Supports two modes: 'unmoderated' and 'moderated'
- Tracks status: 'waiting', 'active', or 'concluded'
- Links to creator and optional winner
- Indexed on created_by, status, mode, and created_at

#### debate_participants
- Junction table linking users to debates
- Tracks which side participants are on: 'for', 'against', or 'neutral'
- Unique constraint ensures each user can only participate once per debate
- Indexed on debate_id, user_id, and side

#### messages
- Stores all messages posted in debates
- Includes flagging mechanism for inappropriate content
- Indexed on debate_id, user_id, created_at, and is_flagged

#### fact_checks
- Stores AI fact-check results for messages (moderated mode)
- Includes claim text, verification result, confidence score (0-1)
- Stores sources as JSONB array
- Indexed on message_id, confidence_score, and created_at

#### user_stats
- Stores aggregate statistics per user
- Tracks total debates, wins, losses, and draws
- Stores rating history as JSONB array of {date, rating} objects
- One-to-one relationship with users table
- Indexed on total_debates, wins, and updated_at

### Foreign Key Relationships

```
users (1) ──< (N) debates (created_by)
users (1) ──< (N) debates (winner_id, nullable)
users (1) ──< (N) debate_participants
users (1) ──< (N) messages
users (1) ──< (1) user_stats

debates (1) ──< (N) debate_participants
debates (1) ──< (N) messages

messages (1) ──< (N) fact_checks
```

## UUID Extension

The migrations automatically enable the `uuid-ossp` PostgreSQL extension for UUID generation. All primary keys use UUIDs instead of auto-incrementing integers for better scalability and security.

## TypeScript Types

TypeScript type definitions matching the database schema are available in:
```
backend/src/types/database.ts
```

These types include:
- Full table interfaces (e.g., `User`, `Debate`)
- Insert types (e.g., `UserInsert`, `DebateInsert`)
- Update types (e.g., `UserUpdate`, `DebateUpdate`)
- Enum types (e.g., `DebateMode`, `DebateStatus`, `ParticipantSide`)

## Seeding Data

To create seed data for development:

### Create a Seed File

```bash
npm run seed:make seed_name
```

### Run Seeds

```bash
npm run seed:run
```

## Troubleshooting

### "relation does not exist" Error

Make sure you've run the migrations:
```bash
npm run migrate:latest
```

### "uuid-ossp extension does not exist" Error

The first migration should automatically create this extension. If you encounter this error, you can manually create it:

```sql
psql -U postgres -d debatehub
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Connection Issues

- Verify PostgreSQL is running
- Check your `.env` configuration
- Ensure the database exists
- Verify user permissions

### Reset Database

To completely reset the database (⚠️ this will delete all data):

```bash
# Rollback all migrations
npm run migrate:rollback --all

# Run migrations again
npm run migrate:latest
```

## Production Considerations

- Always backup your database before running migrations in production
- Test migrations in a staging environment first
- Use database connection pooling (already configured)
- Consider using migration locking in multi-instance deployments
- Enable SSL for production database connections
