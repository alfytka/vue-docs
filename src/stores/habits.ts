import { defineStore } from 'pinia';
import { useLocalStorage } from '../composables/useLocalStorage';
import type { Habit } from '../types/habit';
import { computed } from 'vue';

export const useHabitsStore = defineStore('habits', () => {
  const habits = useLocalStorage<Habit[]>('habits', [
    { id: '1', name: 'Baca buku 30 menit', completed: false, createdAt: new Date() },
    { id: '2', name: 'Olahraga pagi', completed: true, createdAt: new Date() },
  ]);

  // computed() = useMemo, otomatis re-calculate saat dependency (habits) berubah
  const completedCount = computed(() => {
    return habits.value.filter((h) => h.completed).length;
  });

  const totalCount = computed(() => habits.value.length);

  const completionRate = computed(() => {
    if (totalCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCount.value) * 100);
  })

  function addHabit(name: string) {
    if (name.trim() === '') return;
    habits.value.push({
      id: crypto.randomUUID(),
      name,
      completed: false,
      createdAt: new Date(),
    });
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

  return {
    habits,
    completedCount,
    totalCount,
    completionRate,
    addHabit,
    toggleHabit,
    deleteHabit,
  }
});
