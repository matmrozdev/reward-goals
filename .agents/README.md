# Agent resource catalog

This file inventories the agent-neutral rules and skills available in the
repository. Operational requirements and resource-selection instructions live
in the root `AGENTS.md`.

## Scopes

| Scope | Coverage |
| --- | --- |
| Shared | Repository-wide workflows and conventions |
| API | Backend-specific guidance for `apps/api` |
| Mobile | Mobile-specific guidance for `apps/mobile` |

## Rules

| Scope | Domain | Rule | Description |
| --- | --- | --- | --- |
| Shared | Workflow | [GitHub issues](rules/shared/workflow/github-issues.md) | Find or create the issue that defines implementation scope and acceptance criteria. |
| Shared | Workflow | [Branch naming](rules/shared/workflow/branch-naming.md) | Create issue-backed branches using the repository naming pattern. |
| Shared | Workflow | [Commit convention](rules/shared/workflow/commit-convention.md) | Format commits consistently and validate them with commitlint. |
| Shared | Authoring | [Rule files](rules/shared/authoring/rule-files.md) | Add, organize, and document canonical project rules. |
| Shared | Authoring | [Skill files](rules/shared/authoring/skill-files.md) | Add and maintain repository-local skills. |
| Mobile | Framework | [Expo](rules/mobile/framework/expo.md) | Use the exact Expo documentation matching the installed SDK. |

The API scope currently has no specialized rules.

## Skills

| Skill | Description | Supporting resources |
| --- | --- | --- |
| [github-task-workflow](skills/github-task-workflow/SKILL.md) | Find or create a GitHub issue, derive a compliant name, and prepare an issue-backed branch. | [Issue template](skills/github-task-workflow/references/issue-template.md), [naming examples](skills/github-task-workflow/references/naming-examples.md) |
