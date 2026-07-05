<script setup lang="ts">
import { ref } from 'vue';
import type { Habit } from '../types/habit';
import BaseModal from './BaseModal.vue';

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

const showConfirm = ref(false);

// Type-nya diambil dari instance komponen, InstanceType<typeof BaseModal>
// const modalRef = ref<InstanceType<typeof BaseModal> | null>(null);

function handleToggle() {
  emit('toggle', props.habit.id);
}

function confirmDelete() {
  emit('delete', props.habit.id);
  showConfirm.value = false;
}

// contoh penggunaan
// function handleEmergencyClose() {
//   modalRef.value?.forceClose();
// }
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
      @click="showConfirm = true"
      class="text-red-400 hover:text-red-600 text-xs font-medium"
    >
      Hapus
    </button>

    <BaseModal :show="showConfirm" @close="showConfirm = false">
      <template #header>
        <h2 class="text-lg font-semibold text-red-600">Hapus Habit?</h2>
      </template>

      Apakah kamu yakin ingin menghapus "<strong>{{ habit.name }}</strong>"? Tindakan ini tidak bisa dibatalkan.

      <template #footer>
        <button @click="showConfirm = false" class="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
          Batal
        </button>
        <button @click="confirmDelete" class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">
          Ya, Hapus
        </button>
      </template>
    </BaseModal>
  </li>
</template>