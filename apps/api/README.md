# Reward Goals API

The Reward Goals API is a NestJS application that owns validation, business
rules, authentication, and persistent data. It uses Prisma to access PostgreSQL.

## Prerequisites

- Node.js
- pnpm
- Docker with Docker Compose

Run the commands below from the repository root.

## Setup

Install dependencies and create the local API environment file:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
```

Start PostgreSQL and wait until `docker compose ps` reports it as healthy:

```bash
docker compose up -d
docker compose ps
```

Start the API in watch mode:

```bash
pnpm dev:api
```

The default API address is `http://localhost:3000`. Interactive OpenAPI
documentation is available at `http://localhost:3000/docs`.

## Environment

| Variable                    | Purpose                                       | Example                    |
| --------------------------- | --------------------------------------------- | -------------------------- |
| `NODE_ENV`                  | Runtime mode                                  | `development`              |
| `HOST`                      | Network interface on which the API listens    | `0.0.0.0`                  |
| `PORT`                      | TCP port on which the API listens             | `3000`                     |
| `DATABASE_URL`              | PostgreSQL URL, including the target database | See `.env.example`         |
| `ACCESS_TOKEN_SECRET`       | Secret used only for access-token signatures  | Generate a private value   |
| `ACCESS_TOKEN_TTL_SECONDS`  | Access-token lifetime in seconds              | `900`                      |
| `REFRESH_TOKEN_SECRET`      | Independent refresh-token signing secret      | Generate a different value |
| `REFRESH_TOKEN_TTL_SECONDS` | Refresh-token lifetime in seconds             | `2592000`                  |

The committed `DATABASE_URL` example matches the development database declared
in the root `docker-compose.yml`. Local `.env` files are ignored by Git.

Access tokens are short-lived bearer credentials. Refresh tokens are rotated
when used, and only a SHA-256 digest of each high-entropy refresh token is
stored. Never commit real signing secrets.

## Database

PostgreSQL data is stored in the named `postgres_data` volume, so it survives
container restarts and `docker compose down`.

```bash
# Stop PostgreSQL and preserve its data
docker compose down

# Stop PostgreSQL and permanently delete its local data
docker compose down -v
```

If port `5432` is already occupied, stop the other local PostgreSQL instance
before starting Compose.

## Commands

| Command                         | Purpose                                               |
| ------------------------------- | ----------------------------------------------------- |
| `pnpm dev:api`                  | Start the API in watch mode                           |
| `pnpm api build`                | Build the API                                         |
| `pnpm api test`                 | Run unit tests                                        |
| `pnpm api test:e2e`             | Run end-to-end tests                                  |
| `pnpm api test:cov`             | Run tests with coverage                               |
| `pnpm api typecheck`            | Type-check the API                                    |
| `pnpm db:generate`              | Generate Prisma Client                                |
| `pnpm db:migrate --name <name>` | Create and apply a development migration              |
| `pnpm db:migrate:deploy`        | Apply committed migrations                            |
| `pnpm db:status`                | Inspect migration status                              |
| `pnpm db:reset`                 | Reset the development database and reapply migrations |

`pnpm db:reset` deletes all data in the configured database. Never run it
against a shared or production database.

## Authentication integration tests

The authentication E2E suite applies committed migrations to a separate,
real PostgreSQL database. Create that database once in the local Compose
container:

```bash
docker compose exec postgres createdb -U postgres reward_goals_test
cp apps/api/test.env.example apps/api/.env.test
pnpm test:e2e:api
```

The suite refuses to migrate or clean a database unless `NODE_ENV=test` and
the database name includes a standalone `test` segment, such as
`reward_goals_test`. It clears authentication data between cases and never
mocks Prisma. `apps/api/.env.test` is local-only and must not contain shared or
production credentials.

Run `pnpm validate` from the repository root before opening a pull request.
