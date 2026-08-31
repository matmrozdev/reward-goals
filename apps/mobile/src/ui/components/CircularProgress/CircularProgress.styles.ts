import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create({
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
  ring: {
    position: 'absolute',
  },
});
