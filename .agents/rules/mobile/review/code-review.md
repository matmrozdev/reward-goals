---
title: Mobile code review
description: Define mobile-specific risks and project-rule selection for code review.
scope: mobile
applies_to:
  - apps/mobile review
  - mobile feature review
  - mobile pre-push review
related_skills:
  - review-code-changes
---

# Mobile code review

Read the existing mobile rules that match the changed responsibilities:

- [Expo](../framework/expo.md)
- [Architecture](../architecture/architecture.md)
- [Components](../components/components.md)
- [Styling](../styling/styling.md)
- [Utilities and testing](../testing/utils-and-testing.md)
- [Integrations](../integrations/integrations.md)

In addition to the shared review rule, verify:

- feature ownership and route-versus-screen boundaries;
- component and hook responsibilities;
- effect dependencies and cleanup of listeners, subscriptions, and async work;
- stale state, race conditions, loading, error, and empty states;
- navigation behavior and ownership of API state versus local UI state;
- list keys and platform differences when they affect behavior;
- accessibility of interactive elements;
- Unistyles, theme-token, and styling ownership compliance;
- secure storage and absence of business logic in reusable UI;
- meaningful rendering or animation regressions.

Do not recommend `useMemo`, `useCallback`, or `memo` without a concrete
performance reason.
