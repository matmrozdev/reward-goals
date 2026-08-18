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

The default API address is `http://localhost:3000`.

## Environment

| Variable       | Purpose                                       | Default            |
| -------------- | --------------------------------------------- | ------------------ |
| `NODE_ENV`     | Runtime mode                                  | `development`      |
| `HOST`         | Network interface on which the API listens    | `0.0.0.0`          |
| `PORT`         | TCP port on which the API listens             | `3000`             |
| `DATABASE_URL` | PostgreSQL URL, including the target database | See `.env.example` |

The committed `DATABASE_URL` example matches the development database declared
in the root `docker-compose.yml`. Local `.env` files are ignored by Git.

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

Run `pnpm validate` from the repository root before opening a pull request.
