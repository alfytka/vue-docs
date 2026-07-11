import { computed, reactive } from 'vue';
import type { Habit, HabitCategory } from '../types/habit';

interface FilterState {
  search: string;
  category: HabitCategory | 'all';
  sortBy: 'name' | 'streak' | 'newest';
}

export function useHabitFilters(
  habits: () => Habit[],
  getStreak: (habit: Habit) => number,
) {
  // reactive() cocok di sini: filters SELALU diakses sebagai satu kesatuan,
  // tidak pernah di-destructure lepas ke variable terpisah
  const filters = reactive<FilterState>({
    search: '',
    category: 'all',
    sortBy: 'newest',
  });

  function resetFilters() {
    // Ini KEUNTUNGAN reactive() dibanding banyak ref() terpisah:
    // reset semua field sekaligus dengan Object.assign, tanpa reassign seluruh object
    Object.assign(filters, { search: '', category: 'all', sortBy: 'newest' });
  }

  const filteredHabits = computed(() => {
    let result = habits();

    // Filter berdasarkan search text
    if (filters.search.trim() !== '') {
      const query = filters.search.toLowerCase();
      result = result.filter((h) => h.name.toLowerCase().includes(query));
    }

    // Filter berdasarkan kategori
    if (filters.category !== 'all') {
      result = result.filter((h) => h.category === filters.category);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'streak') {
        return getStreak(b) - getStreak(a);
      }
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  });

  return {
    filters, // return object reactive() itu sendiri, bukan di-destructure
    filteredHabits,
    resetFilters,
  }
}