# Revsys AI

AI-native Revenue Intelligence Operating System for ecommerce.

This repository is a Turborepo monorepo managed with pnpm.

## Structure

- `apps/web` — Next.js 15 application (public + connected experience)
- `packages/ui` — Design system and reusable components
- `packages/database` — Supabase schema, migrations, generated types
- `packages/shared` — Cross-cutting types and utilities (logger, config, validation, etc.)
- `packages/engines` — Revenue Intelligence Core and Intelligence Engine framework
- `packages/services` — Application-layer services (auth, session)
- `packages/prompts` — Version-controlled prompt library (scaffold only in Sprint 0)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm build` — build all packages/apps
- `pnpm dev` — run all packages/apps in dev mode
- `pnpm lint` — lint all packages/apps
- `pnpm type-check` — type-check all packages/apps
- `pnpm test` — run all tests
