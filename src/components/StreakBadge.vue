<script setup lang="ts">
import { computed } from 'vue';
import { useHabitsStore } from '../stores/habits';
import type { Habit } from '../types/habit';

const props = defineProps<{ habit: Habit }>();
const store = useHabitsStore();

const streak = computed(() => store.getCurrentStreak(props.habit));
</script>

<template>
  <span
    v-if="streak > 0"
    class="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full"
  >
    🔥 {{ streak }} hari
  </span>
</template>