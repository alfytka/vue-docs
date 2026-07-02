<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Habit } from '../types/habit';
import HabitItem from './HabitItem.vue';

// ref() = setState di React, tapi diakses lewat .value di script (bukan di template)
const habits = ref<Habit[]>([
  { id: '1', name: 'Baca buku 30 menit', completed: false, createdAt: new Date() },
  { id: '2', name: 'Olahraga pagi', completed: true, createdAt: new Date() },
]);

// v-model butuh ref biasa untuk input text
const newHabitName = ref('');

// computed() = useMemo, otomatis re-calculate saat dependency (habits) berubah
const completedCount = computed(() => {
  return habits.value.filter((h) => h.completed).length;
});

const totalCount = computed(() => habits.value.length);

function addHabit() {
  // guard clause
  if (newHabitName.value.trim() === '') return;

  habits.value.push({
    id: crypto.randomUUID(),
    name: newHabitName.value,
    completed: false,
    createdAt: new Date(),
  });

  newHabitName.value = ''; // reset input
}

function toggleHabit(id: string) {
  const habit = habits.value.find((h) => h.id === id);
  if (habit) {
    habit.completed = !habit.completed;
    // Perhatikan: di React kamu HARUS bikin object/array baru untuk trigger re-render.
    // Di Vue, karena reactivity berbasis Proxy, mutasi langsung seperti ini
    // SUDAH otomatis trigger update UI. Ini beda besar dari React!
  }
}

function deleteHabit(id: string) {
  habits.value = habits.value.filter((h) => h.id !== id);
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Habit Tracker</h1>

    <p class="text-sm text-gray-500 mb-4">
      {{ completedCount }} dari {{ totalCount }} selesai
    </p>

    <!-- v-model = two-way binding, setara value + onChange digabung jadi satu -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="newHabitName"
        @keyup.enter="addHabit"
        type="text"
        placeholder="Tambah habit baru..."
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        @click="addHabit"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
      >
        Tambah
      </button>
    </div>

    <!-- v-if = conditional rendering, setara {condition && <div>} -->
    <p v-if="habits.length === 0" class="text-gray-400 text-sm text-center py-4">
      Belum ada habit. Tambahkan satu!
    </p>

    <!-- v-for = .map() di React, WAJIB pakai :key sama seperti React -->
    <ul v-else class="space-y-2">
      <HabitItem
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        @toggle="toggleHabit"
        @delete="deleteHabit"
      />
    </ul>
  </div>
</template>