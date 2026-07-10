<script setup lang="ts">
import { onMounted } from 'vue';
import HabitList from '../components/HabitList.vue';
import { useHabitsStore } from '../stores/habits.ts';

const store = useHabitsStore();

onMounted(() => {
  store.fetchHabits();
});
</script>

<template>
  <HabitList />
</template>