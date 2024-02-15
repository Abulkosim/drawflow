import Vue from 'vue';
import VueRouter from 'vue-router';
import PageNotFound from './components/PageNotFound.vue';
import App from './App.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'App', component: App },
  { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
