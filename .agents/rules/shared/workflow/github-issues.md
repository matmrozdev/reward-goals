---
title: GitHub issues
description: Use GitHub issues as the source of truth for implementation scope and acceptance criteria.
scope: shared
applies_to:
  - implementation tasks
  - branch creation
  - branch rename
  - first branch push
related_skills:
  - github-task-workflow
  - refine-task
---

# GitHub issues

## Requirements

- Resolve the repository from the local `origin` remote.
- Use the issue explicitly named by the user when it belongs to this repository.
- Otherwise, search open and closed issues for a task matching the requested
  work. Check closed issues to avoid creating duplicates.
- Read the complete issue title, Description, Scope, and Acceptance Criteria
  before implementing it.
- Treat the issue as the source of truth. Report material conflicts between the
  user's request and the issue instead of silently changing scope.
- Never invent an issue number.

## Create a missing issue

When implementation or branch creation is requested and no matching issue
exists, create an issue before creating the branch. If work already exists on a
local branch, create the issue before the branch's first push and rename the
branch to include its number.

Before creating an issue:

1. Search for duplicates using the intended title and its important keywords.
2. Derive the title, description, scope, and acceptance criteria from the user
   request and verified repository context.
3. State the exact repository and proposed issue title before the external
   write.

Use this title pattern:

```text
<type>(<scope>): <imperative description>
```

Use the body headings exactly as shown in
`../../../skills/github-task-workflow/references/issue-template.md`.

## Type and scope

Prefer the issue's existing type and scope. For a new issue, choose the narrowest
accurate values.

Common types are `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`,
`perf`, `build`, and `revert`.

Common scopes are `repo`, `api`, `mobile`, `shared`, `devops`, `ci`, and `deps`.
New lowercase scopes are allowed when they identify a stable project area more
clearly.

## Examples

```text
chore(repo): configure ESLint and Prettier
feat(api): implement user registration
feat(mobile): implement authentication flow
test(api): add authentication integration tests
```
