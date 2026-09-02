---
title: Maestro E2E tests
description: Define ownership, syntax, selectors, test data, critical-flow coverage, isolation, and failure diagnosis for mobile Maestro tests.
scope: mobile
applies_to:
  - Maestro flow creation
  - Maestro flow modification
  - mobile E2E selector creation
  - critical mobile flow changes
  - mobile E2E failure diagnosis
related_skills:
  - implement-mobile-code
---

# Maestro E2E tests

## Ownership and structure

Keep device-level E2E infrastructure in the monorepo workspace at `apps/e2e/`.
Use these boundaries:

```text
apps/e2e/
├── maestro/
│   ├── config.yaml
│   ├── flows/<feature>/
│   ├── scripts/
│   └── subflows/
└── scripts/
packages/test-ids/
```

- Put independently executable user journeys under `maestro/flows/`.
- Put reusable command sequences under `maestro/subflows/` so discovery does
  not execute them as standalone tests.
- Put Maestro sandbox JavaScript under `maestro/scripts/`.
- Put host-side runner and static validation scripts under `apps/e2e/scripts/`.
- Keep stable identifiers shared with the app in `packages/test-ids/`.
- Do not colocate Maestro YAML with mobile feature source or unit tests.

## Flow syntax and readability

Write top-level flows as YAML with metadata, a `---` document separator, and a
linear command list:

```yaml
appId: ${APP_ID}
name: Sign in with a prepared account
tags:
  - auth
  - critical
---
- launchApp:
    clearState: true
- tapOn:
    id: ${TEST_ID_AUTH_LOGIN_EMAIL_INPUT}
- inputText: ${EMAIL}
- assertVisible:
    id: ${TEST_ID_DASHBOARD_SCREEN}
```

- Name flow files in descriptive kebab-case.
- Give every top-level flow a human-readable `name` and meaningful feature and
  suite tags.
- Use `runFlow` for repeated user interaction and pass its data through `env`.
  Do not hide the main behavior under excessive subflows.
- Use `runScript` for API setup or non-trivial data generation. Keep simple UI
  behavior declarative in YAML.
- Use JavaScript `output` namespaces such as `output.auth` rather than loose
  global output fields.
- Use paths relative to the calling flow so local and cloud uploads remain
  portable.
- Do not rely on the execution order of top-level flows.

## Selectors and accessibility

Use React Native `testID` and Maestro's `id` selector for controls, dynamic
content, localized UI, and navigation targets. Treat each ID as a stable public
testing interface.

- Read IDs from `packages/test-ids`; do not create separate mobile and E2E
  constants containing the same values.
- Use semantic dotted values such as `auth.login.submit-button`.
- Use a shared base ID plus a stable resource ID for repeated domain elements.
- Keep `accessibilityLabel`, role, hint, and state meaningful to assistive
  technology. Do not replace accessibility semantics with test-only wording.
- Use visible text selectors only when displayed copy or user-created content
  is itself the behavior being verified and is intentionally stable.
- Do not use screen coordinates, hierarchy positions, or selector indexes when
  a stable ID can be added.
- Add IDs only at meaningful interaction or assertion boundaries. Do not tag
  every wrapper, label, or decorative element.

## Isolation and test data

- Start every top-level flow from a known state. Use `launchApp` with
  `clearState: true` unless the flow explicitly verifies persistence after a
  later relaunch.
- Make each flow runnable independently on a reset device. Do not depend on an
  account or state left by another flow.
- Generate a unique account identifier for every run and shard. Never share a
  mutable hard-coded test account.
- Use API setup to create prerequisite users, Goals, or Rewards when that setup
  is not the behavior under test. Use the UI when registration, Goal creation,
  or another setup journey is itself being verified.
- Run setup only against local, test, or staging environments with disposable
  data. Never embed production credentials or commit secrets.
- Keep credentials in test configuration or injected environment variables.
  Do not store refresh tokens or bypass authentication by modifying app storage.
- Assert every API setup response and fail immediately when setup did not
  create the required state.

## Critical-flow coverage

Cover a user journey with Maestro when its failure would prevent a user from
reaching or completing a core product outcome. Keep at least these foundations
covered:

- account registration;
- login and authenticated session restoration;
- logout;
- creating a Goal with its optional Reward;
- recording Goal progress.

When adding or materially changing another critical journey:

1. Add or update an isolated top-level flow in the same task.
2. Exercise the behavior through the UI, using API setup only for prerequisites.
3. Assert the observable result, not merely that a button was tapped.
4. Tag the flow `critical` and with its feature name.

Do not use Maestro for every edge case. Keep detailed validation and business
boundaries in unit or API integration tests, and reserve E2E for high-value
cross-layer journeys.

## Failure diagnosis

A failing critical flow is evidence that the product may be broken. Do not
start by weakening, skipping, retrying, marking optional, or rewriting the test
to make it pass.

When a critical flow fails:

1. Reproduce the user journey and identify the first observable divergence.
2. Inspect Maestro screenshots, hierarchy, logs, app logs, network/API state,
   and setup responses.
3. Distinguish a product regression from an unavailable environment, invalid
   test data, or a genuinely stale selector or expectation.
4. Fix application behavior when the documented journey no longer works.
5. Change the test only after verifying that product behavior is correct and
   the test interface or assumption is wrong.

Do not mask deterministic failures with retries or `optional: true`. Use
conditional commands only for genuinely optional platform or system UI. Keep a
failing critical flow visible and report the blocker when it cannot be resolved
inside the current task.

## Validation

Run static workspace validation for every Maestro or test-ID change:

```sh
pnpm validate:e2e
```

Run the narrowest affected suite on a real emulator or simulator when the app,
API, and pinned Maestro CLI are available. Report clearly when device execution
was not possible; static YAML validation is not a substitute for executing the
journey.
