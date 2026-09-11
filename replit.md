# Pazhakuzhi Tamil Village Game

A bilingual, responsive virtual Pazhakuzhi/Pallankuzhi game that preserves the warmth of a traditional Tamil village board while making the rules playable on modern screens.

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

- `artifacts/pazhakuzhi/src/lib/game.ts` — deterministic sowing, capture, turn, win, persistence, and statistics logic.
- `artifacts/pazhakuzhi/src/pages/` — home, setup, gameplay, tutorial, story, and statistics screens.
- `artifacts/pazhakuzhi/src/components/AppShell.tsx` — shared bilingual navigation and sound/language preferences.
- `artifacts/pazhakuzhi/src/index.css` — courtyard-inspired visual system, board textures, Tamil typography, and responsive styles.

## Architecture decisions

- The first version is frontend-only and uses localStorage so a round, preferences, and statistics persist without account setup or external services.
- Game rules are isolated from presentation in `lib/game.ts`; the default format is seven pits per side with five seeds each.
- The interface uses bilingual copy with Tamil as an explicit preference rather than maintaining separate routes or duplicate pages.
- The board is implemented with CSS and accessible buttons instead of image-only artwork so pit state remains readable and playable at every viewport.

## Product

- Home landing page with Tamil village context and clear entry points.
- Player vs Computer and same-device two-player modes.
- Easy, Medium, and Hard computer difficulty choices.
- Configurable pit count, seed count, capture style, and win condition.
- Responsive wooden board with legal-pit highlighting, captured seed wells, move history, pause/resume, restart, exit, and result actions.
- How-to-play and About pages, Tamil/English toggle, sound preference, and local game statistics.

## User preferences

The experience should feel culturally specific and handmade rather than like a generic board-game template; the board stays the main focus.

## Gotchas

- The Vite build expects `PORT` and `BASE_PATH` from the managed artifact workflow; run it through the artifact workflow or provide both variables for manual builds.
- There is no backend dependency for the current gameplay experience.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
