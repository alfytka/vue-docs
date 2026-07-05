<script setup lang="ts">
import AppNav from './components/AppNav.vue';
</script>

<template>
  <main class="h-dvh bg-gray-50">
    <AppNav />
    <!-- RouterView = setara <Outlet /> di React Router, tempat halaman aktif dirender -->
    <RouterView />
  </main>
</template>