import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

// Instagram accent color
const accentColor = '#0095F6'

const lightTheme = {
  ...defaultConfig.themes.light,

  background: '#FAFAFA', // Instagram light gray background
  backgroundPress: '#F0F0F0',
  backgroundFocus: '#F0F0F0',
  backgroundHover: '#F0F0F0',
  backgroundModal: '#FFFFFF',

  color: '#000000',
  colorPress: '#000000',
  colorHover: '#000000',
  colorFocus: '#000000',
  placeholderColor: '#8E8E8E', // Instagram gray

  borderColor: '#DBDBDB', // Instagram border
  borderColorPress: '#C7C7C7',

  primary: accentColor, // Instagram blue
  primaryPress: '#0081D6',
  primaryHover: '#0081D6',
}

const darkTheme = {
  ...defaultConfig.themes.dark,

  background: '#000000', // Instagram dark black
  backgroundPress: '#121212',
  backgroundFocus: '#121212',
  backgroundHover: '#121212',
  backgroundModal: '#262626', // Instagram dark modal

  color: '#FAFAFA', // Instagram light text
  colorPress: '#FAFAFA',
  colorHover: '#FAFAFA',
  colorFocus: '#FAFAFA',
  placeholderColor: '#8E8E8E',

  borderColor: '#262626', // Instagram dark border
  borderColorPress: '#363636',

  primary: accentColor, // Instagram blue
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
