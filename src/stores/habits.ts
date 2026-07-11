import { defineStore } from 'pinia';
import { useLocalStorage } from '../composables/useLocalStorage';
import { toDateKey, type Habit } from '../types/habit';
import { computed, ref } from 'vue';

const API_URL = 'http://localhost:3001/habits';

// menggunakan API Call
export const useHabitsStore = defineStore('habits', () => {
  const habits = ref<Habit[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // AbortController disimpan di luar reactive state — sama seperti intervalId di useTimer,
  // ini bukan data untuk UI, cuma mekanisme internal untuk cancel request
  let abortController: AbortController | null = null;

  const totalCount = computed(() => habits.value.length);
  const completedCount = computed(() => {
    const today = toDateKey(new Date());
    return habits.value.filter((h) => h.completedDates.includes(today)).length;
  });

  const completionRate = computed(() => {
    if (totalCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCount.value) * 100);
  });

  // fetchHabits = ganti total peran useLocalStorage, dipanggil saat komponen mount
  async function fetchHabits() {
    // Kalau ada request sebelumnya yang belum selesai, batalkan dulu (race condition guard)
    abortController?.abort();
    abortController = new AbortController();

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(API_URL, { signal: abortController.signal });
      if (!response.ok) {
        throw new Error('Gagal memuat data habit');
      }
      habits.value = await response.json();
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        error.value = err.message;
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function addHabit(name: string) {
    if (name.trim() === '') return;

    const newHabit: Omit<Habit, 'id'> = {
      name,
      category: 'productivity',
      completedDates: [],
      createdAt: new Date(),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit),
      });
      if (!response.ok) throw new Error('Gagal menambahkan habit');

      const created = (await response.json()) as Habit;
      habits.value.push(created);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal menambah habit';
    }
  }

  async function toggleHabitOnDate(id: string, date: Date = new Date()) {
    const habit = habits.value.find((h) => h.id === id);
    if (!habit) return;

    const dateKey = toDateKey(date);
    const index = habit.completedDates.indexOf(dateKey);

    // Optimistic update: ubah UI DULUAN, baru sync ke server di belakang layar
    // Ini pola umum di app production supaya terasa instan, bukan nunggu network
    const previousDates = [...habit.completedDates];
    if (index === -1) {
      habit.completedDates.push(dateKey);
    } else {
      habit.completedDates.splice(index, 1);
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDates: habit.completedDates }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan perubahan');
    } catch (err) {
      // Rollback kalau request gagal - kembalikan ke state sebelum optimistic update
      habit.completedDates = previousDates;
      error.value = err instanceof Error ? err.message : 'Gagal menyimpan perubahan';
    }
  }

  async function deleteHabit(id: string) {
    const previousHabits = [...habits.value];
    habits.value = habits.value.filter((h) => h.id !== id); // optimistic

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus habit');
    } catch (err) {
      habits.value = previousHabits; // rollback
      error.value = err instanceof Error ? err.message : 'Gagal menghapus habit';
    }
  }

  function isCompletedOnDate(habit: Habit, date: Date): boolean {
    return habit.completedDates.includes(toDateKey(date));
  }

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
    isLoading,
    error,
    totalCount,
    completedCount,
    completionRate,
    fetchHabits,
    addHabit,
    toggleHabitOnDate,
    isCompletedOnDate,
    deleteHabit,
    getCurrentStreak,
    getHabitById,
  }
});

// tidak menggunakan (masih menggunakan localstorage)
export const useHabitsStoreOld = defineStore('habits', () => {
  const habits = useLocalStorage<Habit[]>('habits', [
    {
      id: '1',
      name: 'Baca buku 30 menit',
      category: 'productivity',
      completedDates: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Olahraga pagi',
      category: 'health',
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
      category: 'health',
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
