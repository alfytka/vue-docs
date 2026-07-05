import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StatsView from '../views/StatsView.vue';
import FocusView from '../views/FocusView.vue';

const router = createRouter({
  // createWebHistory = pakai clean URL (/stats, bukan /#/stats)
  // Setara "browser router" di react-router-dom
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/focus',
      name: 'focus',
      component: FocusView,
    },
  ]
});

export default router;
