---
title: Branch naming
description: Require issue-backed, typed, descriptive Git branch names.
scope: shared
applies_to:
  - branch creation
  - branch rename
  - first branch push
related_skills:
  - github-task-workflow
---

# Branch naming

## Pattern

Every work branch must use:

```text
<type>/<issue-number>-<short-description>
```

The enforced pattern is:

```regex
^(feat|fix|chore|refactor|docs|test|ci|perf|build|revert)/[1-9][0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*$
```

`main`, `master`, and `develop` are exempt as protected integration branches.

## Derivation

1. Take the type from the issue title.
2. Take the numeric ID from the confirmed GitHub issue.
3. Derive the description from the issue title after the scope.
4. Convert it to lowercase kebab-case.
5. Remove punctuation and redundant filler without changing the task's meaning.

## Examples

```text
chore/4-configure-eslint-and-prettier
feat/10-implement-user-registration
fix/42-prevent-duplicate-goal-rewards
```

Invalid examples:

```text
feature/user-registration
feat/implement-user-registration
feat/10
Feat/10-user-registration
```

Before creating the branch, confirm that the issue exists in the current
repository and that neither a local nor remote branch already uses the proposed
name. Do not discard or overwrite local work when switching or renaming.
