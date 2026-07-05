<script setup lang="ts">
import { Teleport } from 'vue';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

function forceClose() {
  emit('close');
}

// defineExpose WAJIB kalau pakai <script setup>
// Karena secara default, <script setup> menyembunyikan SEMUA internal dari parent
// (beda dari Options API yang otomatis expose semua)
// Expose function dari child ke parent
defineExpose({
  forceClose,
});
</script>

<template>
  <!-- Teleport = render elemen ini di luar hierarki DOM parent (langsung ke <body>) -->
  <!-- Penting untuk modal, supaya tidak kena masalah overflow/z-index dari parent -->
  <Teleport to="body">
    <!-- name="modal" -> prefix class animasi jadi modal-enter-from, dst -->
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="emit('close')"
      >
        <div class="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6">
          <!-- Named slot "header" — kalau parent tidak isi, fallback ke konten default -->
          <div class="mb-4">
            <slot name="header">
              <h2 class="text-lg font-semibold text-gray-800">Konfirmasi</h2>
            </slot>
          </div>
  
          <!-- Default slot — konten utama, WAJIB diisi parent -->
          <div class="text-sm text-gray-600 mb-6">
            <slot />
          </div>
  
          <!-- Named slot "footer" — parent punya kendali penuh atas tombol aksi -->
          <div class="flex justify-end gap-2">
            <slot name="footer">
              <button
                @click="emit('close')"
                class="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Tutup
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transisi masuk & keluar untuk overlay */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animasi scale untuk card di dalamnya */
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.25s ease;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>