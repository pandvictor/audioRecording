import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

type LevelBarProps = {
  label: string;
  value: number;
  tone?: 'accent' | 'success' | 'danger' | 'muted';
};

const toneColors = {
  accent: colors.accent,
  success: colors.success,
  danger: colors.danger,
  muted: colors.textMuted,
};

export const LevelBar = ({ label, value, tone = 'accent' }: LevelBarProps) => {
  const clamped = Math.min(Math.max(value, 0), 1);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="caption" tone="muted">
          {label}
        </AppText>
        <AppText variant="caption" tone="secondary">
          {Math.round(clamped * 100)}%
        </AppText>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${clamped * 100}%`, backgroundColor: toneColors[tone] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
