---
name: refine-task
description: Refine issue-backed implementation work by inspecting repository context, distinguishing material ambiguity from minor decisions, and asking only targeted blocking questions. Use after resolving the GitHub issue and before feature, behavior, architecture, API, data, security, or user-experience implementation starts, and use again if implementation uncovers a new material requirement.
---

# Refine task

Use the issue as the requirements baseline. Discover what the repository can
answer, clarify only decisions with material consequences, and continue when
only conventional implementation details remain.

## Workflow

1. Confirm that `github-task-workflow` resolved the matching issue. Read its
   complete Description, Scope, and Acceptance Criteria. Treat them as settled
   unless the current request or repository evidence conflicts with them.
2. Read
   `../../rules/shared/workflow/task-refinement.md` and the rules and skills
   applicable to the implementation area.
3. Inspect only relevant context: related issues, code and tests, documented
   contracts, schemas, migrations, ownership boundaries, and Wiki pages.
4. Identify decisions that remain unresolved after discovery. Classify each
   using the shared rule rather than treating every unknown as a question.
5. If only minor decisions remain, make reasonable choices from project rules
   and established patterns, then continue with the applicable implementation
   skill. Mention a non-obvious assumption when it would help the user review
   the result.
6. If material ambiguity remains, ask the smallest useful set of targeted
   questions. Explain why each answer matters and provide concise options when
   useful. Do not start work that depends on those answers.
7. Reconcile the answers with the issue and agreed scope before continuing.
   Flag a required issue update when the recorded requirements would otherwise
   be inaccurate; do not perform the GitHub write without authorization.
8. Re-enter this workflow if implementation exposes a new material requirement.
   Stop only the affected work and continue safe independent discovery when it
   is useful.

## Completion signal

Refinement is complete when the issue and discovered context define the
material behavior well enough to implement without inventing product,
architecture, data, security, or contract decisions. Do not create a separate
requirements document unless the issue explicitly requires one.
