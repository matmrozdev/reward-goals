---
title: Mobile architecture
description: Define the mobile project structure, ownership boundaries, feature organization, route responsibilities, and colocation decisions.
scope: mobile
applies_to:
  - apps/mobile source creation
  - apps/mobile source modification
  - mobile feature implementation
  - mobile refactoring
related_skills:
  - implement-mobile-code
---

# Mobile architecture

Organize mobile code by ownership. Optimize for discoverability, clear
boundaries, colocation, consistent naming, maintainability, and incremental
growth.

## Top-level ownership

Place code under `apps/mobile/src/` in the narrowest applicable owner:

1. Expo Router routes and layouts: `app/`
2. Business or domain code: `features/<feature>/`
3. Reusable, business-independent presentation: `ui/`
4. Themes and design tokens: `theme/`
5. Generic HTTP infrastructure: `api/`
6. Generic persistence mechanisms: `storage/`
7. External SDK and application-wide platform integrations: `services/`
8. Application configuration: `config/`
9. Application-level provider composition: `providers/`

Do not create empty directories to mirror this list. Create a directory only
when the application needs that responsibility.

Do not introduce vague top-level containers such as `shared/`, `common/`,
`core/`, or `infrastructure/`. Determine what functionality owns the code.

Read [Integrations](../integrations/integrations.md) for the detailed boundaries
of `api/`, `storage/`, `services/`, `config/`, and `providers/`.

## Feature organization

Place each business or domain feature in `features/<feature>/`. Within a
feature, use these canonical category names when that category exists:

```text
api/
components/
hooks/
providers/
screens/
session/
sheets/
storage/
types/
utils/
```

Do not create unused category directories. Do not substitute `ui/`, `views/`,
or `widgets/` for feature `components/`, or invent alternate names for the
other canonical categories.

```text
features/goals/
├── components/
│   ├── GoalCard.tsx
│   └── GoalForm.tsx
├── screens/
│   ├── GoalsScreen.tsx
│   └── GoalDetailsScreen.tsx
├── sheets/
│   └── GoalFormSheet.tsx
├── hooks/
│   └── useGoals.ts
├── api/
│   └── goals.api.ts
├── types/
│   └── goal.types.ts
└── utils/
    ├── calculate-goal-progress.ts
    └── calculate-goal-progress.test.ts
```

A smaller feature may contain only the categories it uses.

## Routes, screens, and sheets

Keep Expo Router route files in `app/` thin. Delegate screen implementations to
`features/<feature>/screens/`:

```tsx
import { GoalDetailsScreen } from '@/features/goals/screens/GoalDetailsScreen';

export default function GoalDetailsRoute() {
  return <GoalDetailsScreen />;
}
```

Do not put full screen implementations, business logic, or API logic in route
files. Treat route default exports as framework boundaries, not as the component
export convention.

Place feature-owned bottom sheets or modal flows in
`features/<feature>/sheets/` when they behave like temporary screens: they own a
substantial interaction, coordinate feature state or mutations, and replace or
complement route-level navigation. Keep ordinary reusable feature elements in
`components/`.

Keep the business-independent presentation primitive that renders a modal or
bottom sheet in `ui/components/`. A feature sheet may compose that primitive,
but the primitive must not import feature code.

## Ownership and colocation

Place hooks close to their owner, for example in `features/goals/hooks/`,
`ui/hooks/`, or `services/analytics/hooks/`. Do not create a top-level `hooks/`
directory unless a hook is genuinely application-wide and has no clearer owner.

Keep code feature-specific while it expresses a business concept. Promote code
to `ui/` or another application-wide layer only when its responsibility is
business-independent and shared ownership is demonstrated.

Do not extract a global abstraction merely because two implementations look
similar. Prefer limited duplication over an abstraction with the wrong owner.

Read [Components](../components/components.md) for component and import
boundaries, [Styling](../styling/styling.md) for visual ownership, and
[Utilities and testing](../testing/utils-and-testing.md) before extracting
helpers.
