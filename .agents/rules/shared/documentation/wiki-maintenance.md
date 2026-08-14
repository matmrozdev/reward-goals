---
title: Wiki maintenance
description: Keep the public GitHub Wiki aligned with meaningful product and technical changes.
scope: shared
applies_to:
  - feature implementation
  - dependency changes
  - architecture changes
  - authentication and security changes
  - development workflow changes
  - roadmap and implementation status changes
related_skills: []
---

# Wiki maintenance

Treat the public GitHub Wiki as part of the deliverable when repository work
changes the project's high-level product or technical documentation.

## Required impact check

Before completing relevant repository work, decide whether the change makes an
existing Wiki statement incomplete, inaccurate, or misleading. Record required
Wiki work in the same GitHub Issue or its acceptance criteria when it is known
at planning time.

Update the relevant existing Wiki page as part of the same task when a change:

- adds, removes, or materially changes a user-visible feature or core product
  concept;
- adds, replaces, or removes a direct library, framework, platform, database,
  or infrastructure tool that changes the documented technology stack or
  architectural direction;
- changes component responsibilities, system boundaries, data ownership, API
  style, persistence strategy, or other high-level architecture;
- changes authentication, authorization, session, resource-ownership, or
  public security behavior at the level described by the Wiki;
- changes contributor workflow, CI/CD capabilities, release automation,
  observability, milestones, roadmap status, or the project's implementation
  status;
- implements something that the Wiki currently labels as planned, or changes
  an agreed direction recorded there.

## When no Wiki update is needed

Do not update the Wiki merely to duplicate code or change logs. A Wiki update
is normally unnecessary for:

- internal refactoring that preserves documented behavior and boundaries;
- patch-level or transitive dependency updates with no documented impact;
- tests, formatting, or build fixes that do not change a documented capability;
- low-level schemas, endpoints, configuration values, or implementation details
  whose source of truth is code, tests, migrations, or generated API docs.

State that the Wiki impact was checked in the task handoff when no update is
needed and the reason would not otherwise be obvious.

## Content requirements

When updating the Wiki:

1. Prefer revising an existing page over creating a narrowly scoped page.
2. Describe implemented behavior as implemented and future direction as
   planned. Do not imply that merged scaffolding is a complete capability.
3. Keep content high-level and link the relevant GitHub Issue when useful.
4. Do not publish secrets, credentials, private infrastructure, defensive
   details, unreleased product mechanics, monetization plans, or speculative
   business ideas.
5. Update the sidebar when adding or renaming a page, and verify that internal
   Wiki links resolve.
6. Cite credible sources for factual claims that are not established by the
   repository itself.

The public Wiki is available at:

```text
https://github.com/matmrozdev/reward-goals/wiki
```

If a required Wiki update cannot be published, document the blocker in the
current Issue or Pull Request and create or identify a linked follow-up Issue.
Do not silently treat the documentation as complete.
