<script setup lang="ts">
import { ref } from 'vue';
import HabitItem from './HabitItem.vue';
import { useHabitsStore } from '../stores/habits.ts';

// cukup ganti nama import & function call, sisanya identik
const store = useHabitsStore();

// v-model butuh ref biasa untuk input text
// State lokal untuk input tetap di komponen, bukan di composable
// (karena ini murni UI state, bukan business logic)
const newHabitName = ref('');

// Template ref: nama variable HARUS SAMA PERSIS dengan atribut ref="..." di template
// Vue otomatis mengisi ref ini dengan elemen DOM asli setelah komponen ter-mount
// const inputRef = ref<HTMLInputElement | null>(null);

function handleAddHabit() {
  store.addHabit(newHabitName.value);
  newHabitName.value = ''; // reset input
  // Setelah nambah habit, fokus balik ke input — pengalaman UX yang lebih baik
  // inputRef.value?.focus();
}

// onMounted = pastikan DOM sudah benar-benar ada sebelum kita akses .focus()
// Ini WAJIB — kalau dipanggil sebelum mounted, inputRef.value masih null
// Tidak perlu lagi inputRef, onMounted, ataupun manual .focus()!
// onMounted(() => {
//   inputRef.value?.focus();
// });
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Habit Tracker</h1>

    <!-- Error banner, muncul kalau ada error dari operasi apapun -->
    <div v-if="store.error" class="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
      ⚠️ {{ store.error }}
    </div>

    <p class="text-sm text-gray-500 mb-4">
      {{ store.completedCount }} dari {{ store.totalCount }} selesai
    </p>

    <!-- v-model = two-way binding, setara value + onChange digabung jadi satu -->
    <div class="flex gap-2 mb-4">
      <input
        v-focus
        v-model="newHabitName"
        @keyup.enter="handleAddHabit"
        type="text"
        placeholder="Tambah habit baru..."
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        @click="handleAddHabit"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
      >
        Tambah
      </button>
    </div>

    <!-- v-if = conditional rendering, setara {condition && <div>} -->
    <p v-if="store.habits.length === 0" class="text-gray-400 text-sm text-center py-4">
      Belum ada habit. Tambahkan satu!
    </p>

    <!-- v-for = .map() di React, WAJIB pakai :key sama seperti React -->
    <!-- Ganti <ul v-else> jadi <TransitionGroup>, tag="ul" bikin Vue render sebagai <ul> -->
    <TransitionGroup v-if="store.habits.length > 0" tag="ul" name="habit-item" class="space-y-2">
      <HabitItem
        v-for="habit in store.habits"
        :key="habit.id"
        :habit="habit"
        @toggle="store.toggleHabitOnDate"
        @delete="store.deleteHabit"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.habit-item-enter-active,
.habit-item-leave-active {
  transition: all 0.3s ease;
}
.habit-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.habit-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
/* Ini KHUSUS TransitionGroup: animasi smooth saat item lain "geser posisi" */
.habit-item-leave-active {
  position: absolute;
}
.habit-item-move {
  transition: transform 0.3s ease;
}
</style>