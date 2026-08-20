import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from './tokens';
import { appThemes } from './themes';

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  // Module augmentation requires interfaces to extend Unistyles' declarations.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends AppBreakpoints {}

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  themes: appThemes,
  settings: {
    adaptiveThemes: true,
    nativeBreakpointsMode: 'points',
  },
});
