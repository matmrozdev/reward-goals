import type { ReactNode } from 'react';
import { View } from 'react-native';

import { normalizeProgress } from '@/ui/utils/normalize-progress';

import { styles } from './CircularProgress.styles';

const segmentCount = 24;

export type CircularProgressProps = {
  accessibilityLabel: string;
  children?: ReactNode;
  max: number;
  size?: number;
  value: number;
};

export const CircularProgress = ({
  accessibilityLabel,
  children,
  max,
  size = 104,
  value,
}: CircularProgressProps) => {
  const progress = normalizeProgress({ max, value });
  const activeSegmentCount = Math.round(progress.fraction * segmentCount);
  const segmentHeight = size * 0.11;
  const segmentWidth = Math.max(size * 0.035, 3);
  const radius = size / 2 - segmentHeight / 2;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: progress.max, min: 0, now: progress.value }}
      style={styles.container(size)}
    >
      {Array.from({ length: segmentCount }, (_, index) => {
        const degrees = -90 + (index * 360) / segmentCount;
        const radians = (degrees * Math.PI) / 180;
        const left = size / 2 + radius * Math.cos(radians) - segmentWidth / 2;
        const top = size / 2 + radius * Math.sin(radians) - segmentHeight / 2;

        return (
          <View
            key={degrees}
            style={styles.segment({
              active: index < activeSegmentCount,
              height: segmentHeight,
              left,
              rotation: `${degrees + 90}deg`,
              top,
              width: segmentWidth,
            })}
          />
        );
      })}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.content}
      >
        {children}
      </View>
    </View>
  );
};
