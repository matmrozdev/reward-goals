# Reward Goals

Reward Goals is a full-stack mobile application focused on helping users build better habits and stay consistent while working towards personal goals.

The project is built as a public portfolio to showcase modern React Native and NestJS development practices, including authentication, API design, database architecture, CI/CD and mobile release automation.

---

## Tech Stack

**Mobile**

- React Native
- Expo
- TypeScript

**Backend**

- NestJS
- Prisma
- PostgreSQL

**Infrastructure**

- Docker
- GitHub Actions

---

## Project Structure

```text
reward-goals/
├── apps/
│   ├── api/
│   └── mobile/
├── packages/
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## Development Roadmap

- 🚧 Foundation
- ⏳ Authentication
- ⏳ Goals
- ⏳ Progress & Rewards
- ⏳ Quality & Portfolio

Development is tracked using GitHub Issues, Milestones and Projects.

---

## Running Locally

Install dependencies, then create each application's local environment file
from its committed example:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

The API environment requires:

| Variable       | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `NODE_ENV`     | Runtime mode: `development`, `test`, or `production`     |
| `HOST`         | Network interface on which the API listens               |
| `PORT`         | TCP port on which the API listens                        |
| `DATABASE_URL` | PostgreSQL connection URL, including the target database |

The mobile app requires `EXPO_PUBLIC_API_URL`, the base URL it will use for API
requests. Expo embeds `EXPO_PUBLIC_` values in the client bundle, so never put
secrets in them.

The committed defaults assume PostgreSQL and the mobile client can reach the
development machine at `localhost`. When using an Android emulator, set the
mobile URL host to `10.0.2.2`; on a physical device, use the development
machine's LAN address. Keep the API `HOST` set to `0.0.0.0` for device access.

After adjusting the copied values for the local environment, start PostgreSQL
and run both applications in separate terminals:

```bash
pnpm dev:api
pnpm dev:mobile
```

The API validates its environment before starting and reports every missing or
invalid required variable in one error. Local `.env` files are ignored by Git;
only `.env.example` files should be committed.

### Database workflow

The API uses PostgreSQL through Prisma ORM. Docker-based local infrastructure is
tracked separately, so PostgreSQL can currently run natively or through any
reachable development instance. Set `DATABASE_URL` in `apps/api/.env` before
running commands that connect to the database.

Generate the type-safe Prisma Client after changing the schema:

```bash
pnpm db:generate
```

Create and apply a development migration after adding or changing models:

```bash
pnpm db:migrate --name describe_the_change
```

Inspect migration status or apply committed migrations in a deployment:

```bash
pnpm db:status
pnpm db:migrate:deploy
```

Reset the development database and reapply all migrations:

```bash
pnpm db:reset
```

`db:reset` deletes all data in the configured database. Never run it against a
shared or production database. Prisma Client is generated during dependency
installation and before API builds; generated files are intentionally ignored
by Git.

---

## Quality Checks

Run the complete non-mutating validation suite before opening a pull request:

```bash
pnpm validate
```

The command checks formatting with Prettier, lints the monorepo with ESLint,
and audits all workspace dependencies for known vulnerabilities. Husky runs the
same validation suite together with branch-name validation before each push.
GitHub Actions also runs the same suite for pull requests targeting `main`,
using the committed lockfile to install the exact dependency versions.
Audit exceptions must identify an exact advisory, have no available patched
release, and be removed when an upstream fix becomes available.

Individual commands are also available:

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm audit:dependencies
```

pnpm only resolves package versions that have been published for at least three
days, reducing exposure to newly published supply-chain attacks.

---

## Current Status

The project is actively under development.

The current milestone focuses on establishing the project foundation, authentication flow and core backend architecture.

---

## License

MIT (planned)
