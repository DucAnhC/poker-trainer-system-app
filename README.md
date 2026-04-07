# poker-trainer-system

`poker-trainer-system` is a docs-first repository for a web-based No-Limit Texas Hold'em training platform. The product is intended to help players make better decisions through structured, scenario-based practice rather than through static hand charts alone.

## Core idea

The system should train decision quality, not single-hand memorization.

It is being planned around these principles:

- Think in ranges, not exact hand guesses.
- Judge decisions in context: position, stack depth, action history, board texture, and player type all matter.
- Separate beginner heuristics, solid baseline strategy, and exploitative deviations.
- Teach why an action is good, not only which button to click.
- Start with mock data and simplified assumptions that are labeled clearly.

## Why this project is different

Many poker tools stop at chart lookup. This project is broader:

- `Preflop trainer`: opening, calling, 3-betting, 4-betting, folding, and stack-depth awareness.
- `Postflop learning support`: c-betting, pot control, value betting, bluffing, bluff-catching, and board interpretation.
- `Math training`: pot odds, outs, implied odds, and quick equity intuition.
- `Adjustment training`: player archetypes and exploit-focused decisions.
- `Review and progress`: hand review notes, leak tags, training history, and module-level progress feedback.

## Planned MVP feature areas

- Dashboard
- Preflop trainer
- Postflop trainer lite
- Pot odds quiz
- Board texture quiz
- Player type exploit quiz
- Hand review notes
- Basic progress tracking with local storage or mock persistence
- Handbook-driven educational content

## Current project status

The repository is currently in `Phase 10: deployment prep, production configuration, and smoke-test readiness`.

What exists now:

- Product proposal, requirements, design docs, phased plan, and handbook content
- Next.js + TypeScript + Tailwind scaffold
- Auth.js credentials-based sign-in flow with a minimal account page
- Lightweight settings area for account state, sync guidance, recent history, and data-management controls
- Prisma ORM setup with a PostgreSQL datasource that works with hosted providers such as Neon
- Shared layout and navigation
- Interactive Preflop Trainer, Postflop Trainer, Pot Odds Quiz, Board Texture Quiz, and Player Types Quiz routes
- Working Hand Review route with local or account-backed note creation, leak-tag assignment, saved-note detail view, and delete flow
- Shared explanation feedback with key concept labels, answer summaries, core reasoning, weaker-line comparisons, assumptions, and leak-linked guidance
- Richer content-pack structure across modules, with pack selection inside trainer pages and pack-aware study links
- Lightweight follow-up suggestions that can step the learner into a related easier pack, a nearby harder pack, or an adjacent supporting concept
- Dashboard progress summaries with local or account-backed module status, recent-session history, recent review activity, weak-session context, leak themes, review-driven module hints, adaptive recommendations, guided study-path cards, quick resume links, and local-to-cloud import
- Combined study timeline previews that blend recent sessions and review-note activity into a clearer study history
- Clearer account-mode messaging in the header, auth page, dashboard, and sync tools
- Safer local/cloud migration messaging with local-vs-account snapshot previews and explicit merge language
- Lightweight user-facing study analytics such as recent attempts, recent completed sessions, recent review volume, and active study days
- Local backup utilities for exporting, importing, and resetting browser-stored training progress safely
- Route-level loading fallbacks plus a global error boundary for calmer failure handling on key pages
- Baseline Vitest coverage for core progress, selector, timeline, and local-backup logic
- Production deployment notes plus a post-deploy smoke-test checklist
- Core domain types for modules, scenarios, attempts, sessions, and review notes
- Small mock data sets for positions, archetypes, stack depths, and sample scenarios
- Progress tracking with localStorage-backed anonymous mode plus database-backed account mode for attempts, sessions, and review notes
- Lightweight content-pack and scenario-authoring validation so future mock content stays consistent and duplicate IDs are caught early

What does not exist yet:

- AI coaching
- Solver integrations
- Admin tooling
- Full hand-history import

## Documentation-first workflow

Future implementation should start by reading these files in order:

1. `/specs/poker-trainer-system/proposal.md`
2. `/specs/poker-trainer-system/requirements.md`
3. `/specs/poker-trainer-system/design.md`
4. `/specs/poker-trainer-system/tasks.md`
5. `/PROJECT_RULES.md`
6. `/AGENTS.md`
7. `/TASK.md`

The handbook in `/docs/handbook/` should be treated as a content and education reference for building trainer flows, explanation copy, and scenario metadata.

## Getting started

Install dependencies and run the app locally:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Before the first run, copy `.env.example` to `.env` and set the required values:

```bash
copy .env.example .env
```

Minimum local config:

- `DATABASE_URL`: PostgreSQL connection string for local dev or a hosted provider such as Neon.
- `NEXTAUTH_SECRET`: required for Auth.js; use a strong random value before deployment.
- `NEXTAUTH_URL`: local origin in development, deployed origin in production.

Useful verification commands:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Planned technical direction

The intended implementation stack is:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Auth.js (`next-auth`) with credentials auth
- Prisma ORM
- PostgreSQL, with a simple Prisma schema that works with hosted providers such as Neon

## Deployment notes

- The current Prisma schema now uses `postgresql`, so Vercel plus a hosted Postgres provider such as Neon is a practical deployment target.
- Set `NEXTAUTH_SECRET` to a real secret before deployment.
- Set `NEXTAUTH_URL` to the exact deployed app origin so Auth.js request and callback handling stays correct.
- Credentials auth is the only auth flow today, so there is no third-party OAuth console callback to register yet.
- After deploy, verify these live auth URLs behave normally on the public origin:
  - `${NEXTAUTH_URL}/auth`
  - `${NEXTAUTH_URL}/api/auth/signin`
  - `${NEXTAUTH_URL}/api/auth/callback/credentials`
  - `${NEXTAUTH_URL}/api/auth/signout`
- Run `npm run db:push` against the target Postgres database before starting the app for the first time or after schema changes.
- The current product keeps scenario content repo-based. Only user data is persisted through Prisma.

Detailed deployment notes:

- `/docs/deployment/production-deployment.md`
- `/docs/deployment/smoke-test-checklist.md`
- `/docs/deployment-smoke-test.md`

This repository should not skip directly into app code without checking that implementation still matches the approved scope in the spec files.

## Suggested future code structure

The current implementation is organized around:

```text
src/
  app/
    dashboard/
    trainer/
      preflop/
      postflop/
      pot-odds/
      board-texture/
      player-types/
    review/
    handbook/
  components/
    ui/
    layout/
    trainer/
  features/
    auth/
    preflop/
    postflop/
    pot-odds/
    board-texture/
    player-types/
    persistence/
    progress/
    review/
  lib/
    poker/
    training/
    progress/
    review/
    persistence/
  data/
    content-packs.ts
    scenarios/
  types/
```

## Folder structure summary

- `/specs/poker-trainer-system`: product, requirements, design, and phased delivery docs
- `/docs/handbook`: structured poker learning material mapped to future training modules
- `/src/app`: current app routes including active preflop, postflop, math, texture, exploit, review, and handbook flows
- `/src/components`: layout, trainer, and UI building blocks
- `/src/data`: mock poker domain data, content packs, and sample scenarios
- `/src/features`: module logic plus auth, persistence-facing hooks, progress, and review flows
- `/src/lib`: helpers for poker labels, formatting, storage, retry ordering, and session scaffolding
- `/src/types`: core TypeScript domain models
- `/AGENTS.md`: rules for future AI coding agents
- `/PROJECT_RULES.md`: repository execution and content conventions
- `/TASK.md`: short operational checklist for build sessions

## Implementation guidance for future sessions

- Stay within the active phase from `/specs/poker-trainer-system/tasks.md`.
- Prefer mock data before any database work.
- Label all simplified poker guidance as a training simplification.
- Keep explanations modular so they can be reused across quiz modes and feedback panels.
- Treat local export/import/reset as browser utilities, with a separate manual merge path when importing local browser data into an account.
- Run `npm run db:push` after the first install or after schema changes so the target Postgres database stays in sync.
- Keep session history and recommendations heuristic, readable, and transparent.
- Keep difficulty labels consistent across modules: `beginner`, `intermediate`, and `advanced-lite`.
- Treat content packs as the shared authoring layer that ties scenarios, study-path guidance, and adaptive recommendations together.
- Use the optional `pack` and `difficulty` query parameters on trainer routes when linking into a specific study slice.
- Update the specs if the product scope, scenario schema, or training flow changes.
- Treat `/trainer/preflop`, `/trainer/postflop`, `/trainer/pot-odds`, `/trainer/board-texture`, `/trainer/player-types`, `/review`, `/dashboard`, `/auth`, and `/settings` as the active Phase 10 routes.
