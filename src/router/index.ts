import { createRouter, createWebHistory } from 'vue-router';
import { useHabitsStore } from '../stores/habits.ts';
// without dynamic import
// import HomeView from '../views/HomeView.vue';
// import StatsView from '../views/StatsView.vue';
// import FocusView from '../views/FocusView.vue';
// import HabitDetailView from '../views/HabitDetailView.vue';

const router = createRouter({
  // createWebHistory = pakai clean URL (/stats, bukan /#/stats)
  // Setara "browser router" di react-router-dom
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // Function yang return import() dinamis, Vue Router otomatis handle sisanya
      // Ini setara React.lazy(() => import('./HomeView'))
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Habit Tracker' }, // meta = data custom per-rute, bisa apa saja
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { title: 'Statistik' },
    },
    {
      path: '/focus',
      name: 'focus',
      component: () => import('../views/FocusView.vue'),
      meta: { title: 'Focus Timer' },
    },
    {
      path: '/habit/:id',
      name: 'habit-detail',
      component: () => import('../views/HabitDetailView.vue'),
      meta: { title: 'Detail Habit' },
      // beforeEnter = guard KHUSUS rute ini saja, tidak jalan di rute lain
      beforeEnter: (to) => {
        // Guard butuh akses store, tapi store butuh pinia aktif -
        // panggil useHabitsStore() DI DALAM function guard (bukan di top-level file),
        // supaya dipanggil setelah Pinia ter-install
        const store = useHabitsStore();
        const habitId = to.params.id as string;
        const habitExists = store.getHabitById(habitId);

        if (!habitExists) {
          // Return object = redirect ke rute lain, sekaligus BATALKAN navigasi asli
          return { name: 'home' };
        }
        // Tidak return apapun = lanjutkan ke habit-detail seperti biasa
      }
    },
  ]
});

// beforeEach = dipanggil SETIAP kali navigasi terjadi, sebelum rute baru benar-benar dimasuki
// Parameter: 'to' (rute tujuan), 'from' (rute asal)
// Return value: true/undefined = lanjutkan, false = batalkan, string/object = redirect
router.beforeEach((to, from) => {
  // Update judul tab browser berdasarkan meta rute
  document.title = (to.meta.title as string) ?? 'Habit Tracker';
});

// afterEach = dipanggil SETELAH navigasi selesai — cocok untuk side effect yang tidak perlu blocking
router.afterEach(() => {
  window.scrollTo(0, 0); // scroll ke atas tiap pindah halaman
});

export default router;
