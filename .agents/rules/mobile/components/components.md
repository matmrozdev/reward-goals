---
title: Mobile components
description: Define mobile component ownership, structure, naming, functions, exports, props, barrels, grouping, and import conventions.
scope: mobile
applies_to:
  - mobile component creation
  - mobile screen creation
  - mobile component refactoring
  - mobile TypeScript imports
related_skills:
  - implement-mobile-code
---

# Mobile components

Follow [Mobile architecture](../architecture/architecture.md) to select the
component owner before applying these conventions.

## Feature components

Place business-specific components in
`features/<feature>/components/`. Keep simple components flat:

```text
features/goals/components/
├── GoalCard.tsx
├── GoalForm.tsx
└── GoalEmptyState.tsx
```

Give a component its own directory only when it owns multiple related files and
grouping reduces clutter:

```text
features/goals/components/GoalCard/
├── GoalCard.tsx
└── GoalCard.styles.ts
```

Do not make per-component directories a mandatory feature pattern.

## Reusable UI components

Reserve `ui/` for reusable, business-independent presentation primitives such
as Button, Text, Input, Card, Modal, Divider, Avatar, Screen, and Loader. Keep
business concepts such as GoalCard, RewardCard, and GoalProgress in their
features.

Give every reusable component in `ui/components/` its own directory:

```text
ui/components/Button/
├── Button.tsx
├── Button.styles.ts
└── index.ts
```

Do not add generic component utility files such as `Button.utils.ts`. Follow
[Utilities and testing](../testing/utils-and-testing.md) when logic needs
extraction.

## Functions and props

Write functional React components as arrow functions:

```tsx
type ButtonProps = {
  title: string;
};

export const Button = ({ title }: ButtonProps) => {
  return ...;
};
```

Do not use function declarations or `React.FC` by default. Use a different form
only when a concrete technical requirement justifies it.

Prefer TypeScript `type` for component props, local types, unions, and composed
types. Keep component-specific props in the component file. Do not create a
separate type file for one component's props.

Place domain types shared by a feature in
`features/<feature>/types/<domain>.types.ts`.

## Exports and barrels

Use named exports for regular components. Reserve default exports for Expo
Router route files or framework boundaries that require them.

Use a local `index.ts` barrel at a reusable component boundary:

```ts
export { Button } from './Button';
```

Do not create giant global barrel files.

## Naming

- Name components and screens in PascalCase: `GoalCard.tsx`,
  `GoalDetailsScreen.tsx`.
- Use a `Screen` suffix for screen-level components.
- Name styles `ComponentName.styles.ts`.
- Name hooks `useSomething.ts`, such as `useGoals.ts`.
- Name feature type modules `<domain>.types.ts`.

## Imports

Prefer the `@/` alias for imports across modules:

```ts
import { Button } from '@/ui/components/Button';
import { apiClient } from '@/api/client';
```

Use short relative imports inside the same small module:

```ts
import { styles } from './Button.styles';
```

Do not use deep relative paths to cross ownership boundaries.
