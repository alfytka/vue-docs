import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'
import { createPinia } from 'pinia'
import { vFocus } from './directives/vFocus.ts'

createApp(App)
  .directive('focus', vFocus) // daftarkan sebagai "focus", dipakai sebagai v-focus di template
  .use(createPinia()) // Harus dipasang SEBELUM router kalau ada dependency, urutan aman: pinia dulu
  .use(router)
  .mount('#app')
