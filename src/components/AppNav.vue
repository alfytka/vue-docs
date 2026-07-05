<script setup lang="ts">
import { useTheme } from '../composables/useTheme';
// import { RouterLink } from 'vue-router';
// RouterLink auto-registered global oleh vue-router, tidak perlu import manual

// Tidak perlu props dari App.vue sama sekali — ini yang menghindari "prop drilling"
const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
    <div class="max-w-md mx-auto flex justify-between items-center">
      <div class="flex gap-4">
        <RouterLink
          to="/"
          class="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-600"
          active-class="text-indigo-600 font-semibold"
        >
          Habits
        </RouterLink>
        <RouterLink
          to="/stats"
          class="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-600"
          active-class="text-indigo-600 font-semibold"
        >
          Statistik
        </RouterLink>
        <RouterLink
          to="/focus"
          class="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-600"
          active-class="text-indigo-600 font-semibold"
        >
          Focus
        </RouterLink>
      </div>

      <button @click="toggleTheme" class="text-sm">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
  </nav>
</template>