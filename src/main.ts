import { createApp } from 'vue'
import App from './App.vue'

// CSS Imports
import './style.css'
import './assets/styles/variables.css'
import './assets/styles/main.css'

// Plugins
import vuetify from './plugins/vuetify'
import router from './router'
import pinia from './plugins/pinia'

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')
