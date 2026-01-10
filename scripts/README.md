# Database Migration & Seeding Scripts

This directory contains scripts for managing database schema and content across different environments (local, staging, production).

## Quick Start

### Streamlined Migration (Recommended)

Use the unified migration script that handles both schema initialization and content seeding:

```bash
# Migrate staging database
pnpm db:migrate:staging

# Migrate production database
pnpm db:migrate:production

# Migrate local database (uses .env file)
pnpm db:migrate:local
```

### Legacy Scripts (Still Available)

If you prefer separate init and seed operations:

```bash
# Initialize schema only
pnpm db:init:staging
pnpm db:init:production

# Seed content only
pnpm db:seed:staging
pnpm db:seed:production
```

## Migration Script Features

The `migrate-db.ts` script combines initialization and seeding with additional features:

### Command-Line Options

- `--skip-seed` - Only initialize schema, skip seeding content
- `--force-reseed` - Force update all content (overwrites existing data)
- `--help` or `-h` - Show usage information

### Examples

```bash
# Full migration (schema + seed)
pnpm db:migrate:staging

# Only initialize schema (useful for schema updates)
pnpm db:migrate:staging --skip-seed

# Force update all content (careful - overwrites data!)
pnpm db:migrate:production --force-reseed
```

## Environment Configuration

Each environment requires a `.env` file with the following variables:

### `.env` (Local)
```env
TURSO_DATABASE_URL=libsql://your-local-db.turso.io
TURSO_AUTH_TOKEN=your-local-token
```

### `.env.staging`
```env
TURSO_DATABASE_URL=libsql://your-staging-db.turso.io
TURSO_AUTH_TOKEN=your-staging-token
```

### `.env.production`
```env
TURSO_DATABASE_URL=libsql://your-production-db.turso.io
TURSO_AUTH_TOKEN=your-production-token
```

## Database Schema

The migration creates the following tables:

### `content`
Stores all CMS content with draft/publish workflow support.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| key | TEXT | Unique content key |
| value | TEXT | Content value (supports JSON) |
| updated_at | DATETIME | Last update timestamp |
| is_draft | INTEGER | Draft flag (0=published, 1=draft) |
| display_order | INTEGER | Display order for UI |

### `sessions`
Stores active user sessions for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| token | TEXT | Unique session token |
| email | TEXT | User email |
| expires_at | DATETIME | Expiration timestamp |
| created_at | DATETIME | Creation timestamp |

### `magic_links`
Stores temporary magic link tokens for passwordless login.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| token | TEXT | Unique magic link token |
| email | TEXT | User email |
| expires_at | DATETIME | Expiration timestamp |
| created_at | DATETIME | Creation timestamp |

### `content_history`
Tracks all changes to content for audit and rollback purposes.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| key | TEXT | Content key that changed |
| old_value | TEXT | Previous value |
| new_value | TEXT | New value |
| action | TEXT | Action type (create/update/delete) |
| changed_at | DATETIME | Change timestamp |

## Content Structure

The seeded content follows this site structure:

1. **Hero Section** - Homepage top banner
   - `homepage.hero.title`
   - `homepage.hero.subtitle`

2. **About Section** - Personal information
   - `about.bio`
   - `about.social_links` (JSON array)
   - `about.resume_url`
   - `about.resume_label`

3. **Journey Section** - Work experience and timeline
   - `journey.header` (JSON object)
   - `journey.experiences` (JSON array)

4. **Projects Section** - Portfolio projects
   - `projects.config` (JSON array)

5. **Footer Section** - Contact and footer content
   - `contact.email`
   - `footer.content` (JSON object)

## Safety Features

### Default Behavior (Safe)
By default, the migration script will:
- ✅ Create tables if they don't exist
- ✅ Create indexes if they don't exist
- ✅ Insert content only if it doesn't exist
- ✅ Preserve existing content

### Force Reseed (Dangerous)
Use `--force-reseed` with caution:
- ⚠️ Overwrites ALL content with default values
- ⚠️ Loses any manual edits made via CMS
- ✅ Useful for resetting development databases
- ❌ Rarely needed for production

## Workflow Examples

### Initial Setup (New Database)
```bash
# Staging
pnpm db:migrate:staging

# Production
pnpm db:migrate:production
```

### Schema Update (Preserve Data)
```bash
# Add new tables/indexes without touching content
pnpm db:migrate:staging --skip-seed
pnpm db:migrate:production --skip-seed
```

### Development Reset
```bash
# Reset local database to defaults
pnpm db:migrate:local --force-reseed
```

### Production Deployment
```bash
# Safe migration - only adds missing content
pnpm db:migrate:production

# Review changes via CMS before publishing
# Visit: https://your-site.com/cms
```

## Troubleshooting

### "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set"
- Ensure your `.env.staging` or `.env.production` file exists
- Check that the file contains both required variables
- Verify the `dotenv-cli` package is installed

### "Migration failed"
- Check database connection credentials
- Verify network connectivity to Turso
- Ensure you have write permissions on the database

### Content Not Updating
- By default, existing content is preserved
- Use `--force-reseed` to overwrite (caution!)
- Or manually update via CMS interface

## Best Practices

1. **Always test migrations on staging first**
   ```bash
   pnpm db:migrate:staging
   # Test the site, verify content
   # If all good, then:
   pnpm db:migrate:production
   ```

2. **Backup before force-reseeding**
   - Export content via CMS if needed
   - Or use Turso's backup features

3. **Use version control for content changes**
   - Update `structuredContent` in `migrate-db.ts`
   - Commit changes to git
   - Deploy with confidence

4. **Monitor migrations**
   - Review the console output
   - Check for errors or skipped items
   - Verify via CMS interface

## Script Files

- `migrate-db.ts` - **Unified migration script (recommended)**
- `init-turso-db.ts` - Legacy schema initialization
- `seed-structured-content.ts` - Legacy content seeding

## Related Documentation

- [Turso Documentation](https://docs.turso.tech/)
- [libSQL Client](https://github.com/libsql/libsql-client-ts)
- Project CMS: `/cms` route
