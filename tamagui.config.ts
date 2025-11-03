// tamagui.config.ts
import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

export default createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      // thêm màu nhấn
      primary: '#3797EF',
    },
    dark: {
      ...defaultConfig.themes.dark,
      primary: '#3797EF',
      background: '#0B141A',
      color: '#FFFFFF',
    },
  },
})
