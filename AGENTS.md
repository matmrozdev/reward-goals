# Project agent instructions

This file is the automatically loaded entry point for agents working in this
repository. Treat its requirements as mandatory.

## Select task guidance

1. Open `.agents/README.md` as the resource catalog.
2. Select and read the shared rules applicable to the requested operation.
3. Also select and read API rules for work affecting `apps/api`.
4. Also select and read mobile rules for work affecting `apps/mobile`.
5. When the task matches a cataloged skill, read its complete `SKILL.md` before
   taking task actions.
6. For feature, dependency, architecture, authentication, workflow, roadmap, or
   implementation-status changes, read
   `.agents/rules/shared/documentation/wiki-maintenance.md` and complete its
   Wiki-impact check before finishing the task.

Load only the rules relevant to the task, except when a rule explicitly says it
is mandatory for an operation.

## Mandatory Git workflow

Before creating, renaming, or first pushing a branch, use the
`github-task-workflow` skill and follow all of these rules:

- `.agents/rules/shared/workflow/github-issues.md`
- `.agents/rules/shared/workflow/branch-naming.md`
- `.agents/rules/shared/workflow/commit-convention.md`

GitHub issues are the source of truth for implementation scope and acceptance
criteria. If implementation work has no matching issue, create one using the
repository template before creating the branch. If work already started on a
local branch, create or find the issue and rename the branch before its first
push.

## Maintain agent resources

- Follow `.agents/rules/shared/authoring/rule-files.md` when changing rules.
- Follow `.agents/rules/shared/authoring/skill-files.md` when changing skills.
- Keep `.agents/README.md` synchronized as a catalog whenever a resource is
  added, moved, renamed, or removed.
- Keep tool adapters such as `CLAUDE.md` as pointers to this file. Do not copy
  project rules into tool-specific files or directories.
