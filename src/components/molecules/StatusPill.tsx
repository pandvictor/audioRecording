import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

type StatusPillProps = {
  label: string;
  tone?: 'idle' | 'recording' | 'processing' | 'success' | 'error';
};

const toneStyles = {
  idle: { backgroundColor: colors.surfaceAlt, text: colors.textSecondary },
  recording: { backgroundColor: colors.accent, text: colors.textPrimary },
  processing: { backgroundColor: colors.surfaceAlt, text: colors.accent },
  success: { backgroundColor: colors.success, text: colors.textPrimary },
  error: { backgroundColor: colors.danger, text: colors.textPrimary },
};

export const StatusPill = ({ label, tone = 'idle' }: StatusPillProps) => {
  const stylesForTone = toneStyles[tone];

  return (
    <View style={[styles.base, { backgroundColor: stylesForTone.backgroundColor }]}
    >
      <AppText variant="caption" tone="primary" style={{ color: stylesForTone.text }}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
});
