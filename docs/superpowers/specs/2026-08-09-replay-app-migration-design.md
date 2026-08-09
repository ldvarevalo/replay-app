# Replay App Migration — Design

**Date:** 2026-08-09
**Status:** Approved
**Source:** `frontend-crate` (web, frozen)
**Target:** `replay-app` (Expo SDK 57, iOS + Android only)

## Goal

Migrate the existing web app (`/Users/larevalo/workspace/sandbox/crate-app/frontend-crate`) to a React Native mobile app (`replay-app`). The web app is frozen at its current state and will be deprecated once the mobile app reaches v1 success criteria.

## Non-Goals (v1)

- Audio playback (the app registers listening sessions but does not play music)
- Barcode/Discogs scanner
- Social sharing
- Push notifications
- Deep linking from the web app
- Offline mode with sync (assumes connectivity; queries retry once)
- Internationalization (app is English-only in v1)
- End-to-end tests with Maestro/Detox (manual smoke test is sufficient)
- Logging/monitoring (Sentry/Crashlytics)
- Onboarding tutorial for new users
- Data migration (Supabase is the same project; no data moves)
- Web build (iOS + Android only)

## Stack

**Adopt / maintain:**
- Expo SDK 57, React 19, React Native 0.86
- `expo-router` (file-based routing)
- React Native Reanimated 4
- EAS build profiles (development / preview / production — already configured)
- TanStack Query (same queries, keys, hooks; only the wiring changes)

**New:**
- `react-native-unistyles` v3 for styling (replaces Tailwind on the native side)
- `@supabase/supabase-js` wired with `expo-secure-store` for session persistence
- `lucide-react-native` for icons (replaces `lucide-react`)
- `react-native-svg` + a charts library (likely `react-native-gifted-charts`) for Analytics

**Removed:**
- `react-native-web`, `react-dom` (no web target)
- `web` script and `"web"` block in `app.json`

## Architecture

- **No shared code with the web app.** Each spec is 100% on `replay-app/`. The web stays as a frozen reference.
- **Repository pattern preserved:** same 9 interfaces (`Releases`, `UserReleases`, `Tracks`, `Stats`, `Artists`, `Genres`, `Sessions`, `Analytics`, `MusicSearch`) implemented against Supabase, ported 1:1 from the web.
- **Domain types in `src/types/domain.ts`:** literal copy from the web, no renames.
- **DI for repositories:** `setRepositories()` / `getRepositories()` (same as the web) for testability.
- **Routing with `expo-router`:**
  - `(auth)` group for unauthenticated flow (login)
  - `(app)` group for authenticated app with a Tabs layout: `inicio`, `collection`, `release/add`, `analytics`
  - `album/[id]` as a Stack with sub-routes `tracks` and `session`
- **Testing:** `jest-expo` (or `vitest` with RN preset) + `@testing-library/react-native`; repository mocks via `createTestRepositories()` with partial override pattern (same as web).
- **Language:** all copy (buttons, titles, errors, placeholders) in English.

## Design System

### Theme structure (Unistyles 3.0)

Single TypeScript theme object with `lightTheme` and `darkTheme` variants of the same shape. Accessed via `useStyles(stylesheet)` with built-in breakpoints and orientation.

### Token mapping (port 1:1 of web's dark, plus light counterpart)

| Web CSS var | Dark (current) | Light (new) |
|---|---|---|
| `--color-background` | `#131313` | `#fafafa` |
| `--color-surface` | `#131313` | `#ffffff` |
| `--color-surface-container-lowest` | `#0e0e0e` | `#f5f5f5` |
| `--color-surface-container-high` | `#2a2a2a` | `#e8e8ea` |
| `--color-primary` | `#bbc3ff` | `#3d5afe` |
| `--color-primary-container` | `#3d5afe` | `#bbc3ff` |
| `--color-on-primary-container` | `#ffffff` | `#1a1f8c` |
| `--color-on-surface` | `#ffffff` | `#1a1a1a` |
| `--color-on-surface-variant` | `#a8a8a8` | `#5a5a5a` |
| `--color-tertiary` | `#d18f00` | `#b87600` |
| `--color-destructive` | `#ef4444` | `#dc2626` |
| `--color-violet` | `#7c4dff` | `#651fff` |

### Spacing and radius

- Spacing: `half/one/two/three/four/five/six` (4, 8, 16, 24, 32, 64)
- Radius: `sm/md/lg/xl/full` (4, 8, 12, 20, 999)

### Typography

- `display`: Newsreader 32px bold italic (h1)
- `title`: Newsreader 24px semibold (h2)
- `heading`: Newsreader 18px semibold (h3)
- `body`: Inter 14px regular
- `label`: Inter 10px medium uppercase tracking-wider
- `nav-link`: Inter 10px medium uppercase tracking-wider

Fonts loaded via `useFonts` from `@expo-google-fonts/inter` and `newsreader`.

### Iconography

`lucide-react-native` (same component names and API as the web's `lucide-react`).

### UI library

**Base components (new):**
- `Container`, `Screen` (SafeArea + bg), `Stack` (gap-based vertical/horizontal layout)
- `Text` (display / title / heading / body / label variants)
- `Button` (primary / secondary / text × default / sm)
- `IconButton`
- `Card` (surface with border-radius)
- `Input` (label, helper, error)
- `ListItem` (icon, text, trailing)
- `EmptyState` (icon, title, description, action)
- `Skeleton` (loading)
- `Section` (header + content)
- `SegmentedControl` (used by Collection for discover/want/owned filter)
- `BottomNav` (active state, used as the expo-router custom `tabBar`)

**Domain components (ported 1:1 from web):**
- `Header`, `SectionHeader`, `AlbumCard`, `AlbumHero`, `AlbumRow`, `SearchBar`

## Sub-Specs

The migration is decomposed into 8 sequential sub-specs. Each sub-spec will get its own design and plan before implementation.

### Sub-spec 1 — Foundation

- Unistyles 3.0 setup (metro config plugin, theme objects, typography, fonts via `useFonts`)
- `lib/supabase/client.ts` with `expo-secure-store` adapter for session persistence
- `lib/react-query/query-client.ts` with web-equivalent defaults (`staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`)
- `core/auth/`: `AuthProvider`, `useUser`, `useSignIn`, `useSignOut`, `authStore` with listener pattern
- `repositories/`: `setRepositories` / `getRepositories` / `useRepositories`
- 9 repository interfaces + Supabase implementations (port 1:1 from web)
- `types/domain.ts` (port literal from web)
- Test setup: `jest-expo` (or `vitest` with RN preset) + `@testing-library/react-native` + `createTestRepositories`

**Deliverable:** app boots, email/password login works, QueryClient ready, repos accessible via DI. No UI library yet.

### Sub-spec 2 — UI library and navigation

- 14 base components listed above
- 6 domain components ported 1:1 with theme injected
- Pre-step: remove `web` from `app.json` and `react-native-web` / `react-dom` from `package.json`; remove `web` script
- `expo-router` structure: `(auth)` group with `login.tsx`, `(app)` group with Tabs (4 entries), `album/[id]` as Stack
- Splash + complete auth flow + redirect to `(app)` when session present

**Deliverable:** app with functional auth screen, 4 empty navigable tabs, all UI components tested, complete design system.

### Sub-spec 3 — Home (`inicio`)

- Route: `/(app)/inicio`
- Hook: `useHomeData` (stats, dailyPick, recentlyListened, rediscover, upNext, wantToBuyCount, handleShowAnother)
- Components: `BannerCta`, `DailyPickCard`, `RecentlyListenedCard`, `RediscoverCard`, `StatsCard`, `UpNextList`
- Navigation to `album/[id]` from cards; pull-to-refresh

**Deliverable:** fully functional Home end-to-end.

### Sub-spec 4 — Collection

- Route: `/(app)/collection`
- Tabs segmented: `discover` / `want` / `owned`
- Query: `useCollection(statusFilter)` (filter via search param)
- `CollectionAlbumGrid` + `FilterTabs` + FAB to `/release/add`
- Actions: swipe / long-press to change status or archive

**Deliverable:** navigable Collection with all 3 states.

### Sub-spec 5 — Add Release

- Route: `/(app)/release/add`
- Deezer search with `useAlbumSearch` (paginated)
- Artist and genre lookup via `useSearchLookup`
- Manual entry form (title / artist / year / genre / artwork / status)
- Mutations: `createRelease`, `linkArtist`, `linkGenre`, `upsertUserRelease`
- Dedup logic in the form (same release not listed twice)

**Deliverable:** complete "add a record" flow.

### Sub-spec 6 — Album Detail + sub-routes

- Route: `/(app)/album/[id]` as Stack with `_layout.tsx` defining dynamic header
- Main screen: `AlbumHero` + section per status (`AlbumDiscoverSection`, `AlbumWantSection`, `AlbumOwnedSection`)
- Actions: change status, mark as listened, archive, update priority
- Sub-routes: `tracks/` (list with duration, side, position) and `session/` (log listen with scope + sourceFormat + duration)
- Navigation from Home/Collection already in sub-spec 3 / 4

**Deliverable:** complete Album Detail with sub-routes.

### Sub-spec 7 — Analytics

- Route: `/(app)/analytics`
- `PeriodSelector` (week / month / year / all)
- 4 `MetricCard`s (albums listened, time, want, owned)
- `DiscoverBacklogCard`, `TopArtists`, `TopGenres`, `MostListenedAlbum`
- Charts via `react-native-svg` + `react-native-gifted-charts` (bar / line)
- Empty state when no data

**Deliverable:** Analytics with real data.

### Sub-spec 8 — Polish and verification

- Logout flow from Header
- Global error boundary + per-screen fallbacks
- Consistent loading skeletons
- Entry animations with Reanimated (shared element transition for album cover on navigation)
- Final verification: `lint`, `typescript`, `test`, smoke test on Android device (preview profile)

**Deliverable:** production-ready v1 mobile app.

## Sequencing

```
1 (Foundation) → 2 (UI library) → 3 (Home) → 4 (Collection) → 6 (Album Detail) → 5 (Add) → 7 (Analytics) → 8 (Polish)
```

Rationale:
- 1 + 2 are non-negotiable prerequisites
- 3 Home is the most familiar screen, validates the end-to-end stack
- 4 Collection reuses the list pattern
- 6 Album Detail is the mandatory destination for 3 and 4
- 5 Add Release is the most complex (forms + search + multiple mutations) and goes after the patterns are stable
- 7 Analytics last among features because it uses different patterns (charts, date pickers)
- 8 Polish ties everything together

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `react-native-unistyles` 3.0 in beta, APIs can change | Initial setup may break between releases | Pin exact version in `package.json`; validate against Expo SDK 57 docs at install time |
| `victory-native` and alternatives have poor performance with lots of data | Analytics screen UX | Start with `react-native-gifted-charts` (lighter); fall back to Skia custom if needed |
| Supabase auth flow in mobile without email verification | Users may create unverified accounts | Keep current Supabase flow (email + password); add verification in a future spec |
| No realtime updates | Other-device changes are not visible | Out of scope; manual pull-to-refresh |
| 8 sub-specs with 1 + 2 as blocking prerequisites | If 1 slips, no screen work starts | Worth investing the time up front; spec 1 + 2 are the highest-leverage |
| `jest-expo` + Supabase mocks setup friction, slow tests | Slows down TDD | Mock Supabase client at module level; unit-test repos without React |
| No web target | `expo-router` and `expo` features may assume web | Validate during spec 2 setup; document any platform-only behavior |

## Open Questions (to resolve during implementation, not in this spec)

- App versioning: start at `1.0.0` or `0.1.0` until v1 mobile-only is reached?
- Client-side rate limiting (e.g. debounce on search) or only on the backend?
- Persistence of in-progress drafts in Add Release (AsyncStorage temporary)?
- Cover art caching strategy (expo-image with disk cache covers it)?

## Success Criteria

The migration is considered complete when:

1. Login works on iOS and Android
2. All 5 screens render real data from Supabase
3. `yarn lint`, `yarn typescript`, `yarn test` all pass
4. EAS build of `production` profile produces installable APK and IPA
5. The web app (`frontend-crate`) is frozen and documented as deprecated in its README
