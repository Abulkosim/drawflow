import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from './views/MainPage.vue';
import PageNotFound from './views/PageNotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: MainPage },
  { path: '*', component: PageNotFound }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});
export default router;
