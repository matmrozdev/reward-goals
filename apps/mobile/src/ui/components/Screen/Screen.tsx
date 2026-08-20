import { ScrollView, View } from 'react-native';
import type {
  ScrollViewProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { withUnistyles } from 'react-native-unistyles';

import { styles } from './Screen.styles';

export type ScreenProps = Omit<ViewProps, 'style'> & {
  centered?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentInsetAdjustmentBehavior?: ScrollViewProps['contentInsetAdjustmentBehavior'];
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  safeAreaEdges?: Edge[];
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

const defaultSafeAreaEdges: Edge[] = ['top', 'right', 'bottom', 'left'];
const ThemedSafeAreaView = withUnistyles(SafeAreaView);

export const Screen = ({
  centered = false,
  children,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = 'automatic',
  keyboardShouldPersistTaps = 'handled',
  safeAreaEdges = defaultSafeAreaEdges,
  scroll = true,
  style,
  ...props
}: ScreenProps) => (
  <ThemedSafeAreaView
    {...props}
    edges={safeAreaEdges}
    style={[styles.screen, style]}
  >
    {scroll ? (
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          styles.content,
          styles.scrollContent,
          centered && styles.centered,
          contentContainerStyle,
        ]}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    ) : (
      <View
        style={[
          styles.content,
          styles.staticContent,
          centered && styles.centered,
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    )}
  </ThemedSafeAreaView>
);
