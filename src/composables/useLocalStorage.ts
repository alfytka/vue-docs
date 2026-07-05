import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key);
  const initial = stored ? (JSON.parse(stored) as T) : defaultValue;

  const data = ref(initial) as Ref<T>;

  // watch = useEffect dengan dependency spesifik (mirip useEffect(() => {}, [data]))
  // deep: true perlu karena kita watch object/array, bukan primitive
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  );

  return data;
}
