---
title: Pull requests
description: Require concise, issue-linked pull requests that accurately describe and validate their changes.
scope: shared
applies_to:
  - pull request creation
  - pull request update
  - branch publication
related_skills:
  - publish-pull-request
---

# Pull requests

## Scope and title

- Open a pull request only from an issue-backed branch whose diff belongs to the
  confirmed source issue.
- Target the repository's default branch unless the user specifies another
  base.
- Use `<type>(<scope>): <imperative description>` for the title. Summarize the
  complete diff and normally match the source issue title.

## Description

Keep the description concise. Do not repeat the complete issue or provide a
step-by-step implementation log.

Use this structure:

```md
## Summary

- Describe the main outcome in one to three bullets.

## Validation

- `command or check that actually ran`

Resolves #123
```

- List only validation that actually ran. When no check was run, state
  `Not run` and give the reason.
- End with `Resolves #<issue-number>` using the confirmed source issue. Never
  infer or invent the number.
- When one pull request intentionally resolves multiple issues, use one
  `Resolves #<issue-number>` line for each issue.

## Publication

- Default agent-created pull requests to draft unless the user explicitly asks
  for a ready-for-review pull request.
- Verify the published title, base, head, description, review state, and URL.
- Do not force-push or overwrite remote work without explicit authorization.
