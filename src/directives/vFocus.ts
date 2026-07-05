import type { Directive } from 'vue';

// Directive = object dengan "hooks" siklus hidup, mirip lifecycle tapi levelnya DOM element
export const vFocus: Directive<HTMLElement> = {
  // mounted = dipanggil sekali saat elemen ini pertama kali masuk DOM
  // Setara: onMounted(() => el.focus()), tapi di-encapsulate jadi reusable
  mounted(el) {
    el.focus();
  }
}