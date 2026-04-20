import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Icons ke liye zaroori hai

export const theme = {
  defaultTheme: "light",
  themes: {
    light: {
      colors: {
        primary: "#4F46E5",
        secondary: "#06B6D4",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
};

// Yahan Vuetify instance create karein
const vuetify = createVuetify({
  components,
  directives,
  theme,
})

export default vuetify