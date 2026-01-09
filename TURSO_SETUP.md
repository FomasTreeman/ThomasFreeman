# Turso Database Setup Instructions

## 1. Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

## 2. Create Turso Account & Database

```bash
# Sign up (opens browser)
turso auth signup

# Create a new database
turso db create thomasfreeman-cms

# Get the database URL
turso db show thomasfreeman-cms --url

# Create an auth token
turso db tokens create thomasfreeman-cms
```

## 3. Initialize Database Schema

```bash
# Connect to your database
turso db shell thomasfreeman-cms

# Then run the schema from src/lib/db/init.ts
# Or use the initialization script
```

## 4. Add Environment Variables

### Local Development (.env)
```
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### Vercel (Production)
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `TURSO_DATABASE_URL`: Your database URL
   - `TURSO_AUTH_TOKEN`: Your auth token

## 5. Migrate Existing Data (Optional)

If you have existing SQLite data in `data/dashboard.db`:

```bash
# Use the turso CLI to import
turso db shell thomasfreeman-cms < path/to/export.sql
```

Or run the seed script:
```bash
node scripts/seed-structured-content.ts
```

## 6. Deploy

```bash
git add .
git commit -m "Migrate to Turso database"
git push
```

Vercel will automatically deploy with the new environment variables.

## Benefits

✅ Works on serverless (Vercel/Netlify/etc)
✅ Global edge replication  
✅ Free tier: 9GB storage, 1B reads/month
✅ SQLite-compatible syntax
✅ HTTPS API (no VPC needed)

## Troubleshooting

- **Connection errors**: Check your `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set correctly
- **Schema errors**: Run `initDb()` manually or check the database exists
- **Local dev**: Make sure `.env` file is in project root with the variables

## Rollback

If you need to rollback to SQLite locally:
1. Reinstall `better-sqlite3`
2. Revert the changes to `src/lib/db/init.ts` and `src/lib/db/content.ts`
3. Restore your `data/dashboard.db` backup
