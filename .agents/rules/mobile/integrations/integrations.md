---
title: Mobile integrations
description: Define ownership boundaries and conventions for HTTP infrastructure, server-state hooks, persistence, external SDKs, configuration, and provider composition.
scope: mobile
applies_to:
  - mobile API implementation
  - mobile TanStack Query hook creation
  - mobile persistence implementation
  - mobile external SDK integration
  - mobile configuration changes
  - mobile provider composition
related_skills:
  - implement-mobile-code
---

# Mobile integrations

Follow [Mobile architecture](../architecture/architecture.md) to determine the
owning feature before placing application-wide integration code.

## API

Use top-level `api/` for generic HTTP and transport infrastructure:

```text
api/
├── client.ts
├── errors.ts
└── interceptors.ts
```

It may own the base URL, headers, auth-token attachment, common request and
response handling, common API errors, interceptors, and refresh-token transport
logic.

Keep business-specific requests in their feature:

```text
features/goals/api/goals.api.ts
features/auth/api/auth.api.ts
```

Name business API modules `<domain>.api.ts`.

## TanStack Query hooks

Name TanStack Query hook files and exported functions after both the business
operation and the server-state primitive they expose:

```text
useCurrentUserQuery.ts      -> useCurrentUserQuery
useRegisterMutation.ts      -> useRegisterMutation
```

Use the `Query` suffix for hooks backed by `useQuery` and the `Mutation` suffix
for hooks backed by `useMutation`. Keep transport method names focused on the
business operation, such as `authApi.register` and `authApi.getCurrentUser`;
do not add TanStack-specific suffixes to API methods.

## Storage

Use top-level `storage/` for generic persistence mechanisms:

```text
storage/
├── secure-storage.ts
└── storage.ts
```

Keep feature-specific persistence in the feature. For example,
`features/auth/storage/token-storage.ts` may depend on
`storage/secure-storage.ts`. Use a feature `storage/` directory when grouping
the persistence adapter makes its ownership clearer than a loose feature-root
module.

## Feature sessions

Keep feature-specific session orchestration under
`features/<feature>/session/` when it coordinates stateful lifecycle behavior
across multiple modules in that feature. Colocate session unit tests with their
source. Do not move domain-session behavior into top-level `services/`,
`storage/`, or `providers/` merely because it integrates those mechanisms.

## Services

Use `services/` for external SDK integrations and application-wide platform
capabilities:

```text
services/
├── analytics/
├── monitoring/
├── notifications/
└── attribution/
```

Examples include analytics providers, Sentry, push notifications, AppsFlyer,
and other external SDKs.

Do not place domain or business services in top-level `services/`. Keep
`goals.service.ts`, `auth.service.ts`, and equivalent domain logic in their
features.

## Config

Use `config/` for application configuration:

```text
config/
├── env.ts
└── constants.ts
```

Centralize environment access where practical. Do not turn `config/` into a
dumping ground.

## Providers

Use top-level `providers/` for application-level provider composition and
application-scoped context providers that expose state across feature
boundaries:

```text
providers/
├── AppProviders.tsx
├── AuthProvider.tsx
└── QueryProvider.tsx
```

Keep a provider in `features/<feature>/providers/` when its lifecycle and
consumers are confined to that feature subtree. Mounting a provider through
`AppProviders` alone does not determine ownership; application-wide consumers
and state coordination justify top-level provider ownership.
