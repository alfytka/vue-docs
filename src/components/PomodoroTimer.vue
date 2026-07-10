<script setup lang="ts">
import { onMounted } from 'vue';
import { useTimer } from '../composables/useTimer';
import { onBeforeRouteLeave } from 'vue-router';

const {
  mode,
  isRunning,
  formattedTime,
  progress,
  start,
  pause,
  reset,
} = useTimer();

// onMounted = setara useEffect(() => {...}, []) — cuma jalan sekali saat komponen dipasang
// Kita minta izin notifikasi browser di sini
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

// onBeforeRouteLeave = guard ini yang didefinisikan LANGSUNG di komponent,
// jalan cuma saat komponen INI yang sedang aktif dan user coba navigasi keluar
// Setara: useBlocker() di React Router v6.4+, tapi jauh lebih ringkas syntax-nya
onBeforeRouteLeave((to, from) => {
  if (isRunning.value && mode.value === 'focus') {
    const confirmLeave = window.confirm(
      'Timer fokus masih berjalan. Yakin ingin menginggalkan halaman ini?'
    );
    // return false = BATALKAN navigasi, user tetap di halaman
    // return true / undefined = lanjutkan navigasi seperti biasa
    if (!confirmLeave) {
      return false;
    }
  }
  // Kalau timer tidak jalan, atau user konfirmasi "yakin", navigasi lanjut normal
});
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md text-center">
    <h1 class="text-2xl font-bold text-gray-800 mb-1">Focus Timer</h1>

    <p
      :class="[
        'text-sm font-medium mb-6',
        mode === 'focus' ? 'text-indigo-600' : 'text-green-600'
      ]"
    >
      {{ mode === 'focus' ? '🎯 Sesi Fokus' : '☕ Sesi Istirahat' }}
    </p>

    <div
      class="w-48 h-48 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500"
      :style="{
        background: `conic-gradient(${mode === 'focus' ? '#4f46e5' : '#16a34a'} ${progress}%, #e5e7eb ${progress}%)`,
      }"
    >
      <div class="w-40 h-40 bg-white rounded-full flex items-center justify-center">
        <span class="text-4xl font-mono font-bold text-gray-800">
          {{ formattedTime }}
        </span>
      </div>
    </div>

    <div class="flex justify-center gap-3">
      <button
        v-if="!isRunning"
        @click="start"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
      >
        Mulai
      </button>
      <button
        v-else
        @click="pause"
        class="bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
      >
        Jeda
      </button>

      <button
        @click="reset"
        class="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
      >
        Reset
      </button>
    </div>
  </div>
</template>