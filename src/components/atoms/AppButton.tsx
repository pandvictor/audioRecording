import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  fullWidth?: boolean;
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
};

const labelTone: Record<Variant, 'primary' | 'secondary'> = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'secondary',
  danger: 'primary',
};

export const AppButton = ({
  label,
  variant = 'primary',
  fullWidth,
  style,
  disabled,
  ...props
}: AppButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        fullWidth ? styles.fullWidth : null,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      <AppText variant="subtitle" tone={labelTone[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});
