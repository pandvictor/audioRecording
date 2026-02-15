import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';
type Tone = 'primary' | 'secondary' | 'muted' | 'accent' | 'danger';

type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

const variantStyles: Record<Variant, TextStyle> = {
  display: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  caption: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: 0.2,
  },
};

const toneStyles: Record<Tone, TextStyle> = {
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
  accent: { color: colors.accent },
  danger: { color: colors.danger },
};

export const AppText = ({
  variant = 'body',
  tone = 'primary',
  align,
  style,
  ...props
}: AppTextProps) => {
  return (
    <Text
      {...props}
      style={StyleSheet.flatten([
        styles.base,
        variantStyles[variant],
        toneStyles[tone],
        align ? { textAlign: align } : null,
        style as StyleProp<TextStyle>,
      ])}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
