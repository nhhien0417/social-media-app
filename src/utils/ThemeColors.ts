/**
 * Instagram & Facebook Inspired Theme Colors
 * 
 * This file contains the color palette used throughout the app,
 * inspired by modern social media platforms like Instagram and Facebook.
 */

export const ThemeColors = {
  // Primary Brand Colors
  primary: {
    light: '#0095F6', // Instagram Blue (light mode)
    dark: '#1DA1F2',  // Brighter blue for dark mode
  },

  // Background Colors
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  backgroundSecondary: {
    light: '#F5F5F5',
    dark: '#121212',
  },
  backgroundTertiary: {
    light: '#F0F0F0',
    dark: '#1A1A1A',
  },

  // Text Colors
  text: {
    primary: {
      light: '#262626', // Instagram's main text
      dark: '#FAFAFA',
    },
    secondary: {
      light: '#8E8E93', // iOS-style secondary text
      dark: 'rgba(250,250,250,0.6)',
    },
    tertiary: {
      light: '#C7C7CC',
      dark: 'rgba(250,250,250,0.4)',
    },
  },

  // Border Colors
  border: {
    light: '#DBDBDB', // Instagram's border
    dark: 'rgba(255,255,255,0.1)',
  },
  borderSecondary: {
    light: '#C7C7C7',
    dark: 'rgba(255,255,255,0.15)',
  },

  // Semantic Colors
  success: {
    light: '#34C759', // iOS Green
    dark: '#32D74B',
  },
  error: {
    light: '#FF3B30', // iOS Red
    dark: '#FF453A',
  },
  warning: {
    light: '#FF9500', // iOS Orange
    dark: '#FF9F0A',
  },
  info: {
    light: '#0095F6',
    dark: '#1DA1F2',
  },

  // Component-Specific Colors
  card: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  input: {
    background: {
      light: '#F0F0F0',
      dark: 'rgba(255,255,255,0.12)',
    },
    border: {
      light: '#DBDBDB',
      dark: 'rgba(255,255,255,0.15)',
    },
  },
  button: {
    primary: {
      background: {
        light: '#0095F6',
        dark: '#1DA1F2',
      },
      text: '#FFFFFF',
    },
    secondary: {
      background: {
        light: '#F0F0F0',
        dark: 'rgba(255,255,255,0.12)',
      },
      text: {
        light: '#262626',
        dark: '#FAFAFA',
      },
    },
  },

  // Social Media Accent Colors
  social: {
    facebook: '#1877F2',
    instagram: '#E1306C',
    instagramGradient: ['#F58529', '#FEDA77', '#DD2A7B', '#8134AF', '#515BD4'],
    twitter: '#1DA1F2',
    whatsapp: '#25D366',
  },

  // Functional Colors with Transparency
  overlay: {
    light: 'rgba(0,0,0,0.4)',
    dark: 'rgba(0,0,0,0.7)',
  },
  modalOverlay: {
    light: 'rgba(0,0,0,0.5)',
    dark: 'rgba(0,0,0,0.8)',
  },

  // Feature-Specific Colors
  story: {
    gradient: ['#F58529', '#FEDA77', '#DD2A7B', '#8134AF', '#515BD4'],
    ring: {
      viewed: {
        light: '#DBDBDB',
        dark: 'rgba(255,255,255,0.3)',
      },
      unviewed: ['#F58529', '#DD2A7B', '#8134AF'],
    },
  },

  // Status Colors
  online: '#34C759',
  offline: {
    light: '#8E8E93',
    dark: 'rgba(250,250,250,0.4)',
  },

  // Like/Reaction Colors
  like: '#FF3B30',
  love: '#FF3B30',
  comment: {
    light: '#0095F6',
    dark: '#1DA1F2',
  },
  share: {
    light: '#0095F6',
    dark: '#1DA1F2',
  },
} as const

/**
 * Helper function to get color based on theme
 */
export const getThemedColor = (
  colorPath: string,
  isDark: boolean
): string => {
  const keys = colorPath.split('.')
  let value: any = ThemeColors

  for (const key of keys) {
    value = value[key]
    if (value === undefined) return '#000000'
  }

  if (typeof value === 'object' && 'light' in value && 'dark' in value) {
    return isDark ? value.dark : value.light
  }

  return value
}

/**
 * Usage examples:
 * 
 * const accentColor = getThemedColor('primary', isDark)
 * const bgColor = getThemedColor('background', isDark)
 * const textColor = getThemedColor('text.primary', isDark)
 */
