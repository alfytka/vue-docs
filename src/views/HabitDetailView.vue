<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useHabitsStore } from '../stores/habits';
import { computed } from 'vue';
import StreakBadge from '../components/StreakBadge.vue';
import HabitCalendar from '../components/HabitCalendar.vue';

// useRoute() = baca info rute AKTIF (params, query, path)
// Setara useParams() di React Router
const route = useRoute();

// useRouter() = untuk NAVIGASI programmatic (push, back, dst)
// Setara useNavigate() di React Router
const router = useRouter();

const store = useHabitsStore();

// route.params.id selalu bertipe string | string[], perlu di-cast
const habitId = route.params.id as string;

// computed supaya reaktif kalau habit di-update dari tempat lain
const habit = computed(() => store.getHabitById(habitId));

function goBack() {
  router.push('/'); // programmatic navigation, setara navigate('/')
}

function handleToggleToday() {
  if (habit.value) {
    store.toggleHabitOnDate(habit.value.id);
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <button @click="goBack" class="text-sm text-gray-400 hover:text-gray-600 mb-4">
      Kembali
    </button>

    <div v-if="habit">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-xl font-bold text-gray-800">{{ habit.name }}</h1>
        <StreakBadge :habit="habit" />
      </div>

      <p class="text-xs text-gray-400 mb-4">
        Dibuat {{ new Date(habit.createdAt).toLocaleDateString('id-ID') }}
      </p>

      <button
        @click="handleToggleToday"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition mb-6"
      >
        Tandai Selesai Hari Ini
      </button>

      <h2 class="text-sm font-medium text-gray-500 mb-2">Riwayat 12 Minggu Terakhir</h2>
      <HabitCalendar :habit="habit" :weeks="12" />
    </div>

    <p v-else class="text-gray-400 text-sm text-center py-8">
      Habit tidak ditemukan.
    </p>
  </div>
</template>