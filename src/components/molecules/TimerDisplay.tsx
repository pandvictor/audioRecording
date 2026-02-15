import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

type TimerDisplayProps = {
  label: string;
  time: string;
};

export const TimerDisplay = ({ label, time }: TimerDisplayProps) => {
  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="display" tone="primary">
        {time}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
