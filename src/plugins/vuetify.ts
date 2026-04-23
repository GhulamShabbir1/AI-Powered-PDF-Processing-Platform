import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'light',

    themes: {
      /* =========================
         LIGHT THEME
      ========================= */
      light: {
        colors: {
          primary: '#4F46E5',
          secondary: '#06B6D4',
          accent: '#8B5CF6',

          success: '#10B981',
          warning: '#F59E0B',
          error: '#B30000',

          background: '#F9FAFB',
          surface: '#FFFFFF',

          /* important missing ones */
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-surface': '#111827',
          'on-background': '#111827',
        },
      },

      /* =========================
         DARK THEME (CLEANED)
      ========================= */
      dark: {
        colors: {
          primary: '#4F46E5',
          secondary: '#06B6D4',
          accent: '#8B5CF6',

          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',

          background: '#0F172A',
          surface: '#1E293B',

          'surface-variant': '#2D3449',
          'surface-container': '#171F33',

          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-surface': '#E2E8F0',
          'on-background': '#E2E8F0',
        },
      },
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})