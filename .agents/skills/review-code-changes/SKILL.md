---
name: review-code-changes
description: Review Reward Goals changes against the applicable project rules and surrounding architecture without modifying code. Use for pull requests, branch diffs, staged or unstaged work, selected files, completed features, and pre-push reviews across mobile, API, configuration, infrastructure, or mixed scopes.
---

# Review code changes

Review for concrete defects and boundary violations, not alternative personal
preferences.

## Select the review target

1. Resolve the exact target:
   - Pull request: inspect its complete diff against the base branch.
   - Branch: compare the merge base with the target branch through `HEAD`.
   - Staged changes: inspect `git diff --cached`.
   - Unstaged changes: inspect `git diff` and relevant untracked files.
   - Selected files or feature: inspect the named scope and its consumers.
2. Include enough surrounding implementation, tests, configuration, and
   contracts to understand the changed behavior. Do not review diff lines in
   isolation.

## Load applicable rules

1. Read [Shared code review](../../rules/shared/review/code-review.md) for every
   review.
2. For `apps/mobile`, read
   [Mobile code review](../../rules/mobile/review/code-review.md) and every
   existing mobile rule selected by the changed responsibilities.
3. For `apps/api`, read
   [API code review](../../rules/api/review/code-review.md).
4. For configuration, infrastructure, documentation, or repository workflow,
   read the applicable shared rules from the resource catalog.
5. Apply all relevant scopes for mixed changes.

## Perform the review

1. Trace changed behavior through callers, consumers, state, persistence, and
   error paths where relevant.
2. Check existing tests and run focused read-only checks when they materially
   improve confidence. Do not use formatting noise as review feedback.
3. Verify every proposed finding against the code and applicable rules. Explain
   a concrete failure mode, security boundary, or maintenance risk.
4. Report findings and the required review summary in the shared rule's format.
   It is valid to report no meaningful findings.
5. Do not modify files, post review comments, approve, or request changes when
   asked only to review. Implement or publish review actions only when the user
   explicitly requests them.

## Pre-push timing

Run this review once after implementation is complete and immediately before
the first push or an update to an existing pull request. Repeat it only after
material changes to the reviewed scope. Run it at any other time when the user
explicitly requests a review.
