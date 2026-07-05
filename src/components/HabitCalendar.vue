<script setup lang="ts">
import { computed } from 'vue';
import { toDateKey, type Habit } from '../types/habit';

const props = defineProps<{
  habit: Habit;
  weeks?: number; // berapa minggu ke belakang ditampilkan, default 12
}>();

// withDefaults = cara Vue kasih default value untuk props optional di TypeScript
const weeksToShow = props.weeks ?? 12;

interface DayCell {
  date: Date;
  dateKey: string;
  completed: boolean;
  isToday: boolean;
}

// computed yang generate grid tanggal — auto re-calculate kalau habit.completedDates berubah
const calendarGrid = computed<DayCell[][]>(() => {
  const today = new Date();
  const totalDays = weeksToShow * 7;
  const days: DayCell[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = toDateKey(date);

    days.push({
      date,
      dateKey,
      completed: props.habit.completedDates.includes(dateKey),
      isToday: dateKey === toDateKey(today),
    });
  }

  // Kelompokkan jadi array per minggu (7 hari), untuk grid kolom seperti GitHub
  const weeksGrid: DayCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeksGrid.push(days.slice(i, i + 7));
  }
  return weeksGrid;
})
</script>

<template>
  <div class="flex gap-1 overflow-x-auto pb-2">
    <div v-for="(week, wIndex) in calendarGrid" :key="wIndex" class="flex flex-col gap-1">
      <div
        v-for="day in week"
        :key="day.dateKey"
        :title="day.dateKey"
        :class="[
          'w-3.5 h-3.5 rounded-sm transition-colors',
          day.completed ? 'bg-indigo-500' : 'bg-gray-100',
          day.isToday ? 'ring-2 ring-indigo-300' : '',
        ]"
      />
    </div>
  </div>
</template>