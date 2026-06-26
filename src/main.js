import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import { motadataRum } from '@motadata365/browser-rum';

motadataRum.init({
  applicationId: '10',
  clientToken: 'pub1b132e64a6365a56d6cdcab415d9835a',
  site: 'http://172.16.15.68:9477',
  service: 'Test_App_Qa@1.0.1:qa',
  env: 'qa',
  version: '1.0.1',
  sessionSampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'allow',
  trackBfcacheViews: true,

  allowedTracingUrls: [
    {
      match: '',
      propagatorTypes: ['tracecontext']
    }
  ]
});

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')