# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Registration Window And Yearly Data

Registration is controlled by environment dates instead of a manual boolean flag.

Required env vars:

- `REGISTRATION_START_DATE` (ISO date, e.g. `2026-01-01`)
- `REGISTRATION_END_DATE` (ISO date, e.g. `2026-08-31`)

The current registration year is derived automatically from `REGISTRATION_END_DATE`.

Legacy fallback (`REGISTRATION_IS_OPEN` + `YEAR`) is still supported temporarily, but should be removed after migration.

### Supabase migration for yearly registration tables

To enable automatic yearly table creation via Supabase interface, run the SQL migration:

- File: `supabase/migrations/20260423_ensure_yearly_registrations_table.sql`

You can execute it in one of these ways:

1. Supabase SQL Editor: paste and run the migration file.
2. Supabase CLI migrations (if used in your workflow).

After this migration is in place:

- `POST /api/register` ensures table `Registrations_<year>` exists and creates/extends its columns from `types/registration.ts` (`registrationStages`).
- `POST /api/upload` stores files under `consent/<year>/...`.
