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
action-oriented phrase.

`SKILL.md` frontmatter must contain only `name` and `description`. Make the
description explain both the capability and the tasks that should trigger it.

Use only resources that support the workflow:

- `references/` for detailed patterns and domain knowledge.
- `scripts/` for deterministic repeated operations.
- `assets/` for templates or files copied into outputs.
- `agents/openai.yaml` for optional Codex UI metadata.

Keep `SKILL.md` concise, link every supporting reference directly from it, and
avoid duplicating content between the skill and its references. Validate a new or
changed skill with the skill validator before considering it complete.

Update `.agents/README.md` whenever a skill is added, moved, renamed, or removed.
