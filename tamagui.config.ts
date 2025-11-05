import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const accentColor = '#3797EF'
const lightTheme = {
  ...defaultConfig.themes.light,

  background: '#FFFFFF',
  backgroundPress: '#f5f5f5',
  backgroundFocus: '#f5f5f5',
  backgroundHover: '#f5f5f5',

  color: '#000000',
  colorPress: '#000000',
  colorHover: '#000000',
  colorFocus: '#000000',
  placeholderColor: '#999999',

  borderColor: '#ededed',
  borderColorPress: '#e5e5e5',

  primary: accentColor,
  primaryPress: '#2a87d9',
  primaryHover: '#2a87d9',
}

const darkTheme = {
  ...defaultConfig.themes.dark,

  background: '#000000',
  backgroundPress: '#191919',
  backgroundFocus: '#191919',
  backgroundHover: '#191919',

  color: '#FFFFFF',
  colorPress: '#FFFFFF',
  colorHover: '#FFFFFF',
  colorFocus: '#FFFFFF',
  placeholderColor: '#555555',

  borderColor: '#333333',
  borderColorPress: '#444444',

  primary: accentColor,
  primaryPress: '#4a9eee',
  primaryHover: '#4a9eee',
}

export default createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
    dark: darkTheme,
  },
})
