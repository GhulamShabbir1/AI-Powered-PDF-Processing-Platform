import { createApp } from 'vue'
import App from './App.vue'

// ✅ MUST be first
import 'vuetify/styles'

// Your CSS
import './style.css'
import './assets/styles/variables.css'
import './assets/styles/main.css'

// Plugins
import vuetify from './plugins/vuetify'
import router from './router'
import pinia from './plugins/pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(pinia)
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})


app.mount('#app')