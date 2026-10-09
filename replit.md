# Study Flow

A mobile-first study companion frontend faithfully reproducing the supplied Study Flow Figma screens.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/study-flow/src/App.tsx` — screen components, local state, and routes.
- `artifacts/study-flow/src/index.css` — styling matched to the supplied mobile references.
- `artifacts/study-flow/src/assets/` — cropped illustrations from the supplied references.
- Screens 1–20 references are preserved in `.local/conversation-workspace/files/attached_assets/`; screens 21–40 are `attached_assets/Group_105` through `Group_124`.

## Architecture decisions

- The current build is frontend-only; profile, goal, and subject setup use local browser storage.
- Firebase, backend persistence, and AI services are intentionally deferred.
- AI-labelled copy in the references is display-only; do not present it as generated or personalized output.

## Product

Study Flow helps college students set study goals, organize subjects, follow progress, and preview the quiz and recommendation flows shown in the supplied designs.

## User preferences

- The supplied Figma PNGs are the source of truth. Do not redesign existing screens or add screens/features not supported by references.
- Later screen batches belong to this same app. Integrate them into the existing routes and visual system; do not restart the project or redesign screens 1–20.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
