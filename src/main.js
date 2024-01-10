import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import VeeValidate, { ValidationObserver, ValidationProvider } from 'vee-validate';

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

import App from './App.vue'

import './assets/main.css'

Vue.use(VeeValidate);
Vue.use(PiniaVuePlugin)

new Vue({
  pinia: createPinia(),
  render: (h) => h(App)
}).$mount('#app')