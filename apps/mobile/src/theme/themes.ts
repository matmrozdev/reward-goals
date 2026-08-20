import { borderRadius, sizes, spacing, typography } from './tokens';

const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#475569',
  textInverse: '#FFFFFF',
  border: '#CBD5E1',
  primary: '#4F46E5',
  primaryPressed: '#4338CA',
  primaryMuted: '#EEF2FF',
  onPrimary: '#FFFFFF',
  danger: '#B91C1C',
  dangerPressed: '#991B1B',
  dangerMuted: '#FEF2F2',
  onDanger: '#FFFFFF',
  success: '#15803D',
  disabledSurface: '#E2E8F0',
  disabledText: '#64748B',
  shadow: '#0F172A',
  transparent: 'transparent',
};

type ThemeColors = { [Color in keyof typeof lightColors]: string };

export type AppTheme = {
  borderRadius: typeof borderRadius;
  colors: ThemeColors;
  sizes: typeof sizes;
  spacing: typeof spacing;
  typography: typeof typography;
};

export const lightTheme: AppTheme = {
  borderRadius,
  colors: lightColors,
  sizes,
  spacing,
  typography,
};

export const darkTheme: AppTheme = {
  borderRadius,
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceMuted: '#334155',
    text: '#F8FAFC',
    textMuted: '#CBD5E1',
    textInverse: '#0F172A',
    border: '#475569',
    primary: '#A5B4FC',
    primaryPressed: '#C7D2FE',
    primaryMuted: '#312E81',
    onPrimary: '#0F172A',
    danger: '#FCA5A5',
    dangerPressed: '#FECACA',
    dangerMuted: '#7F1D1D',
    onDanger: '#450A0A',
    success: '#86EFAC',
    disabledSurface: '#334155',
    disabledText: '#94A3B8',
    shadow: '#000000',
    transparent: 'transparent',
  },
  sizes,
  spacing,
  typography,
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};
