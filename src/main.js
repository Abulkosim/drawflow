import Vue from 'vue'
import VeeValidate, { ValidationObserver, ValidationProvider } from 'vee-validate';

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

import App from './App.vue'

import './assets/main.css'

Vue.use(VeeValidate);

new Vue({
  render: (h) => h(App)
}).$mount('#app')