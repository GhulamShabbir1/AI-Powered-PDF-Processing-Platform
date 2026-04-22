// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  theme: {
  defaultTheme: 'dashboard',
    themes: {
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
        },
      },

      dark: {
        colors: {
          'primary': '#c3c0ff',
          'secondary': '#4cd7f6',
          'tertiary': '#d0bcff',
          'surface': '#0b1326',
          'on-surface': '#dae2fd',
          'surface-variant': '#2d3449',
          'surface-container': '#171f33',
          'surface-container-low': '#131b2e',
          'surface-container-highest': '#2d3449',
          'background': '#0b1326',
          'on-background': '#dae2fd',
          'error': '#FF3333',
          'on-error': '#690005',
          'accent': '#8B5CF6',
          'success': '#10B981',
          'warning': '#F59E0B',
        },
      },
      dashboard: {
        dark: true,
        colors: {
          'primary': '#c3c0ff',
          'secondary': '#4cd7f6',
          'tertiary': '#d0bcff',
          'surface': '#0b1326',
          'on-surface': '#dae2fd',
          'surface-variant': '#2d3449',
          'surface-container': '#171f33',
          'surface-container-low': '#131b2e',
          'surface-container-highest': '#2d3449',
          'background': '#0b1326',
          'on-background': '#dae2fd',
          'error': '#FF3333',
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
