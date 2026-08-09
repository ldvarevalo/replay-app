# AGENTS.md

## Stack

- **Expo SDK 57** + expo-router (file-based routing under `src/app/`)
- **React Native 0.86**, **React 19.2**
- **Unistyles 3.0** for styling (NOT 2.0 — see Landmines)
- **Reanimated 4** + worklets (bundled, do not add worklets plugin separately)
- **TanStack Query 5** for server state
- **Supabase** (`@supabase/supabase-js` 2.107) with `expo-secure-store` for session
- **TypeScript 6**, strict mode
- **Yarn 1.22** (yarn.lock, not npm/pnpm)

Path aliases (`tsconfig.json`): `@/*` → `src/*`, `@/assets/*` → `assets/*`.

## Commands

```bash
yarn install              # Install deps
yarn start                # Expo dev server
yarn ios / yarn android   # Open in simulator (NOT yarn web — see Landmines)
yarn lint                 # ESLint via expo lint
yarn typecheck            # tsc --noEmit
yarn test                 # jest (jest-expo preset)
yarn test <pattern>       # Run one test file
yarn test:watch           # jest watch mode
yarn build:android:dev|preview|production   # EAS build invocations
yarn update:preview       # EAS update to preview channel
```

**Verification order (local):** `lint → typecheck → test`.

**CI runs only `lint → typecheck`** (see `.github/workflows/ci.yml`). Tests are local-only — do not assume a green PR means tests pass.

## Architecture

```
src/
  app/                      # expo-router root layout + screens
    _layout.tsx             # QueryClient + AuthProvider + fonts + Stack
    index.tsx, explore.tsx
  core/auth/                # AuthProvider, authStore, useUser/useSignIn/useSignOut
  lib/
    supabase/               # createSupabaseClient + createSecureStoreStorage
    react-query/            # createQueryClient + createTestQueryClient
    test-utils/             # createTestRepositories, renderWithProviders
  repositories/             # Repository pattern: types, instance, hooks, supabase/, music-search/
  theme/                    # Unistyles 3.0 tokens (light + dark) + unistyles.d.ts declaration merge
  types/domain.ts           # Domain types (Album, Track, CollectionStatus, ...)
  components/               # Shared components (some still from Expo starter)
```

## Migration from `frontend-crate/` (web)

This app is being ported 1:1 from the web app at `../frontend-crate/`. Conventions:

- **Domain types, repository interfaces, repository implementations, and auth types** are ported as `cp` (byte-identical) then sed `#/` → `@/`. Don't refactor during port.
- **No shared package** between web and mobile. Each side maintains its own copy.
- **The web stays frozen** (deprecated after v1 success). Don't try to keep them in sync beyond the initial port.

## Commit Conventions

- **Format:** `<type>: <description>` — one line, no body, lowercase, no period, max 50 chars
- **No scope:** `feat:` not `feat(scope):`. ✓ `feat: add light and dark tokens` ✗ `feat(theme): add light and dark tokens`
- **No ticket refs** (`PROJ-123`, `#456`, etc.) and **no AI signatures**
- **Allowed types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`
- **No `git add`** — only commit files the user has staged
- **Granular commits:** one per logical group (component, hook, fix)
- **Branches:** `feat/<name>`, `fix/<name>`, `chore/<name>` — lowercase kebab-case

## Landmines (read before touching tooling)

- **Unistyles 3.0 API** is `StyleSheet.configure({ themes, settings: { adaptiveThemes: true } })` (single call). `UnistylesRegistry` is GONE. `useStyles` is GONE — call `const styles = stylesheet()` inside the component. `initialTheme` and `adaptiveThemes` are **mutually exclusive** (discriminated union). Requires declaration merging in `src/theme/unistyles.d.ts` to type `UnistylesThemes` (without it, `theme` is `never`).
- **Babel plugin order** (`babel.config.js`): `react-native-reanimated/plugin` first (it bundles worklets in Reanimated 4), then `react-native-unistyles/plugin` with `{ root: 'src' }`. Do **NOT** add `react-native-worklets/plugin` separately — causes "Duplicate plugin/preset detected" error.
- **`app.config.ts` not `app.json`** — env-driven config. `app.json` was deleted in Task 5.
- **Supabase env vars** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` must be set (in `.env` or `expo-env.d.ts`) or `createSupabaseClient()` throws at module load.
- **`yarn web` is in scripts but the design spec says no web target.** Still works (the `web` block in `app.config.ts` is intact); sub-spec 2 should remove it.
- **RNTL 14's `renderHook` is async** — tests must `await` it. The auth-context test file already follows this.
- **CI does NOT run tests** — only lint + typecheck. Run `yarn test` locally before pushing.

## Testing

- `yarn test` — 18+ tests across 5 suites (query-client, supabase storage, authStore, auth-context, releases)
- **Test conventions:** `it` always starts with `"should ..."`; `/** Mocks */` then `/** Tests */` JSDoc sections; mock callbacks named `handle<Verb><Noun>Mock`; test data in `UPPER_SNAKE_CASE` with `_MOCK` suffix, dotted convention (`A.RELEASE.ID`).
- **No `beforeEach` in tests** — `jest.setup.ts` does `setRepositories(createTestRepositories())` globally. Only `afterEach(clearAllMocks)` when needed.
- **Per-repo noop factory:** `createTestRepositories({ releases: { findById: jest.fn().mockResolvedValue(...) } })` for partial overrides.
- **Test framework is jest-expo, not vitest** (web uses vitest — different stack, not a violation).
- **Test files co-located** as `__tests__/*.test.ts` next to the unit under test.

## Plans and Specs

- Specs in `docs/superpowers/specs/`, plans in `docs/superpowers/plans/`
- **Both gitignored** — never committed
- Use `brainstorming` skill before writing a spec, `writing-plans` before a plan
- Sub-specs chain locally (no push, no PR — out of scope per project policy)

## Setup

- `yarn install`
- Create `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (do not commit)
- For EAS builds: `EXPO_TOKEN` env var, `eas-cli` already installed
- Node 22 (per CI)
