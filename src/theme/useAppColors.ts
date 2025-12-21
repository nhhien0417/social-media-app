import { useThemeName } from 'tamagui'
import { AppColors, type ThemeMode } from './colors'

/**
 * Custom hook to get themed colors
 *
 * @example
 * const colors = useAppColors()
 * <View backgroundColor={colors.background} />
 * <Text color={colors.text}>Hello</Text>
 */
export const useAppColors = () => {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const mode: ThemeMode = isDark ? 'dark' : 'light'

  return {
    // Theme info
    isDark,
    mode,

    // Basic colors
    background: AppColors[mode].background,
    backgroundSecondary: AppColors[mode].backgroundSecondary,
    backgroundTertiary: AppColors[mode].backgroundTertiary,

    text: AppColors[mode].text,
    textSecondary: AppColors[mode].textSecondary,
    textTertiary: AppColors[mode].textTertiary,
    placeholder: AppColors[mode].placeholder,

    border: AppColors[mode].border,
    borderSecondary: AppColors[mode].borderSecondary,

    accent: AppColors[mode].accent,
    accentHover: AppColors[mode].accentHover,

    card: AppColors[mode].card,
    modal: AppColors[mode].modal,
    overlay: AppColors[mode].overlay,

    // Input colors
    input: AppColors[mode].input,

    // Button colors
    button: AppColors[mode].button,

    // Semantic colors
    success: AppColors.semantic.success[mode],
    error: AppColors.semantic.error[mode],
    warning: AppColors.semantic.warning[mode],
    info: AppColors.semantic.info[mode],

    // Feature colors
    features: {
      storyGradient: AppColors.features.storyGradient,
      online: AppColors.features.online,
      offline: AppColors.features.offline,
      like: AppColors.features.like,
      love: AppColors.features.love,

      gallery: {
        icon: AppColors.features.gallery[mode],
        background: AppColors.features.gallery.background[mode],
      },
      camera: {
        icon: AppColors.features.camera[mode],
        background: AppColors.features.camera.background[mode],
      },
    },

    // Component colors
    components: {
      segmentControl: AppColors.components.segmentControl[mode],
      chip: AppColors.components.chip[mode],
      searchBar: AppColors.components.searchBar[mode],
    },

    // Direct access to full color palette if needed
    palette: AppColors,
  }
}

/**
 * Get a specific themed color value
 *
 * @example
 * const bgColor = getThemedColor('background', isDark)
 * const accentColor = getThemedColor('accent', isDark)
 */
export const getThemedColor = (
  colorKey: keyof typeof AppColors.light,
  isDark: boolean
): string => {
  const mode: ThemeMode = isDark ? 'dark' : 'light'
  return AppColors[mode][colorKey] as string
}

/**
 * Get semantic color
 *
 * @example
 * const successColor = getSemanticColor('success', isDark)
 */
export const getSemanticColor = (
  type: 'success' | 'error' | 'warning' | 'info',
  isDark: boolean
): string => {
  const mode: ThemeMode = isDark ? 'dark' : 'light'
  return AppColors.semantic[type][mode]
}
