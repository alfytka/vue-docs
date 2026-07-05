import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';

// InjectionKey = TypeScript trick supaya inject() type-safe,
// tanpa ini, inject() akan return unknown/any
interface ThemeContext {
  isDark: Ref<boolean>;
  toggleTheme: () => void;
}

const themeKey: InjectionKey<ThemeContext> = Symbol('theme');

// Dipanggil SEKALI di komponen root/tinggi (App.vue) — mirip <ThemeProvider> di React
export function provideTheme() {
  const isDark = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
  }

  provide(themeKey, { isDark, toggleTheme });
}

// Dipanggil di KOMPONEN MANAPUN yang butuh akses tema — mirip useContext(ThemeContext)
export function useTheme(): ThemeContext {
  const context = inject(themeKey);
  if (!context) {
    throw new Error('useTheme() harus dipanggil didalam komponen yang berada dalam provideTheme()');
  }
  return context;
}

