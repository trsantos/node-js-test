# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing

- `npm test` - Run tests via Docker Compose (executes tests inside container)
- `docker-compose exec app npm run test:container` - Run Jest tests directly in container
- Tests use Jest with global setup/teardown in `jest-setup/` directory

### Code Formatting

- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

### Docker Development

- `docker-compose up --build -d` - Start all services (app, MariaDB, Valkey cache)
- `docker-compose exec app <command>` - Execute commands inside the app container
- API runs on port 3000, accessible at `http://localhost:3000/api`

## Architecture Overview

This is a Node.js/Express REST API following a strict layered architecture pattern with clear separation of concerns:

### Core Layers (in dependency order)

1. **Models** (`src/models/`) - Sequelize ORM models defining database schemas
2. **Repositories** (`src/repositories/`) - Data access layer, encapsulate database operations
3. **Services** (`src/services/`) - Business logic layer, external API integrations
4. **Controllers** (`src/controllers/`) - HTTP layer, handle requests/responses

### Key Components

- **Database**: MariaDB with Sequelize ORM
- **Caching**: Valkey (Redis-compatible) using `iovalkey` client
- **Validation**: express-validator with input sanitization (trim, escape)
- **Error Handling**: Centralized middleware with specific Sequelize error mapping

### Data Models

- **Project**: `name` (required), `description` (optional), `githubRepos` (JSON field)
- **Task**: `title` (required), `description` (optional), `status` (enum: pending/in-progress/completed)
- **Relationship**: Project hasMany Tasks, Task belongsTo Project

### GitHub Integration

- Endpoint: `GET /api/projects/:id/github/:username`
- Fetches user's 5 most recently updated repositories
- Caches responses for 10 minutes (600 seconds) using Valkey
- Updates project's `githubRepos` JSON field with fetched data
- Maps repo data to: `{name, description, url}` format

### Validation Rules

- **Projects**:
  - Name: Required on create, 1-255 characters, alphanumeric + safe punctuation only
  - Description: Optional, max 2000 characters
- **Tasks**:
  - Title: Required on create, 1-255 characters
  - Description: Optional, max 2000 characters
  - Status: Must be `pending`, `in-progress`, or `completed`
- All string inputs are trimmed and escaped for security
- Validation errors return 400 status with detailed field-specific messages

### Error Handling Strategy

- ValidationError (Sequelize): 400 with field-specific messages
- ForeignKeyConstraintError: 404 with user-friendly message about missing related resource
- Custom errors: Use `err.statusCode` property for HTTP status
- All errors logged to console with stack traces

### Environment Configuration

Required environment variables:

**Database Connection:**

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MariaDB connection settings

**Cache Connection:**

- `CACHE_HOST`, `CACHE_PORT` - Valkey cache connection settings

**Application:**

- `NODE_ENV` - Application environment (`development`, `production`, `test`)
- `MARIADB_ROOT_PASSWORD` - Root password for MariaDB (from `.env` file)

**Setup:** Copy `.env.example` to `.env` before running `docker-compose up`

### API Endpoints Added

**Missing endpoints that were implemented:**

- `GET /api/tasks/:id` - Retrieve individual task by ID
- `GET /api/projects/:id/tasks` - List all tasks for a specific project

**Complete CRUD coverage:**

- Projects: Create, Read (all/single), Update, Delete + GitHub integration
- Tasks: Create, Read (single/by-project), Update, Delete
