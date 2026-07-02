<script setup lang="ts">
import type { Habit } from '../types/habit';

// defineProps = setara props di React function component
// Ini compiler macro khusus Vue, TIDAK PERLU di-import
const props = defineProps<{
  habit: Habit
}>();

// defineEmits = deklarasi event yang bisa di-"pancarkan" ke parent
// Setara dengan callback props (onToggle, onDelete) di React,
// tapi di Vue polanya event-based, bukan function passing
const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>();

function handleToggle() {
  emit('toggle', props.habit.id);
}

function handleDelete() {
  emit('delete', props.habit.id);
}
</script>

<template>
  <li class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
    <div class="flex items-center gap-3">
      <input
        type="checkbox"
        :checked="habit.completed"
        @change="handleToggle"
        class="w-4 h-4 accent-indigo-600"
      />
      <!-- :class binding kondisional, mirip clsx/classnames di React -->
      <span
      :class="[
        'text-sm',
        habit.completed ? 'line-through text-gray-400' : 'text-gray-700',
      ]"
      >
      {{ habit.name }}
      </span>
    </div>

    <button
      @click="handleDelete"
      class="text-red-400 hover:text-red-600 text-xs font-medium"
    >
      Hapus
    </button>
  </li>
</template>