# Mobile E2E tests

This workspace owns Maestro flows that exercise the installed Reward Goals app
against a running API. The flows target standalone Expo development builds,
not Expo Go.

## Prerequisites

- Java 17 or newer
- Maestro CLI 2.10.0
- a running Android emulator or iOS simulator
- the API running against a disposable E2E database
- the mobile development build installed on the target device

Install the pinned Maestro version on macOS or Linux:

```sh
export MAESTRO_VERSION=2.10.0
curl -Ls "https://get.maestro.mobile.dev" | bash
maestro --version
```

See the official [Maestro installation guide](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli)
for Windows, WSL, Homebrew, and manual installation options.

## Local environment

Start PostgreSQL and create a disposable database once:

```sh
docker compose up -d
docker compose exec postgres createdb -U postgres reward_goals_e2e
```

Start the API with non-production secrets and the E2E database:

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reward_goals_e2e?schema=public pnpm db:migrate:deploy
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reward_goals_e2e?schema=public \
ACCESS_TOKEN_SECRET=maestro-local-access-token-secret \
REFRESH_TOKEN_SECRET=maestro-local-refresh-token-secret \
pnpm dev:api
```

Build the mobile app with an API URL reachable from the device. Android
emulators normally use `http://10.0.2.2:3000`; iOS simulators can use
`http://localhost:3000`.

```sh
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 pnpm mobile android
```

The Maestro setup scripts run on the host and use `http://localhost:3000` by
default. Override defaults without editing flows:

```sh
MAESTRO_API_URL=http://localhost:3000 \
MAESTRO_APP_ID=com.anonymous.mobile \
pnpm test:e2e:mobile
```

The runner refuses remote API hosts by default because setup creates data.
For an explicitly approved disposable test or staging API, also set
`MAESTRO_ALLOW_REMOTE_API=true`. Never use that override with production.

## Commands

Run from the monorepo root:

```sh
pnpm test:e2e:mobile
pnpm test:e2e:mobile:auth
pnpm test:e2e:mobile:goals
pnpm test:e2e:mobile:smoke
pnpm validate:e2e
```

`validate:e2e` checks YAML syntax, flow metadata, critical-flow isolation, and
test-ID references without requiring a device. Executing the actual Maestro
suite requires the installed app, running API, and connected device.

## Test data

Every flow generates a unique `@example.test` email. Registration creates the
account through the UI because registration is the behavior under test. Other
flows seed their account through `POST /auth/register`; Goal progress setup also
uses `POST /auth/login` and `POST /goals`. The tested registration, login,
session, logout, Goal creation, and progress actions still happen through the
UI. Never point setup scripts at production.

Stable selectors live in `packages/test-ids`. Mobile code imports the typed
values while the E2E runner exposes the same JSON values to Maestro.
