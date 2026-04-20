import { createApp } from 'vue'
import App from './App.vue'

// CSS Imports
import './style.css'
import './assets/styles/variables.css'
import './assets/styles/main.css'

// Plugins (Router aur Vuetify)
import router from './router'
import vuetify from './plugins/vuetify' // Ensure karein ke plugins folder mein vuetify.ts maujood hai

const app = createApp(App)

app.use(router)   // Router ko enable karein
app.use(vuetify)  // Vuetify ko enable karein

app.mount('#app')