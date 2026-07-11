<script setup lang="ts">
import { computed, watch } from 'vue';
import { habitSchema, type HabitFormValues } from '../schemas/habitSchema';
import { CATEGORY_LABELS, type Habit } from '../types/habit';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  show: boolean;
  habit?: Habit | null; // kalau ada = mode edit, kalau null/undefined = mode tambah
}>();

const emit = defineEmits<{
  close: [];
  submit: [values: HabitFormValues];
}>();

const isEditMode = computed(() => !!props.habit);

// useForm = inti dari VeeValidate, setara useForm() di React Hook Form
// toTypedSchema mengonversi Zod schema jadi format yang VeeValidate mengerti, plus type-safe
const { defineField, handleSubmit, errors, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(habitSchema),
});

// defineField = bind satu field form ke input, return [modelValue, inputProps]
// inputProps otomatis handle event blur untuk validasi real-time
const [name, nameAttrs] = defineField('name');
const [category, categoryAttrs] = defineField('category');

// watch props.show - setiap modal dibuka, isi form sesuai mode (edit = prefill, tambah = kosong)
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: props.habit
          ? { name: props.habit.name, category: props.habit.category }
          : { name: '', category: undefined as never },
      })
    }
  }
);

// handleSubmit wajib dari VeeValidate - otomatis jalankan validasi Zod dulu,
// callback di dalam hanya dipanggil kalau semua field valid
const onSubmit = handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-800">
        {{ isEditMode ? 'Edit Habit' : 'Tambah Habit Baru' }}
      </h2>
    </template>

    <form @submit="onSubmit" class="space-y-4">
      <div>
        <label class="text-xs text-gray-500 mb-1 block">Nama Habit</label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          :class="{ 'border-red-400': errors.name }"
        />
        <!-- errors.name otomatis terisi pesan dari Zod schema kalau tidak valid -->
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="text-xs text-gray-500 mb-1 block">Kategori</label>
        <select
          v-model="category"
          v-bind="categoryAttrs"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          :class="{ 'border-red-400': errors.category }"
        >
          <option :value="undefined" disabled>Pilih kategori...</option>
          <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">
            {{ label }}
          </option>
        </select>
        <p v-if="errors.category" class="text-xs text-red-500 mt-1">{{ errors.category }}</p>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="emit('close')"
        class="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        Batal
      </button>
      <button
        type="submit"
        @click="onSubmit"
        :disabled="isSubmitting"
        class="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </template>
  </BaseModal>
</template>