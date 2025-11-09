import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'
import { TamaguiProvider, Theme } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '../../tamagui.config'

type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isLoading: true,
  toggleTheme: () => {},
})

export const useAppTheme = () => useContext(ThemeContext)

const THEME_STORAGE_KEY = '@app_theme'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme)
        }
      } catch (error) {
        console.error('Failed to load theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme)
      } catch (error) {
        console.error('Failed to save theme:', error)
      }
    }

    if (!isLoading) {
      saveTheme()
    }
  }, [theme, isLoading])

  const toggleTheme = () =>
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const value = useMemo(
    () => ({ theme, toggleTheme, isLoading }),
    [theme, isLoading]
  )

  return (
    <ThemeContext.Provider value={value}>
      <TamaguiProvider config={config}>
        <Theme name={theme}>{children}</Theme>
      </TamaguiProvider>
    </ThemeContext.Provider>
  )
}
