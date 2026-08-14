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

```bash
pnpm install
docker compose up -d

pnpm --filter api dev
pnpm --filter mobile start
```

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
