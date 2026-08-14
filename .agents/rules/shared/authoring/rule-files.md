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
