---
title: Code review
description: Define shared code-review priorities, evidence standards, findings, and merge-readiness outcomes.
scope: shared
applies_to:
  - pull request review
  - branch review
  - working-tree review
  - pre-push review
related_skills:
  - review-code-changes
---

# Code review

## Priorities

Prioritize findings in this order:

1. Correctness and bugs
2. Security and data integrity
3. Architecture and responsibility violations
4. Incorrect ownership or code placement
5. API or domain contract problems
6. Missing validation or error handling
7. Incorrect state or lifecycle handling
8. Meaningful duplication
9. Maintainability and unnecessary complexity
10. Tests for important behavior
11. Naming, readability, and consistency
12. Minor style issues

Do not let low-value style comments obscure meaningful problems.

## Review requirements

- Explain the concrete failure mode or maintenance risk behind every finding.
- Verify async behavior, cleanup, null assumptions, external input, error paths,
  state synchronization, authorization, and persistence where relevant.
- Judge architecture and ownership against existing project rules and
  established code, not theoretical purity.
- Prefer simple, readable implementations over clever or premature
  abstractions.
- Report duplication only when the behavior represents the same responsibility,
  must change together, or creates a realistic maintenance risk.
- Review new dependencies for necessity, overlap, runtime suitability, and
  disproportionate cost.
- Request tests for business rules, authorization, validation, state
  transitions, edge cases, failure paths, and regressions—not for trivial
  implementation details or coverage alone.
- Check that tests are deterministic, behavior-focused, precisely asserted, and
  mock only appropriate boundaries.
- Report dead code, stale paths, or obsolete configuration only when it belongs
  to or directly affects the reviewed change.

## Discipline

- Do not invent findings to make the review appear useful.
- Do not report formatting enforced by tooling, subjective preferences,
  evidence-free scalability concerns, or impractical micro-optimizations.
- Do not request unrelated cleanup.
- Do not recommend memoization, extraction, or abstraction without a concrete
  benefit.
- Accept a review with no meaningful findings.
- Keep review-only work read-only unless the user explicitly requests fixes.

## Findings

List findings before the summary and order them by severity. For each finding,
provide:

- **Severity:** `critical`, `high`, `medium`, or `low`
- **Location:** file and tight line range when available
- **Problem:** concise description of what is wrong
- **Why it matters:** concrete consequence or maintenance risk
- **Recommendation:** specific direction for fixing it

Keep findings concise and actionable. If there are no findings, state that
explicitly.

## Summary

After the findings, briefly assess overall correctness, architecture and
ownership, readability and maintainability, tests, and merge readiness. End with
exactly one of:

- `Ready to merge`
- `Ready to merge with minor suggestions`
- `Changes recommended before merge`
- `Blocking issues found`

Do not block a change for optional improvements.
