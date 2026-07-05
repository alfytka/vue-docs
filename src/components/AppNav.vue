<script setup lang="ts">
// import { RouterLink } from 'vue-router';
// RouterLink auto-registered global oleh vue-router, tidak perlu import manual
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="max-w-md mx-auto flex gap-4">
      <RouterLink
        to="/"
        class="text-sm font-medium text-gray-500 hover:text-indigo-600"
        active-class="text-indigo-600 font-semibold"
      >
        Habits
      </RouterLink>
      <RouterLink
        to="/stats"
        class="text-sm font-medium text-gray-500 hover:text-indigo-600"
        active-class="text-indigo-600 font-semibold"
      >
        Statistik
      </RouterLink>
    </div>
  </nav>
</template>