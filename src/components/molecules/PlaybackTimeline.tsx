import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { formatDuration } from '../../utils/time';

type PlaybackTimelineProps = {
  isVisible: boolean;
  positionMs: number;
  durationMs: number;
};

export const PlaybackTimeline = ({
  isVisible,
  positionMs,
  durationMs,
}: PlaybackTimelineProps) => {
  if (!isVisible || durationMs <= 0) {
    return null;
  }

  const progress = Math.min(Math.max(positionMs / durationMs, 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <AppText variant="caption" tone="muted">
          {formatDuration(positionMs)}
        </AppText>
        <AppText variant="caption" tone="muted">
          {formatDuration(durationMs)}
        </AppText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
});
