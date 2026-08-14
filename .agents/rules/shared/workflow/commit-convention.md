---
title: Commit convention
description: Require Conventional Commit messages with a project scope and imperative subject.
scope: shared
applies_to:
  - commits
related_skills: []
---

# Commit convention

## Pattern

Commit messages must use:

```text
<type>(<scope>): <imperative description>
```

Examples:

```text
chore(repo): add agent workflow rules
feat(api): add goal creation endpoint
fix(mobile): preserve authentication session
test(api): cover duplicate registration
```

## Requirements

- Use one of `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`,
  `build`, or `revert`.
- Include a non-empty lowercase scope.
- Start the subject in lowercase.
- Use an imperative, concise subject without a trailing period.
- Use a body and footer when additional rationale or breaking-change metadata is
  necessary.

Husky runs commitlint in the `commit-msg` hook. Do not bypass the hook unless the
user explicitly requests it and understands why validation is being skipped.
