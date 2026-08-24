import type { FunctionComponent, ReactNode } from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { typographyVariants, type TypographyVariant } from '@/theme/typography';

/**
 * Types
 */

export type TextColor =
  | 'onSurface'
  | 'onSurfaceVariant'
  | 'primary'
  | 'destructive'
  | 'onPrimaryContainer';

export interface TextComponentProps extends TextProps {
  children?: ReactNode;
  variant?: TypographyVariant;
  color?: TextColor;
  numberOfLines?: number;
}

type VariantTokens = (typeof typographyVariants)['display'];

/**
 * Text
 */

export const Text: FunctionComponent<TextComponentProps> = ({
  children,
  variant = 'body',
  color = 'onSurface',
  style,
  numberOfLines,
  ...props
}) => {
  const variantTokens = typographyVariants[variant];

  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[styles.base(variantTokens), styles.color(color), style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  base: (variant: VariantTokens) => ({
    fontFamily: theme.typography.family[variant.family],
    fontSize: theme.typography.size[variant.size],
    fontWeight: theme.typography.weight[variant.weight] as
      '400' | '500' | '600' | '700',
    letterSpacing: theme.typography.letterSpacing[variant.letterSpacing],
  }),
  color: (color: TextColor) => ({
    color: theme.colors[color],
  }),
}));
