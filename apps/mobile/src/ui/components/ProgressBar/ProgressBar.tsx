import { View } from 'react-native';

import { normalizeProgress } from '@/ui/utils/normalize-progress';

import { styles } from './ProgressBar.styles';

export type ProgressBarTone = 'primary' | 'success';

export type ProgressBarProps = {
  accessibilityLabel: string;
  max: number;
  tone?: ProgressBarTone;
  value: number;
};

export const ProgressBar = ({
  accessibilityLabel,
  max,
  tone = 'primary',
  value,
}: ProgressBarProps) => {
  const progress = normalizeProgress({ max, value });

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: progress.max, min: 0, now: progress.value }}
      style={styles.track}
    >
      <View style={styles.fill(progress.fraction, tone)} />
    </View>
  );
};
