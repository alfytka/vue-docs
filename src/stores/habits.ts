import { defineStore } from 'pinia';
import { useLocalStorage } from '../composables/useLocalStorage';
import { toDateKey, type Habit } from '../types/habit';
import { computed } from 'vue';

export const useHabitsStore = defineStore('habits', () => {
  const habits = useLocalStorage<Habit[]>('habits', [
    {
      id: '1',
      name: 'Baca buku 30 menit',
      completedDates: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Olahraga pagi',
      completedDates: [toDateKey(new Date())],
      createdAt: new Date(),
    },
  ]);

  const totalCount = computed(() => habits.value.length);

  // computed() = useMemo, otomatis re-calculate saat dependency (habits) berubah
  // completedCount sekarang berarti "selesai HARI INI", bukan status permanen
  const completedCount = computed(() => {
    const today = toDateKey(new Date());
    return habits.value.filter((h) => h.completedDates.includes(today)).length;
  });

  const completionRate = computed(() => {
    if (totalCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCount.value) * 100);
  })

  function addHabit(name: string) {
    if (name.trim() === '') return;
    habits.value.push({
      id: crypto.randomUUID(),
      name,
      completedDates: [],
      createdAt: new Date(),
    });
  }

  // Toggle untuk TANGGAL TERTENTU, default hari ini
  function toggleHabitOnDate(id: string, date: Date = new Date()) {
    const habit = habits.value.find((h) => h.id === id);
    if (!habit) return;

    const dateKey = toDateKey(date);
    const index = habit.completedDates.indexOf(dateKey);

    if (index === -1) {
      habit.completedDates.push(dateKey);
    } else {
      habit.completedDates.splice(index, 1);
    }
  }

  // function toggleHabit(id: string) {
  //   const habit = habits.value.find((h) => h.id === id);
  //   if (habit) {
  //     // habit.completed = !habit.completed;
  //     // Perhatikan: di React kamu HARUS bikin object/array baru untuk trigger re-render.
  //     // Di Vue, karena reactivity berbasis Proxy, mutasi langsung seperti ini
  //     // SUDAH otomatis trigger update UI. Ini beda besar dari React!
  //   }
  // }

  function isCompletedOnDate(habit: Habit, date: Date): boolean {
    return habit.completedDates.includes(toDateKey(date));
  }

  function deleteHabit(id: string) {
    habits.value = habits.value.filter((h) => h.id !== id);
  }

  // Hitung current streak: mundur dari hari ini, berhenti begitu ada hari yang bolong
  function getCurrentStreak(habit: Habit): number {
    let streak = 0;
    const cursor = new Date();

    while (true) {
      const key = toDateKey(cursor);
      if (habit.completedDates.includes(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1); // mundur 1 hari
      } else {
        // Kalau hari ini belum dicentang tapi baru mulai cek (streak masih 0), skip dulu
        // supaya "hari ini belum sempat centang" tidak langsung motong streak dari kemarin
        if (streak === 0 && toDateKey(cursor) === toDateKey(new Date())) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  }

  function getHabitById(id: string): Habit | undefined {
    return habits.value.find((h) => h.id === id);
  }

  return {
    habits,
    totalCount,
    completedCount,
    completionRate,
    addHabit,
    // toggleHabit,
    toggleHabitOnDate,
    isCompletedOnDate,
    deleteHabit,
    getCurrentStreak,
    getHabitById,
  }
});
