---
name: github-task-workflow
description: Prepare issue-backed work in this repository by finding or creating the matching GitHub issue, reading its scope and acceptance criteria, deriving a compliant branch name, and creating or renaming the local branch safely. Use for implementation tasks that need a branch, requests to create or rename a branch, or checks immediately before a branch's first push.
---

# GitHub task workflow

Use the repository's GitHub issues as the source of truth and ensure every work
branch contains a real issue number.

## Workflow

1. Resolve the repository from the local `origin` remote and inspect the current
   branch and working tree without changing them.
2. Read these mandatory rules:
   - `../../rules/shared/workflow/github-issues.md`
   - `../../rules/shared/workflow/branch-naming.md`
   - `../../rules/shared/workflow/commit-convention.md`
3. If the user supplied an issue number or URL, fetch that issue and confirm it
   belongs to the current repository.
4. Otherwise, search open and closed issues using the task's important terms.
   Select a result only when it clearly describes the requested work.
5. If no issue matches an authorized implementation or branch-creation task,
   read [references/issue-template.md](references/issue-template.md), search once
   more for the proposed title, state the target repository and title, and create
   the issue.
6. Read the confirmed issue's complete Description, Scope, and Acceptance
   Criteria. Surface material conflicts with the user's request.
7. Read [references/naming-examples.md](references/naming-examples.md), derive the
   branch name from the issue, and verify it does not already exist locally or
   remotely.
8. Confirm the working tree can be preserved, then create the branch. If work
   already exists on a local nonconforming branch, rename it before its first
   push instead.
9. For implementation work, hand off to `refine-task` after issue resolution
   and branch preparation. Do not absorb requirements-refinement decisions into
   this Git workflow.
10. Report the issue URL and final branch name.

## Tool selection

- Prefer an available GitHub connector for issue search, reads, and creation.
- Use local Git for repository, status, branch, and ref checks.
- Use a GitHub CLI fallback only when it is installed, authenticated, and the
  connector does not cover the required operation.
- Never infer or invent an issue number from branch history, sequence, or local
  files.

## Safety

- Do not create duplicate issues.
- Do not create an issue for read-only analysis or discussion that will not
  produce implementation work.
- Do not overwrite an existing branch or discard working-tree changes.
- Do not push unless the user requested publication.
- Before any external issue write, state the exact repository and proposed
  title.
