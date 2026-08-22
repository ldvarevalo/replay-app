export const typography = {
  family: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemibold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    heading: 'Newsreader_400Regular_Italic',
    headingSemibold: 'Newsreader_600SemiBold_Italic',
    headingBold: 'Newsreader_700Bold_Italic',
  },
  size: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1.5,
    widest: 2,
  },
} as const;

export type TypographyVariant =
  'display' | 'title' | 'heading' | 'body' | 'label' | 'navLink';

export const typographyVariants: Record<
  TypographyVariant,
  {
    family: keyof typeof typography.family;
    size: keyof typeof typography.size;
    weight: keyof typeof typography.weight;
    letterSpacing: keyof typeof typography.letterSpacing;
  }
> = {
  display: {
    family: 'headingBold',
    size: '2xl',
    weight: 'bold',
    letterSpacing: 'tight',
  },
  title: {
    family: 'headingSemibold',
    size: 'xl',
    weight: 'semibold',
    letterSpacing: 'tight',
  },
  heading: {
    family: 'headingSemibold',
    size: 'md',
    weight: 'semibold',
    letterSpacing: 'normal',
  },
  body: {
    family: 'sans',
    size: 'sm',
    weight: 'normal',
    letterSpacing: 'normal',
  },
  label: {
    family: 'sansMedium',
    size: '2xs',
    weight: 'medium',
    letterSpacing: 'wider',
  },
  navLink: {
    family: 'sansMedium',
    size: '2xs',
    weight: 'medium',
    letterSpacing: 'wider',
  },
};
