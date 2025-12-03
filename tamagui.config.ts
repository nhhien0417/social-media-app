import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const accentColor = '#0095F6'

const lightTheme = {
  ...defaultConfig.themes.light,

  background: '#FAFAFA',
  backgroundPress: '#F0F0F0',
  backgroundFocus: '#F0F0F0',
  backgroundHover: '#AAAAAA',
  backgroundModal: '#FFFFFF',

  color: '#000000',
  colorPress: '#000000',
  colorHover: '#000000',
  colorFocus: '#000000',
  placeholderColor: '#8E8E8E',

  borderColor: '#DBDBDB',
  borderColorPress: '#C7C7C7',

  primary: accentColor,
  primaryPress: '#0081D6',
  primaryHover: '#0081D6',
}

const darkTheme = {
  ...defaultConfig.themes.dark,

  background: '#000000',
  backgroundPress: '#121212',
  backgroundFocus: '#121212',
  backgroundHover: '#555555',
  backgroundModal: '#262626',

  color: '#FAFAFA',
  colorPress: '#FAFAFA',
  colorHover: '#FAFAFA',
  colorFocus: '#FAFAFA',
  placeholderColor: '#8E8E8E',

  borderColor: '#262626',
  borderColorPress: '#363636',

  primary: accentColor,
  primaryPress: '#1DA1F2',
  primaryHover: '#1DA1F2',
}

export default createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
    dark: darkTheme,
  },
})
