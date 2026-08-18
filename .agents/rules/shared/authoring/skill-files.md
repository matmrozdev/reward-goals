---
title: Skill files
description: Define how repository-local agent skills are named, structured, and validated.
scope: shared
applies_to:
  - skill creation
  - skill maintenance
related_skills: []
---

# Skill files

Store skills at:

```text
.agents/skills/<kebab-case-name>/SKILL.md
```

The skill folder name must match the `name` in `SKILL.md`. Use lowercase letters,
digits, and hyphens. Keep the name under 64 characters and prefer a concise,
action-oriented phrase. Make the name specific enough to communicate the skill's
actual scope; do not give a domain-specific workflow a generic repository-wide
name.

`SKILL.md` frontmatter must contain only `name` and `description`. Make the
description explain both the capability and the tasks that should trigger it.

Use only resources that support the workflow:

- `references/` for detailed patterns and domain knowledge.
- `scripts/` for deterministic repeated operations.
- `assets/` for templates or files copied into outputs.
- `agents/openai.yaml` only when Codex UI metadata is explicitly needed. Omit it
  by default.

## Responsibility and boundaries

Give each skill one repeatable outcome and a coherent trigger surface. Split a
skill when it contains independently useful workflows with different triggers,
owners, tools, or validation requirements.

Use skills for procedures: inspect context, select applicable rules, perform
ordered work, and validate the result. Use rules for declarative project
constraints and conventions.

Link every rule or supporting resource the skill depends on. Keep the skill
focused on selection, sequencing, decisions, and validation. Do not restate
detailed requirements, examples, naming tables, or architecture definitions
owned by rules.

Keep `SKILL.md` concise, link every supporting reference directly from it, and
avoid duplicating content between the skill and its references. Validate a new or
changed skill with the skill validator before considering it complete.

Update `.agents/README.md` whenever a skill is added, moved, renamed, or removed.
