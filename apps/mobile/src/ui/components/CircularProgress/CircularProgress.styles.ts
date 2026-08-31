import { StyleSheet } from 'react-native-unistyles';

type SegmentStyleProps = {
  active: boolean;
  height: number;
  left: number;
  rotation: string;
  top: number;
  width: number;
};

export const styles = StyleSheet.create((theme) => ({
  container: (size: number) => ({
    alignItems: 'center',
    height: size,
    justifyContent: 'center',
    position: 'relative',
    width: size,
  }),
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: ({
    active,
    height,
    left,
    rotation,
    top,
    width,
  }: SegmentStyleProps) => ({
    backgroundColor: active ? theme.colors.primary : theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.pill,
    height,
    left,
    position: 'absolute',
    top,
    transform: [{ rotate: rotation }],
    width,
  }),
}));
