---
title: Rule files
description: Define how canonical agent rules are named, organized, and documented.
scope: shared
applies_to:
  - agent rule creation
  - agent rule maintenance
related_skills: []
---

# Rule files

Store rules at:

```text
.agents/rules/<scope>/<domain>/<kebab-case-name>.md
```

Use `shared`, `api`, or `mobile` as the scope. Add a domain that groups related
rules, such as `workflow`, `authoring`, `components`, `icons`, `database`, or
`testing`. Do not use numeric filename prefixes.

## Responsibility and boundaries

Give each rule one coherent responsibility with one clear owner. Make its title,
description, `applies_to` entries, and body describe the same boundary.

Split a rule when its sections:

- apply to independently selectable operations;
- belong to different domains or owners;
- can change for different reasons; or
- would force an agent to load substantial irrelevant guidance.

Keep each requirement in exactly one canonical rule. When another rule needs
context, provide only the minimum summary needed for navigation and link to the
canonical rule for the details. Do not maintain parallel copies of examples,
naming tables, or requirements.

Write rules as declarative project constraints and decision guidance. Put a
repeatable implementation procedure that selects or sequences rules in a skill.

Every rule must begin with:

```yaml
---
title: Human-readable title
description: One sentence describing the rule.
scope: shared
applies_to:
  - concrete operation
related_skills: []
---
```

Write requirements in imperative language. Include examples and invalid examples
when they remove ambiguity. Link related rules rather than duplicating their
content.

Update `.agents/README.md` whenever a rule is added, moved, renamed, or removed.
