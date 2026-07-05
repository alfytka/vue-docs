<script setup lang="ts">
import { computed } from 'vue';
import { useHabits } from '../composables/useHabits';

const { habits, completedCount, totalCount } = useHabits();

const completionRate = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
})
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Statistik</h1>

    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">Total Habit</span>
        <span class="text-lg font-semibold text-gray-800">{{ totalCount }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">Selesai</span>
        <span class="text-lg font-semibold text-green-600">{{ completedCount }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">Persentase</span>
        <span class="text-lg font-semibold text-indigo-600">{{ completionRate }}%</span>
      </div>

      <!-- Progress bar sederhana -->
      <div class="w-full bg-gray-100 rounded-full h-3 mt-2">
        <div
          class="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${completionRate}%` }"
        ></div>
      </div>
    </div>

    <p v-if="habits.length === 0" class="text-gray-400 text-sm text-center mt-6">
      Belum ada data. Tambahkan habit di halaman utama.
    </p>
  </div>
</template>