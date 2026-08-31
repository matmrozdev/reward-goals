# Reward Goals

Reward Goals is a full-stack mobile application for turning personal goals into
consistent habits through visible progress and meaningful rewards.

The project is also a public portfolio of production-oriented React Native and
NestJS development, with an emphasis on clear architecture, reliable data, and
an incremental delivery process.

## Goal

Build a focused system where people can define goals, record progress, and earn
rewards without turning self-improvement into a complicated project-management
workflow.

## Current progress

The functional MVP is complete. Reward Goals now includes authenticated account
creation and session restoration, user-owned finite and ongoing Goals, optional
weekday schedules and Rewards, historical count-based progress with undo,
authoritative Goal and Reward state, and a date-aware mobile Dashboard backed by
the NestJS API and PostgreSQL database.

The next phase focuses on quality and release readiness: broader automated
validation, native-device acceptance testing, production deployment,
observability, and distribution configuration. Advanced recurrence, additional
progress measurement types, notification delivery, repeatable Rewards, and
Reward claiming remain outside the current MVP.

Detailed work is tracked through [GitHub Issues](https://github.com/matmrozdev/reward-goals/issues)
and the [project Wiki](https://github.com/matmrozdev/reward-goals/wiki).

## Stack

- **Mobile:** React Native, Expo, TypeScript
- **API:** NestJS, TypeScript
- **Data:** Prisma, PostgreSQL
- **Tooling:** pnpm workspaces, Docker Compose, GitHub Actions

## Applications

- [API setup and commands](apps/api/README.md)
- [Mobile setup and commands](apps/mobile/README.md)

## Running locally

Install the workspace dependencies from the repository root:

```bash
pnpm install
```

Then complete the setup for both applications:

1. [Set up and start the API](apps/api/README.md#setup).
2. [Set up and start the mobile application](apps/mobile/README.md#setup).

## Project structure

```text
reward-goals/
├── apps/
│   ├── api/
│   └── mobile/
├── packages/
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## License

MIT (planned)
