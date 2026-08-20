---
title: Task refinement
description: Require issue-led context discovery and targeted clarification before implementation decisions are made.
scope: shared
applies_to:
  - feature implementation
  - behavior-changing implementation
  - architecture changes
related_skills:
  - refine-task
  - github-task-workflow
---

# Task refinement

## Start from the issue

Treat the confirmed GitHub Issue's Description, Scope, and Acceptance Criteria
as the primary requirements. Do not ask the user to repeat or reconsider a
decision that the issue already resolves clearly.

Surface a conflict when the current request, issue, or repository context
contradict one another. Do not silently choose which source to ignore.

## Discover available context

Before asking questions, inspect the context that can reasonably resolve them:

- the confirmed issue and relevant related issues;
- applicable project rules and skills;
- existing implementation, tests, and established patterns;
- repository and Wiki documentation;
- API contracts, schemas, migrations, and ownership boundaries when relevant.

Do not ask the user for information that is discoverable from these sources.
Limit discovery to context that can affect the requested task.

## Distinguish material ambiguity

Ask for clarification only when an unresolved answer could materially change:

- scope, acceptance criteria, architecture, or ownership boundaries;
- an API contract, data model, relationship, constraint, or migration;
- authentication, authorization, sensitive-data handling, or another security
  boundary;
- persistence, lifecycle or state transitions, important error handling, or
  backwards compatibility;
- user-visible behavior, navigation, accessibility behavior, or meaningful
  platform differences.

Consider happy paths, failure and empty states, edge cases, idempotency,
offline behavior, analytics, monitoring, and logging only when they are
relevant to the requested behavior. Do not expand every task to cover them.

## Make minor decisions without questions

Continue with a reasonable decision when it:

- is already governed by project rules;
- can be derived from existing code or an established pattern;
- is an internal implementation detail without meaningful product or
  architectural consequences; or
- has an obvious safe default that preserves the issue's scope.

Do not turn refinement into a questionnaire or use it to broaden an MVP.

## Ask useful questions

Ask only questions that currently block or materially influence
implementation. Make each question specific and actionable. Group related
decisions, provide the context needed to understand why they matter, and offer
reasonable options with brief trade-offs when that makes the decision easier.

Avoid vague requests for more detail and large speculative question lists.

## Protect the agreed scope

Do not make implementation decisions that depend on unresolved material
requirements. Read-only discovery and other work independent of the answer may
continue.

When implementation reveals a new material requirement or architectural
decision, stop the affected work and surface it. Reconcile the decision with
the issue before continuing when the existing issue would otherwise become
inaccurate; do not update GitHub without authorization.
