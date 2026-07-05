import type { Directive } from "vue";

type ClickOutsideHandler = (event: MouseEvent) => void;

// Extend HTMLElement supaya kita bisa "nempel" handler ke element,
// perlu ini karena kita harus simpan reference function untuk di-cleanup nanti
interface ClickOutsideElement extends HTMLElement {
  _clickOutsideHandler?: (event: MouseEvent) => void;
}

export const vClickOutside: Directive<ClickOutsideElement, ClickOutsideHandler> = {
  mounted(el, binding) {
    const handler = (event: MouseEvent) => {
      // Kalau klik terjadi DI LUAR elemen ini, panggil function yang di-pass
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    }
    el._clickOutsideHandler = handler;
    document.addEventListener('click', handler);
  },
  // unmounted = SANGAT PENTING, cleanup listener supaya tidak memory leak
  // Setara return () => document.removeEventListener(...) di useEffect
  unmounted(el) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler);
    }
  }
}