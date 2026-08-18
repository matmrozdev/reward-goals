---
title: Mobile styling
description: Define React Native Unistyles usage, style files, theme ownership, token usage, animation placement, and styling-system boundaries.
scope: mobile
applies_to:
  - mobile component styling
  - mobile theme changes
  - mobile animation implementation
  - mobile visual refactoring
related_skills:
  - implement-mobile-code
---

# Mobile styling

Use React Native Unistyles throughout the mobile application. Do not introduce
or mix React Native `StyleSheet`, styled-components, NativeWind, or arbitrary
inline styling systems without an explicit architectural decision.

## Component styles

Place component styles in `ComponentName.styles.ts`:

```text
ui/components/Button/
├── Button.tsx
└── Button.styles.ts
```

Keep component-specific presentation constants in the `.styles.ts` file when
they belong to visual presentation. Follow
[Utilities and testing](../testing/utils-and-testing.md) when a helper becomes
standalone logic.

## Theme tokens

Use theme tokens whenever an appropriate token exists. Apply this to colors,
spacing, typography, border radius, responsive values, and other shared visual
decisions.

Prefer:

```ts
backgroundColor: theme.colors.primary;
```

Avoid hard-coded visual values such as:

```ts
backgroundColor: '#3366FF';
```

## Theme ownership

Keep `theme/` as a top-level concern separate from `ui/`. It defines the visual
language consumed by components and may contain:

```text
theme/
├── themes.ts
├── tokens.ts
├── typography.ts
├── breakpoints.ts
└── unistyles.ts
```

Create only files that are currently needed. Keep component-specific visual
decisions with the component rather than promoting them into the theme.

## Animations

Keep animation definitions that are primarily visual close to styling when
technically appropriate. Visual animation styles and constants may live in
`ComponentName.styles.ts`.

Keep complex runtime animation logic with the component or owning runtime
module when moving it into a style file would reduce clarity.
