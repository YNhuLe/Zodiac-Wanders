# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Zodiac Wanders is a two-package app: a React 19 + TypeScript + Vite front-end (`front-end/`) and an Express 4 + SQLite back-end (`back-end/`). Users browse zodiac signs and their paired flowers, check sign compatibility, and post/comment in a community feed backed by JWT auth.

## Commands

Both packages must run simultaneously in separate terminals.

```bash
# back-end (must be run from back-end/ — routes/zodiac.js reads ./data/zodiac.json relative to cwd)
cd back-end && npm install && npm run dev     # node --watch, http://localhost:5050

# front-end
cd front-end && npm install && npm run dev    # vite, http://localhost:5173
npm run build      # tsc -b (typecheck) && vite build
npm run lint       # eslint
npm run preview    # serve dist/ on :4173
npm run lighthouse # build + preview + headless lighthouse -> lighthouse-report.json
```

There is no test suite in either package (`back-end` `npm test` is the default error stub).

`npm run build` is the real typecheck gate — run it after non-trivial TypeScript changes.

### Environment

- `back-end/.env` — `PORT` (default 5050), `JWT_SECRET` (falls back to a hardcoded dev secret in `middleware/auth.js`).
- `front-end/.env` — `VITE_API_URL`, e.g. `http://localhost:5050`. Read once in `src/services/api.ts` and also used to build absolute image/avatar URLs; there is no Vite dev proxy, so this must be set or all requests hit the Vite origin.

## Architecture

### Back-end

`index.js` initializes the DB then mounts five routers: `/photos` (zodiac data), `/auth`, `/users`, `/posts`, `/upload`. `public/` is served statically, which is how `/images/*` (flower photos) and `/uploads/*` (avatars) reach the browser.

Two distinct data sources coexist:

- **`data/zodiac.json`** — static, read from disk per request by `routes/zodiac.js`. The 12 zodiac/flower entries with `id` `"1"`–`"12"`. Never written to.
- **`db/zodiac.db`** — SQLite via `better-sqlite3` (WAL mode, foreign keys on), all synchronous/prepared-statement style. Schema and demo seeding live in `db/database.js`: `users`, `posts`, `post_likes`, `comments`, `follows` (directional), `friendships` (one-way row per connect). Tables are created with `CREATE TABLE IF NOT EXISTS` on every boot; seeding only runs when `users` is empty. The DB file is gitignored, so a fresh clone reseeds five demo accounts (`luna@cosmos.test` etc., password `cosmos123`).

`db/database.js` also exports `formatUser`, the single place where snake_case rows become the camelCase shape the front-end expects (and where `hobbies` is JSON-parsed from its TEXT column). Any new user-returning endpoint should go through it. `routes/posts.js` has the analogous `formatPost`/`getPostById` pair — mutating endpoints (like, comment) return the whole refreshed post, not a delta, so the client can replace it wholesale.

Auth is JWT bearer tokens signed in `middleware/auth.js` (`authRequired` sets `req.userId`; `optionalAuth` sets it when present and never rejects). Passwords are bcrypt-hashed.

Avatar upload (`routes/upload.js`) writes a UUID-named file to `public/uploads/`, caps at 5 MB, image extensions only, and stores the relative `/uploads/<file>` path on the user row. Multer errors are caught by the error handler at the bottom of `index.js`.

### Front-end

`App.tsx` nests four providers in a fixed order — `ThemeProvider > Router > UserProvider > ToastProvider > CommunityProvider` — because `CommunityContext` calls `useUser()`. Adding a provider that depends on auth means placing it inside `UserProvider`.

- **`services/api.ts`** — the only module that talks to the network. A single axios instance attaches the bearer token in a request interceptor and clears it on any 401 response. Also exports `getFlowerImageUrl`/`getAvatarUrl`, which prefix `VITE_API_URL` onto server-relative paths.
- **`services/storage.ts`** — the only module touching `localStorage` (`zw_token`, `zw_theme`).
- **`context/UserContext.tsx`** — session state. On mount, exchanges a stored token for the profile via `/auth/me`; `loaded` distinguishes "still checking" from "logged out".
- **`context/CommunityContext.tsx`** — posts, users, follows, friends. Fetches on mount and refetches when login state flips; mutations update local state from the server's returned post. Its `refresh` swallows errors so the UI degrades rather than crashes when the API is down.
- **`data/compatibility.ts`** — sign-pair compatibility is hardcoded client-side, not an API concern.

Components are grouped by domain under `src/components/`: `ui/` (Avatar, Button, Modal, Toast, ZodiacBadge), `layout/`, `zodiac/`, `community/`, `compatibility/`, `home/`, `profile/`. Each component is a folder with a `.tsx` and its own `.scss`.

### Styling

SCSS with the modern `@use` module system. `Styles/partials/` (note: capital S, at the front-end root, *outside* `src/`) holds `_variables`, `_mixin`, `_typography`, `_themes`, `_global`. Component styles import what they need directly:

```scss
@use "../../../Styles/partials/variables" as *;
@use "../../../Styles/partials/mixin" as *;
```

Theming is CSS custom properties, not SCSS variables: `_themes.scss` maps the SCSS palette to `--color-*` vars under `:root`/`[data-theme="light"]` and `[data-theme="dark"]`. `ThemeContext` sets `data-theme` on `<html>` and resolves `"system"` against `prefers-color-scheme`. **Component styles should reference `var(--color-*)`, not the raw SCSS color variables** — hardcoding the palette breaks dark mode.

## Known rough edges

- `eslint.config.js` only matches `**/*.{js,jsx}` while `src/` is entirely `.tsx`, so `npm run lint` currently covers almost nothing. Type errors surface through `npm run build` instead.
- `src/components/{CardDetail,Cards,Footer,Header}/` are leftovers from the pre-TypeScript layout and contain orphaned `.scss` files only; the live versions are under `zodiac/` and `layout/`.
- The root `README.md` still describes the original JSON-only version of the app (React + SCSS, "Data Storage: JSON file") and predates auth, SQLite, and the community features.


# Project Guardrails

## Never do these unless explicitly asked

- Do not change package versions.
- Do not install new dependencies.
- Do not delete existing components.
- Do not rename files.
- Do not move folders.
- Do not change the project architecture.
- Do not replace SQLite with another database.
- Do not migrate styling to Tailwind or CSS Modules.
- Do not convert SCSS to CSS.
- Do not replace React Router.
- Do not modify environment variables.

# Coding Standards

- Use TypeScript only.
- Never use `any`.
- Prefer explicit interfaces over inline object types.
- Use functional React components.
- Keep components under 200 lines when practical.
- Reuse existing UI components before creating new ones.
- Keep business logic out of JSX.
- Do not duplicate utility functions.

- Use existing axios service in services/api.ts.
- Never call fetch() directly.
- Never access localStorage outside services/storage.ts.
- Never create another API client.

# Workflow

Before editing code:

1. Understand the existing implementation.
2. Reuse existing patterns.
3. Explain the plan.
4. Wait for approval before large refactors.

When implementing:

- Change only the files necessary.
- Keep commits logically small.
- Avoid unrelated cleanup.
If you notice unrelated bugs,
do not fix them unless I ask.

Never:

- remove authentication
- change JWT behavior
- delete migrations
- modify seed data
- overwrite user uploads
- change API response shapes

## UI

- Use existing Button component.
- Use existing Avatar component.
- Use existing Modal component.
- Respect the existing design language.
- Preserve dark mode.
- Use CSS variables.
- Do not hardcode colors.

## Styling

Always:

- use BEM
- use SCSS modules already in the project
- use variables from Styles/partials
- use CSS variables for colors
- avoid !important
- avoid inline styles

Prefer:

- memoization only when beneficial
- avoid unnecessary re-renders
- avoid duplicate API requests
- lazy load large components

Backend:

- always use prepared statements
- never concatenate SQL
- preserve formatUser()
- preserve formatPost()
- keep API responses consistent

If there are multiple valid implementations:

Choose the one that:

1. requires the fewest changes
2. matches the existing codebase
3. minimizes complexity
4. minimizes dependencies
5. preserves backwards compatibility

Always ask before:

- adding dependencies
- changing architecture
- changing routing
- renaming files
- deleting code
- changing folder structure
- changing database schema
- introducing new patterns

## Cowork Mode

When working autonomously:

- Do not continue expanding scope.
- Complete only the requested task.
- Do not refactor unrelated code.
- Do not "improve" code outside the task.
- Do not create TODO placeholders.
- Prefer existing project patterns over generating new abstractions.
- Stop after the requested feature is complete.

## Architecture Philosophy

Prioritize maintainability over cleverness.

Prefer:
- explicit code
- readable functions
- predictable folder structure
- reusable components
- small focused commits

Avoid:
- premature optimization
- over-abstraction
- unnecessary custom hooks
- introducing design patterns that are not already used