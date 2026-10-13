# thomas-freeman.vercel.app

Personal site and portfolio. SvelteKit 2 / Svelte 5, deployed to Vercel, with a
small self-hosted CMS backed by Turso (libSQL).

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in the values below
pnpm dev
```

Requires Node 20+. The dev server needs a reachable Turso database — every page
reads its copy from the `content` table.

## Environment

| Variable                | Used for                                                     |
| ----------------------- | ------------------------------------------------------------ |
| `TURSO_DATABASE_URL`    | libSQL connection string for the content/session database     |
| `TURSO_AUTH_TOKEN`      | Turso auth token                                              |
| `CMS_ADMIN_EMAIL`       | The only address allowed to log in to the CMS                 |
| `RESEND_API_KEY`        | Sending the magic-link login email                            |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — project images and the Pizza Rush leaderboard   |
| `TOKEN`                 | GitHub token for listing repositories in the projects editor  |

`.env.staging` and `.env.production` hold the same keys for the `db:*` scripts.

## Scripts

| Command                  | Does                                             |
| ------------------------ | ------------------------------------------------ |
| `pnpm dev`               | Dev server                                       |
| `pnpm build` / `preview` | Production build / serve it locally              |
| `pnpm check`             | `svelte-kit sync` + `svelte-check`               |
| `pnpm lint`              | ESLint (`lint:fix` to autofix)                   |
| `pnpm format`            | Prettier                                         |
| `pnpm test:unit`         | Vitest — pure logic, no browser                  |
| `pnpm test:integration`  | Playwright — builds, previews, drives real pages |
| `pnpm test`              | Both                                             |

Playwright needs its browser once: `npx playwright install chromium`.

Database setup, per environment:

```bash
pnpm db:init:staging      # create tables
pnpm db:seed:staging      # seed structured content
pnpm db:migrate:staging   # apply migrations
```

Substitute `production` for the live database.

## How the CMS works

Login is passwordless. `/cms/login` mails a magic link to `CMS_ADMIN_EMAIL`
(15-minute expiry), `/cms/auth/verify` exchanges it for a `cms_session` cookie
(7 days). No other address can log in. `src/routes/cms/+layout.server.ts` gates
every CMS route apart from the login and verify pages.

All editable copy lives in one `content` table as `key` → `value` strings, most
of them JSON. Two flags matter:

- **`is_draft`** — drafts are visible only to a logged-in admin. `getContent()`
  takes an `isLoggedIn` argument that decides which version is returned, so the
  live site and the logged-in preview share one code path.
- **`content_history`** — every write records the previous value, which powers
  the history and revert UI.

Editing surfaces:

| Route            | Edits                                                         |
| ---------------- | ------------------------------------------------------------- |
| `/cms`           | Every content key as raw text/JSON, plus history and revert    |
| `/cms/projects`  | `projects.config` — which repos appear, their copy and images  |
| `/cms/resources` | `resources.links` — the /resources list                        |
| `/cms/meta`      | `site.meta` — home page title, description, social-card copy and the primary site URL |

Keys with a dedicated editor are listed in `src/lib/constants/content-keys.ts`
and filtered out of the generic `/cms` list.

### Adding a resource

`/cms/resources` is paste-driven: drop in a URL and `/api/cms/link-metadata`
fetches the page server-side and reads its title and description from `og:`
tags, falling back to `<title>`/`<meta description>`.

Because that endpoint fetches a URL chosen by the caller, it resolves the host
first and refuses anything that is not publicly routable — loopback, RFC1918,
link-local (including the cloud metadata address) and non-http(s) schemes. See
`src/lib/server/safe-url.ts` and its tests.

Link avatars are letter tiles generated from the title, so the page makes no
third-party requests.

## Storage

- **Turso** — content, sessions, magic links, history.
- **Vercel Blob** — uploaded project images (`repos/` prefix) and the Pizza Rush
  leaderboard. Uploads must not use the filesystem: Vercel's is read-only
  outside `/tmp` and `static/` is fixed at build time.
- **`static/`** — committed assets only. Images referenced by bare filename
  still resolve here for backwards compatibility (`resolveImageSrc`).

## Layout

```
src/lib/            components, and server-only helpers under lib/server
src/lib/db/         Turso client and the content/history queries
src/lib/auth/       magic link and session handling
src/routes/         pages; api/ for endpoints, cms/ for the admin
scripts/            database setup and the OG image generator
tests/              Playwright integration tests
```

Social card: the `og:`/`twitter:` tags, the canonical link and the home page
title and description are rendered from `site.meta` (edit at `/cms/meta`;
defaults in `src/lib/site-meta.ts`). Its `siteUrl` is the primary public
address: Vercel answers on several hostnames, and this one is what the
canonical link, `og:url`, the sitemap and `robots.txt` (both routes, not static
files) point at. The image is static: `node scripts/generate-og-image.mjs`
rewrites `static/og-image.png` with the published description when
`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set, else with the default. Rerun
it and commit the PNG whenever the copy, name or palette changes.
