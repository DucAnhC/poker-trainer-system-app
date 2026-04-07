# Production Deployment

## Current deployment shape

`poker-trainer-system` is currently a Next.js app with:

- Auth.js credentials authentication
- Prisma ORM
- a Prisma schema that currently uses `postgresql`
- account-backed persistence for attempts, sessions, and review notes

That means the app is currently well suited to a **Vercel deployment backed by a hosted Postgres database such as Neon**.

## Suitable deploy targets right now

Good fit:

- Vercel with a hosted Postgres database such as Neon
- a Node host or VM that can reach your managed Postgres instance
- a container platform that can reach your managed Postgres instance

Not a good fit in the current schema shape:

- deployments where the app cannot reach the configured Postgres database

## Runtime assumptions

- Node.js `>=18.18.0`
- `next start` runs the production server
- Prisma client is generated during install via `postinstall`
- Auth.js uses the app's own credentials flow, not OAuth providers

## Required production environment variables

- `DATABASE_URL`
  Current production-ready pattern: point this to your hosted Postgres database.
  Example: `postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require`
- `NEXTAUTH_SECRET`
  Must be a strong random secret in production.
- `NEXTAUTH_URL`
  Must be the exact public origin for the deployed app, such as `https://trainer.example.com`

## Auth callback and origin notes

This app currently uses **credentials auth only**.

- There is **no third-party OAuth callback registration** required yet.
- The important production setting is `NEXTAUTH_URL`.
- Auth.js routes will live under `${NEXTAUTH_URL}/api/auth/*`.
- Sign-in and sign-out flows use app-local routes such as `/auth`, `/dashboard`, and `/settings`.

If the app is behind a reverse proxy or load balancer:

- terminate HTTPS correctly
- forward the public host/origin accurately
- keep `NEXTAUTH_URL` aligned with the public origin

Practical live URLs to verify after deploy:

- `${NEXTAUTH_URL}/auth`
- `${NEXTAUTH_URL}/api/auth/signin`
- `${NEXTAUTH_URL}/api/auth/callback/credentials`
- `${NEXTAUTH_URL}/api/auth/signout`

## Production deployment steps

1. Provision a Vercel project or another Node.js host.
2. Set production environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. Install dependencies:
   - `npm install`
4. Ensure Prisma client is generated:
   - `npm run db:generate`
5. Apply the current schema to the target Postgres database:
   - `npm run db:push`
6. Run verification before exposing the app:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   - `npm run build`
7. Start the production server or complete the Vercel deploy.

## Practical validation points

Before calling the deployment ready, confirm:

- the configured Postgres database is reachable from the deployed app
- the app origin in `NEXTAUTH_URL` matches the real public URL
- account sign-in works on the deployed domain
- progress, review notes, and recent sessions survive a restart

## Related docs

- [Smoke Test Checklist](./smoke-test-checklist.md)
- [Flat Smoke Test Entry](../deployment-smoke-test.md)
