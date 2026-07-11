<script setup lang="ts">
import AppNav from './components/AppNav.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
import { provideTheme } from './composables/useTheme.ts';

// Panggil sekali di sini — semua descendant component sekarang bisa akses lewat useTheme()
provideTheme();
</script>

<template>
  <main class="h-dvh bg-gray-50 dark:bg-gray-900 transition-colors">
    <AppNav />

    <ErrorBoundary>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
    
            <template #fallback>
              <div class="flex justify-center items-center py-20">
                <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            </template>
          </Suspense>
        </template>
      </RouterView>
    </ErrorBoundary>
  </main>
</template>