/**
 * App color palette based on the design system
 */

export const AppColors = {
  surface: 'rgb(255, 250, 255)',
  surface2: 'rgb(241, 245, 249)',
  surface3: 'rgb(174, 212, 255)',
  fg: 'rgb(22, 22, 22)',
  fgMuted: 'rgb(109, 109, 109)',
  fgMuted2: 'rgb(138, 138, 138)',
  fgInverted: 'rgb(255, 250, 255)',
  primary: 'rgb(72, 99, 156)',
  primaryHover: 'rgba(72, 99, 156, 0.836)',
  destructive: 'rgb(215, 38, 61)',
  success: 'rgb(21, 127, 31)',
};

const tintColorLight = AppColors.primary;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: AppColors.fg,
    background: AppColors.surface,
    tint: tintColorLight,
    icon: AppColors.fgMuted,
    tabIconDefault: AppColors.fgMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
