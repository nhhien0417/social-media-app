import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

// Instagram/Facebook inspired color palette
const accentBlue = '#0095F6' // Instagram Blue
const accentBlueDark = '#1DA1F2' // Brighter for dark mode

const lightTheme = {
  ...defaultConfig.themes.light,

  // Backgrounds - Clean white with subtle grays
  background: '#FFFFFF',
  backgroundPress: '#F7F7F7',
  backgroundFocus: '#F7F7F7',
  backgroundHover: '#F0F0F0',
  backgroundModal: '#FFFFFF',
  backgroundStrong: '#F5F5F5',
  
  // Text colors
  color: '#262626', // Instagram's main text color
  colorPress: '#262626',
  colorHover: '#000000',
  colorFocus: '#262626',
  placeholderColor: '#8E8E93', // iOS-style placeholder

  // Borders - Subtle and refined
  borderColor: '#DBDBDB', // Instagram's border color
  borderColorPress: '#C7C7C7',
  borderColorHover: '#B3B3B3',

  // Primary colors
  primary: accentBlue,
  primaryPress: '#0081D6',
  primaryHover: '#0081D6',
}

const darkTheme = {
  ...defaultConfig.themes.dark,

  // Backgrounds - Modern dark gray (not pure black)
  background: '#000000', // Pure black like Instagram dark mode
  backgroundPress: '#1A1A1A',
  backgroundFocus: '#1A1A1A',
  backgroundHover: '#2A2A2A',
  backgroundModal: '#121212',
  backgroundStrong: '#262626',

  // Text colors
  color: '#FAFAFA', // High contrast white
  colorPress: '#FAFAFA',
  colorHover: '#FFFFFF',
  colorFocus: '#FAFAFA',
  placeholderColor: '#8E8E93',

  // Borders - Subtle in dark mode
  borderColor: '#262626', // Subtle gray borders
  borderColorPress: '#363636',
  borderColorHover: '#464646',

  // Primary colors - Brighter in dark mode
  primary: accentBlueDark,
  primaryPress: '#3DB5FF',
  primaryHover: '#3DB5FF',
}

export default createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
    dark: darkTheme,
  },
})
