import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'
import { createPinia } from 'pinia'
import { vFocus } from './directives/vFocus.ts'

const app = createApp(App);

// config.errorHandler = penangkap PALING GLOBAL, dipanggil kalau error lolos dari SEMUA onErrorCaptured
// Cocok untuk logging ke service eksternal (Sentry, dsb), bukan untuk UI recovery
app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error Handler]', err, info);
};

app.directive('focus', vFocus) // daftarkan sebagai "focus", dipakai sebagai v-focus di template
  .use(createPinia()) // Harus dipasang SEBELUM router kalau ada dependency, urutan aman: pinia dulu
  .use(router)
  .mount('#app')
