/**
 * Centralized Theme Colors for the entire app
 * Inspired by Instagram & Facebook design system
 */

export const AppColors = {
  // ========== PRIMARY COLORS ==========
  primary: {
    instagram: '#0095F6',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
  },

  // ========== LIGHT MODE ==========
  light: {
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#F0F0F0',
    
    // Text
    text: '#262626',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
    placeholder: '#8E8E93',
    
    // Borders
    border: '#DBDBDB',
    borderSecondary: '#C7C7C7',
    
    // Primary accent
    accent: '#0095F6',
    accentHover: '#0081D6',
    
    // Cards & surfaces
    card: '#FFFFFF',
    modal: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
    
    // Inputs
    input: {
      background: '#F0F0F0',
      border: '#DBDBDB',
      text: '#262626',
      placeholder: '#8E8E93',
    },
    
    // Buttons
    button: {
      primary: '#0095F6',
      primaryText: '#FFFFFF',
      secondary: '#F0F0F0',
      secondaryText: '#262626',
      disabled: '#E0E0E0',
      disabledText: '#A0A0A0',
    },
  },

  // ========== DARK MODE ==========
  dark: {
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#121212',
    backgroundTertiary: '#1A1A1A',
    
    // Text
    text: '#FAFAFA',
    textSecondary: 'rgba(250,250,250,0.6)',
    textTertiary: 'rgba(250,250,250,0.4)',
    placeholder: 'rgba(250,250,250,0.5)',
    
    // Borders
    border: 'rgba(255,255,255,0.1)',
    borderSecondary: 'rgba(255,255,255,0.15)',
    
    // Primary accent (brighter for dark mode)
    accent: '#1DA1F2',
    accentHover: '#3DB5FF',
    
    // Cards & surfaces
    card: '#121212',
    modal: '#121212',
    overlay: 'rgba(0,0,0,0.8)',
    
    // Inputs
    input: {
      background: 'rgba(255,255,255,0.12)',
      border: 'rgba(255,255,255,0.15)',
      text: '#FAFAFA',
      placeholder: 'rgba(250,250,250,0.5)',
    },
    
    // Buttons
    button: {
      primary: '#1DA1F2',
      primaryText: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.12)',
      secondaryText: '#FAFAFA',
      disabled: 'rgba(255,255,255,0.08)',
      disabledText: 'rgba(250,250,250,0.3)',
    },
  },

  // ========== SEMANTIC COLORS (same for both modes) ==========
  semantic: {
    // Success (iOS Green)
    success: {
      light: '#34C759',
      dark: '#32D74B',
    },
    
    // Error (iOS Red)
    error: {
      light: '#FF3B30',
      dark: '#FF453A',
    },
    
    // Warning (iOS Orange)
    warning: {
      light: '#FF9500',
      dark: '#FF9F0A',
    },
    
    // Info
    info: {
      light: '#0095F6',
      dark: '#1DA1F2',
    },
  },

  // ========== FEATURE COLORS ==========
  features: {
    // Story gradient (Instagram-style)
    storyGradient: ['#F58529', '#FEDA77', '#DD2A7B', '#8134AF', '#515BD4'],
    
    // Online status
    online: '#34C759',
    offline: '#8E8E93',
    
    // Reactions
    like: '#FF3B30',
    love: '#FF3B30',
    
    // Action colors
    gallery: {
      light: '#0095F6',
      dark: '#1DA1F2',
      background: {
        light: 'rgba(0,149,246,0.12)',
        dark: 'rgba(29,161,242,0.2)',
      },
    },
    camera: {
      light: '#5856D6',
      dark: '#8B89F6',
      background: {
        light: 'rgba(88,86,214,0.12)',
        dark: 'rgba(88,86,214,0.2)',
      },
    },
  },

  // ========== COMPONENT-SPECIFIC ==========
  components: {
    segmentControl: {
      light: {
        background: '#F0F0F0',
        activeBackground: '#0095F6',
        inactiveText: '#8E8E93',
        activeText: '#FFFFFF',
        border: 'rgba(148,163,184,0.35)',
      },
      dark: {
        background: 'rgba(255,255,255,0.08)',
        activeBackground: 'rgba(29,161,242,0.28)',
        inactiveText: 'rgba(250,250,250,0.75)',
        activeText: '#FFFFFF',
        border: 'rgba(148,163,184,0.35)',
      },
    },
    
    chip: {
      light: {
        background: 'rgba(0,149,246,0.1)',
        border: 'rgba(0,149,246,0.2)',
      },
      dark: {
        background: 'rgba(29,161,242,0.15)',
        border: 'rgba(29,161,242,0.3)',
      },
    },
    
    searchBar: {
      light: {
        background: '#F0F0F0',
        border: '#DBDBDB',
        icon: '#8E8E93',
        text: '#262626',
      },
      dark: {
        background: 'rgba(255,255,255,0.1)',
        border: 'rgba(255,255,255,0.15)',
        icon: 'rgba(250,250,250,0.6)',
        text: '#FAFAFA',
      },
    },
  },
} as const

export type ThemeMode = 'light' | 'dark'
