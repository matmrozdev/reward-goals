---
name: publish-pull-request
description: Publish issue-backed repository changes by confirming scope, validating and committing the intended diff, pushing safely, and creating or updating a concise pull request. Use when asked to commit and push changes, open a pull request, publish a branch, or prepare an existing pull request for review.
---

# Publish pull request

Publish one coherent, issue-backed change without including unrelated work.

## Workflow

1. Inspect the current branch, working tree, staged diff, remote, and complete
   source issue. If the branch is missing or does not follow repository naming,
   use [github-task-workflow](../github-task-workflow/SKILL.md) first.
2. Read and follow:
   - [GitHub issues](../../rules/shared/workflow/github-issues.md)
   - [Branch naming](../../rules/shared/workflow/branch-naming.md)
   - [Commit convention](../../rules/shared/workflow/commit-convention.md)
   - [Pull requests](../../rules/shared/workflow/pull-requests.md)
3. Confirm every changed file belongs to the issue. Stop for user direction when
   unrelated changes cannot be separated safely.
4. Stage explicit paths, inspect the staged diff, and create a compliant commit.
   Let the repository hooks run their configured validation. Do not amend
   existing commits unless the user requests it.
5. Push the current branch with upstream tracking, following the publication
   constraints in the pull request rule.
6. Create or update the pull request with the required concise description.
   Prefer an available GitHub connector and use authenticated `gh` as fallback.
7. Read the pull request back and verify its title, base and head branches,
   review state, description, closing keyword, and URL.
8. Report the branch, commit, and pull request URL.
