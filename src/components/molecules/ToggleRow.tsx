import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const ToggleRow = ({ label, value, onValueChange }: ToggleRowProps) => {
  return (
    <View style={styles.container}>
      <AppText variant="body" tone="secondary">
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
