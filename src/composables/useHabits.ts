import { computed } from 'vue';
import type { Habit } from '../types/habit';
import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  // a) Before:
  // const habits = ref<Habit[]>([
  //   { id: '1', name: 'Baca buku 30 menit', completed: false, createdAt: new Date() },
  //   { id: '2', name: 'Olahraga pagi', completed: true, createdAt: new Date() },
  // ]);
  // b) After: Ganti ref() jadi useLocalStorage(), sisanya TIDAK BERUBAH SAMA SEKALI
  const habits = useLocalStorage<Habit[]>('habits', [
    { id: '1', name: 'Baca buku 30 menit', completed: false, createdAt: new Date() },
    { id: '2', name: 'Olahraga pagi', completed: true, createdAt: new Date() },
  ]);

  // computed() = useMemo, otomatis re-calculate saat dependency (habits) berubah
  const completedCount = computed(() => {
    return habits.value.filter((h) => h.completed).length;
  });

  const totalCount = computed(() => habits.value.length);

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
    addHabit,
    toggleHabit,
    deleteHabit,
  }
}
