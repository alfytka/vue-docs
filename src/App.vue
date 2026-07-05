<script setup lang="ts">
import AppNav from './components/AppNav.vue';
import { provideTheme } from './composables/useTheme.ts';

// Panggil sekali di sini — semua descendant component sekarang bisa akses lewat useTheme()
provideTheme();
</script>

<template>
  <main class="h-dvh bg-gray-50 dark:bg-gray-900 transition-colors">
    <AppNav />
    <!-- RouterView = setara <Outlet /> di React Router, tempat halaman aktif dirender -->
    <RouterView />
  </main>
</template>