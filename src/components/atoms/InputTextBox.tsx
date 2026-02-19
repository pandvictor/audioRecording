import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type InputTextBoxProps = TextInputProps & {
  tone?: 'primary' | 'secondary';
};

const toneStyles: Record<NonNullable<InputTextBoxProps['tone']>, TextStyle> = {
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
};

export const InputTextBox = ({
  style,
  tone = 'primary',
  placeholderTextColor = colors.textMuted,
  ...props
}: InputTextBoxProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor}
      selectionColor={colors.accent}
      style={StyleSheet.flatten([styles.base, toneStyles[tone], style as StyleProp<TextStyle>])}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
});
