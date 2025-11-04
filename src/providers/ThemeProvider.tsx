import React, { createContext, useContext, useState, useMemo } from 'react'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../../tamagui.config'

type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export const useAppTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () =>
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      <TamaguiProvider config={config}>
        <Theme name={theme}>{children}</Theme>
      </TamaguiProvider>
    </ThemeContext.Provider>
  )
}
