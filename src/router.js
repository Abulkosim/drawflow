import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from './views/MainPage.vue';
import PageNotFound from './views/PageNotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: MainPage, meta: { title: 'Main Page' } },
  { path: '*', component: PageNotFound, meta: { title: 'Page Not Found' }  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Bot Platon'; 
});

export default router;
