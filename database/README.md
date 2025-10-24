# Database

This directory contains database-related files for the DebateHub project.

## Structure

- `migrations/` - Database migration files
- `seeds/` - Database seed files for development and testing

## Setup

1. Create a PostgreSQL database:
```bash
createdb debatehub
```

2. Configure your database connection in `backend/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/debatehub
```

3. Run migrations:
```bash
cd backend
npm run migrate:up
```

## Creating Migrations

To create a new migration:
```bash
cd backend
npm run migrate create migration-name
```

## Running Seeds

Seed files can be used to populate the database with initial or test data.

To run seeds:
```bash
cd backend
npm run seed
```

## Migration Commands

- `npm run migrate:up` - Run all pending migrations
- `npm run migrate:down` - Rollback the last migration
- `npm run migrate create <name>` - Create a new migration file
