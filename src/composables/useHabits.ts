import { computed } from 'vue';
import { toDateKey, type Habit } from '../types/habit';
import { useLocalStorage } from './useLocalStorage';

// sudah tidak digunakan, fungsi ini dipindah ke stores (pinia)
export function useHabits() {
  // a) Before:
  // const habits = ref<Habit[]>([
  //   { id: '1', name: 'Baca buku 30 menit', completed: false, createdAt: new Date() },
  //   { id: '2', name: 'Olahraga pagi', completed: true, createdAt: new Date() },
  // ]);
  // b) After: Ganti ref() jadi useLocalStorage(), sisanya TIDAK BERUBAH SAMA SEKALI
  const habits = useLocalStorage<Habit[]>('habits', [
    { id: '1',
      name: 'Baca buku 30 menit',
      category: 'productivity',
      completedDates: [],
      createdAt: new Date()
    },
    { id: '2',
      name: 'Olahraga pagi',
      category: 'health',
      completedDates: [toDateKey(new Date())],
      createdAt: new Date()
    },
  ]);

  // computed() = useMemo, otomatis re-calculate saat dependency (habits) berubah
  const completedCount = computed(() => {
    const today = toDateKey(new Date());
    return habits.value.filter((h) => h.completedDates.includes(today)).length;
  });

  const totalCount = computed(() => habits.value.length);

  function addHabit(name: string) {
    if (name.trim() === '') return;
    habits.value.push({
      id: crypto.randomUUID(),
      name,
      category: 'productivity',
      completedDates: [],
      createdAt: new Date(),
    });
  }

  // function toggleHabit(id: string) {
  //   const habit = habits.value.find((h) => h.id === id);
  //   if (habit) {
  //     habit.completed = !habit.completed;
  //     // Perhatikan: di React kamu HARUS bikin object/array baru untuk trigger re-render.
  //     // Di Vue, karena reactivity berbasis Proxy, mutasi langsung seperti ini
  //     // SUDAH otomatis trigger update UI. Ini beda besar dari React!
  //   }
  // }

  function deleteHabit(id: string) {
    habits.value = habits.value.filter((h) => h.id !== id);
  }

  return {
    habits,
    completedCount,
    totalCount,
    addHabit,
    // toggleHabit,
    deleteHabit,
  }
}
