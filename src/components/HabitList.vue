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

function handleAddHabit() {
  store.addHabit(newHabitName.value);
  newHabitName.value = ''; // reset input
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Habit Tracker</h1>

    <p class="text-sm text-gray-500 mb-4">
      {{ store.completedCount }} dari {{ store.totalCount }} selesai
    </p>

    <!-- v-model = two-way binding, setara value + onChange digabung jadi satu -->
    <div class="flex gap-2 mb-4">
      <input
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
    <ul v-else class="space-y-2">
      <HabitItem
        v-for="habit in store.habits"
        :key="habit.id"
        :habit="habit"
        @toggle="store.toggleHabit"
        @delete="store.deleteHabit"
      />
    </ul>
  </div>
</template>