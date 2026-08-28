const baseSpaceUnit = 4;

export const space = (multiplier: number) => baseSpaceUnit * multiplier;

export const spacing = {
  none: space(0),
  xxs: space(0.5),
  xs: space(1),
  sm: space(2),
  md: space(3),
  lg: space(4),
  xl: space(6),
  xxl: space(8),
  xxxl: space(12),
} as const;

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  heading: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
} as const;

export const sizes = {
  borderWidth: 1,
  minTouchTarget: 44,
  controlSmall: 44,
  controlMedium: 48,
  controlLarge: 56,
  contentMaxWidth: 560,
} as const;

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;
