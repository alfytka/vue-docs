<script setup lang="ts">
import { CATEGORY_LABELS, type HabitCategory } from '../types/habit';

// defineModel adalah fitur Vue 3.4+ untuk two-way binding custom component,
// menggantikan pola lama (props + emit('update:modelValue')) jadi SATU baris
const filters = defineModel<{
  search: string;
  category: HabitCategory | 'all';
  sortBy: 'name' | 'streak' | 'newest';
}>({ required: true });

const categories: (HabitCategory | 'all')[] = ['all', 'health', 'productivity', 'mindfulness', 'social'];
</script>

<template>
  <div class="space-y-3 mb-4">
    <input
      v-model="filters.search"
      type="text"
      placeholder="Cari habit..."
      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="filters.category = cat"
        :class="[
          'text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition',
          filters.category === cat
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        ]"
      >
        {{ cat === 'all' ? 'Semua' : CATEGORY_LABELS[cat] }}
      </button>
    </div>

    <select
      v-model="filters.sortBy"
      class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600"
    >
      <option value="newest">Terbaru</option>
      <option value="name">Nama (A-Z)</option>
      <option value="streak">Streak Tertinggi</option>
    </select>
  </div>
</template>