---
title: API code review
description: Define backend-specific correctness, security, persistence, contract, and testing checks for code review.
scope: api
applies_to:
  - apps/api review
  - backend feature review
  - API pre-push review
related_skills:
  - review-code-changes
---

# API code review

In addition to the shared review rule, verify:

- module ownership and controller, service, domain, and persistence boundaries;
- DTO and external-input validation;
- authentication, authorization, and resource-ownership enforcement in the
  backend;
- consistent API contracts, HTTP status codes, and error mapping;
- database query correctness, efficiency, transaction boundaries, races,
  unique constraints, and other required database guarantees;
- migration safety and compatibility with existing data;
- sensitive data exposure, insecure persistence, unsafe defaults, and secrets
  or sensitive values in logs;
- failures and partial operations that could leave inconsistent state;
- tests for business rules, validation, authorization, ownership, error paths,
  state transitions, and regression-prone behavior.

Never treat client-side validation or authorization as sufficient. Describe a
credible affected boundary for every security finding.

For unit tests, require the tested unit in `describe`, natural `it(...)` phrases
without `should`, deterministic behavior, meaningful assertions, and mocks only
at appropriate boundaries.
