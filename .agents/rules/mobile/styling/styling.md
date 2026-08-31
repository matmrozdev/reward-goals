---
title: Mobile styling
description: Define React Native Unistyles usage, style files, theme ownership, token usage, mobile image assets, animation placement, and styling-system boundaries.
scope: mobile
applies_to:
  - mobile component styling
  - mobile theme changes
  - mobile image asset creation and usage
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

Use `react-native-reanimated` as the standard runtime for mobile visual
animations. Do not mix it with React Native `Animated`, ad hoc JavaScript-frame
animation, or another animation runtime within the application unless a
platform or library constraint requires an exception and the reason is
documented next to the owning implementation.

The conventional `Animated` default import is acceptable only when it comes
from `react-native-reanimated`; do not interpret that import name as use of the
React Native `Animated` runtime.

Keep animation definitions that are primarily visual close to styling when
technically appropriate. Visual animation styles and constants may live in
`ComponentName.styles.ts`.

Keep complex runtime animation logic with the component or owning runtime
module when moving it into a style file would reduce clarity.

## Image assets

- Use raster assets for photography, watercolor, glow, blur, noise, and
  gradient-heavy artwork. Keep genuinely vector icons and logomarks as SVG.
- Keep editable, lossless masters outside the runtime asset directory. Export
  the app copy as lossless or near-lossless WebP after checking for halos,
  banding, and color shifts; use PNG when WebP does not preserve the artwork.
- Store runtime images under the narrowest owner in `assets/images/`, using
  descriptive kebab-case names. Do not include pixel dimensions in filenames.
- Render app images with `expo-image` and a static `require(...)`. Preserve the
  intrinsic aspect ratio, use percentage widths and responsive maximum widths,
  and choose `contentFit="contain"` unless cropping is intentional.
- Use theme spacing for surrounding gaps. Do not reproduce internal artwork
  with fixed `top`, `right`, `bottom`, or `left` coordinates.
- Mark decorative images as inaccessible. Give meaningful images a concise
  accessibility label that does not repeat adjacent visible text.
- Export enough pixels for two to three times the largest rendered size, then
  verify small and large phones, tablets, supported orientations, themes, and
  accessibility text sizes for stretching, clipping, overlap, and upscaling.
- Do not tint opaque painterly artwork at runtime. Provide a theme-specific
  variant or omit the artwork when its background or contrast cannot be
  preserved.
