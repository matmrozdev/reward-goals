# Agent resource catalog

This file inventories the agent-neutral rules and skills available in the
repository. Operational requirements and resource-selection instructions live
in the root `AGENTS.md`.

## Scopes

| Scope  | Coverage                                   |
| ------ | ------------------------------------------ |
| Shared | Repository-wide workflows and conventions  |
| API    | Backend-specific guidance for `apps/api`   |
| Mobile | Mobile-specific guidance for `apps/mobile` |

## Rules

| Scope  | Domain        | Rule                                                               | Description                                                                                                           |
| ------ | ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Shared | Workflow      | [GitHub issues](rules/shared/workflow/github-issues.md)            | Find or create the issue that defines implementation scope and acceptance criteria.                                   |
| Shared | Workflow      | [Task refinement](rules/shared/workflow/task-refinement.md)        | Discover available context and clarify only unresolved material requirements before implementation.                   |
| Shared | Workflow      | [Branch naming](rules/shared/workflow/branch-naming.md)            | Create issue-backed branches using the repository naming pattern.                                                     |
| Shared | Workflow      | [Commit convention](rules/shared/workflow/commit-convention.md)    | Format commits consistently and validate them with commitlint.                                                        |
| Shared | Review        | [Code review](rules/shared/review/code-review.md)                  | Prioritize evidence-backed findings and report consistent merge-readiness outcomes.                                   |
| Shared | Workflow      | [Pull requests](rules/shared/workflow/pull-requests.md)            | Publish concise pull requests that close their confirmed source issues.                                               |
| Shared | Documentation | [Wiki maintenance](rules/shared/documentation/wiki-maintenance.md) | Check Wiki impact and update public product or technical documentation when meaningful repository changes require it. |
| Shared | Authoring     | [Rule files](rules/shared/authoring/rule-files.md)                 | Add, scope, encapsulate, and document canonical project rules.                                                        |
| Shared | Authoring     | [Skill files](rules/shared/authoring/skill-files.md)               | Add focused procedural skills without duplicating declarative project rules.                                          |
| Mobile | Framework     | [Expo](rules/mobile/framework/expo.md)                             | Use the exact Expo documentation matching the installed SDK.                                                          |
| Mobile | Architecture  | [Architecture](rules/mobile/architecture/architecture.md)          | Define project structure, ownership boundaries, feature organization, routes, screens, and colocation.                |
| Mobile | Components    | [Components](rules/mobile/components/components.md)                | Define component structure, naming, functions, props, exports, barrels, and imports.                                  |
| Mobile | Styling       | [Styling](rules/mobile/styling/styling.md)                         | Define Unistyles, style files, theme tokens, image assets, theme ownership, animations, and styling boundaries.       |
| Mobile | Testing       | [Utilities and testing](rules/mobile/testing/utils-and-testing.md) | Define helper extraction, utility naming, mandatory tests, and unit-test quality.                                     |
| Mobile | Integrations  | [Integrations](rules/mobile/integrations/integrations.md)          | Define API, storage, service, configuration, SDK, and provider ownership.                                             |
| Mobile | Review        | [Mobile code review](rules/mobile/review/code-review.md)           | Review mobile lifecycle, state, ownership, accessibility, styling, and platform risks.                                |
| API    | Review        | [API code review](rules/api/review/code-review.md)                 | Review backend contracts, authorization, persistence, data integrity, and tests.                                      |

## Skills

| Skill                                                          | Description                                                                                 | Supporting resources                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [github-task-workflow](skills/github-task-workflow/SKILL.md)   | Find or create a GitHub issue, derive a compliant name, and prepare an issue-backed branch. | [Issue template](skills/github-task-workflow/references/issue-template.md), [naming examples](skills/github-task-workflow/references/naming-examples.md)                                                                                                                                                                          |
| [refine-task](skills/refine-task/SKILL.md)                     | Refine issue-backed work and ask only about unresolved material requirements.               | [Task refinement](rules/shared/workflow/task-refinement.md), [GitHub issues](rules/shared/workflow/github-issues.md)                                                                                                                                                                                                              |
| [implement-mobile-code](skills/implement-mobile-code/SKILL.md) | Implement or refactor mobile code by selecting and applying the relevant focused rules.     | [Architecture](rules/mobile/architecture/architecture.md), [components](rules/mobile/components/components.md), [styling](rules/mobile/styling/styling.md), [utilities and testing](rules/mobile/testing/utils-and-testing.md), [integrations](rules/mobile/integrations/integrations.md), [Expo](rules/mobile/framework/expo.md) |
| [review-code-changes](skills/review-code-changes/SKILL.md)     | Review mobile, API, and cross-cutting changes against applicable project rules.             | [Code review](rules/shared/review/code-review.md), [mobile review](rules/mobile/review/code-review.md), [API review](rules/api/review/code-review.md)                                                                                                                                                                             |
| [publish-pull-request](skills/publish-pull-request/SKILL.md)   | Validate, commit, push, and publish an issue-backed change as a concise pull request.       | [GitHub issues](rules/shared/workflow/github-issues.md), [branch naming](rules/shared/workflow/branch-naming.md), [commit convention](rules/shared/workflow/commit-convention.md), [pull requests](rules/shared/workflow/pull-requests.md)                                                                                        |
