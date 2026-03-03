# Fitfluence Web Admin

Production-ready scaffold for Fitfluence web admin.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + design tokens
- Radix-based UI wrappers (shadcn style)
- TanStack Query
- react-hook-form + zod
- OIDC (Keycloak, Authorization Code + PKCE)
- Generated OpenAPI client

## Run

1. Install dependencies:

```bash
npm install --cache .npm-cache
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Generate API client:

```bash
npm run gen:api
```

4. Start dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — dev server
- `npm run build` — production static build (outputs `out/`)
- `npm run build:artifact` — build and prepare Docker artifact in `dist/`
- `npm run start` — run built app
- `npm run lint` — eslint
- `npm run typecheck` — TypeScript checks
- `npm run format` — prettier
- `npm run gen:api` — regenerate OpenAPI client into `src/api/gen`

## Production Environment

All `NEXT_PUBLIC_*` values are embedded at build time. For Docker release you must
set production values before running `npm run build:artifact`.

Required variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_OIDC_ISSUER`
- `NEXT_PUBLIC_OIDC_CLIENT_ID`
- `NEXT_PUBLIC_OIDC_REDIRECT_URI`
- `NEXT_PUBLIC_OIDC_SCOPE`

Optional variables:

- `NEXT_PUBLIC_OIDC_USE_KC_ACTION_REGISTER`

## Docker (Production)

1. Build frontend artifact:

```bash
npm ci
cp .env.production.example .env.local # replace with real production values
npm run build:artifact
```

2. Build Docker image:

```bash
docker build -t <dockerhub-user>/fitfluence-web:latest .
```

3. Run container:

```bash
docker run --rm -p 8080:80 <dockerhub-user>/fitfluence-web:latest
```

## Auth Flow

- `/login` → `signIn()` redirect to Keycloak
- `/auth/callback` → handles code exchange and stores tokens
- after login app calls `GET /v1/me`, stores user + roles
- route guards:
  - `/admin/*` requires `ADMIN`
  - `/influencer/*` requires `INFLUENCER`
  - unauthenticated users are redirected to `/login`
  - unauthorized users are redirected to `/forbidden`

## Keycloak (local)

Minimal setup:

- Realm: `fitfluence`
- Client ID: `fitfluence-web-admin`
- Access type: public client
- Standard Flow enabled
- Redirect URI includes: `http://localhost:3000/auth/callback`
- Web origins include: `http://localhost:3000`

## API Generation

By default generator reads OpenAPI schema from:

`/Users/ravil/work/fitfluence/fitfluence/openapi/schemas/openapi.yaml`

Override input path if needed:

```bash
OPENAPI_INPUT=/path/to/openapi.yaml npm run gen:api
```

## Design System

- Tokens: `src/design/tokens.ts`
- Theme variables: `src/styles/theme.css`
- Tailwind mapping: `tailwind.config.ts`
- UI wrappers: `src/shared/ui/*`

No hardcoded palette values in feature components — use semantic tokens only.

## Localization Policy

- Весь пользовательский интерфейс должен быть полностью на русском языке.
- Новые пользовательские тексты (кнопки, заголовки, подсказки, ошибки, empty/loading states, toasts) добавляются только на русском.
- Английский допустим только для технических идентификаторов и протокольных значений (`ADMIN`, `INFLUENCER`, `UUID`, `MIME`, URL и т.п.), которые не являются UI-копирайтом.

## Dev Panel

Visible only in development mode (`NODE_ENV !== production`).

Shows:

- current user
- roles
- api base URL
- quick logout button

## Notes

- Token storage for scaffold: in-memory + `sessionStorage` via `oidc-client-ts`
- Generated files in `src/api/gen` must not be edited manually
