import { computed, onUnmounted, ref, watch } from "vue";

type TimerMode = 'focus' | 'break';

export function useTimer() {
  const FOCUS_DURATION = 0.50 * 60; // 30 detik
  const BREAK_DURATION = 0.10 * 60; // 6 detik

  const mode = ref<TimerMode>('focus');
  const secondsLeft = ref(FOCUS_DURATION);
  const isRunning = ref(false);

  // Simpan reference interval ID di variabel biasa (bukan ref, karena ini bukan
  // data yang perlu reactive/ditampilkan di UI — cukup untuk cleanup nanti)
  let intervalId: ReturnType<typeof setInterval> | null = null;

  // computed untuk format tampilan MM:SS, otomatis update tiap secondsLeft berubah
  const formattedTime = computed(() => {
    const minutes = Math.floor(secondsLeft.value / 60);
    const seconds = secondsLeft.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const progress = computed(() => {
    const total = mode.value === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
    return Math.round(((total - secondsLeft.value) / total) * 100);
  });

  function start() {
    if (isRunning.value) return;
    isRunning.value = true;

    intervalId = setInterval(() => {
      if (secondsLeft.value > 0) {
        secondsLeft.value--;
      } else {
        switchMode();
      }
    }, 1000);
  }

  function pause() {
    isRunning.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    pause();
    secondsLeft.value = mode.value === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
  }

  function switchMode() {
    pause();
    mode.value = mode.value === 'focus' ? 'break' : 'focus';
    secondsLeft.value = mode.value === 'focus' ? FOCUS_DURATION : BREAK_DURATION;

    // Trigger notifikasi browser saat mode berganti
    notify(mode.value === 'focus' ? 'Waktunya fokus lagi!' : 'Saatnya istirahat!');
    start(); // auto-lanjut ke sesi berikutnya
  }

  function notify(message: string) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', { body: message });
    }
  }

  // watch untuk side effect ekstra: misal ubah title tab browser sesuai countdown
  // Ini setara: useEffect(() => { document.title = ... }, [formattedTime])
  watch(formattedTime, (newTime) => {
    document.title = `${newTime} - ${mode.value === 'focus' ? 'Fokus' : 'Istirahat'}`;
  });

  // onUnmounted = SANGAT PENTING, ini setara cleanup function di useEffect:
  // useEffect(() => { ...; return () => clearInterval(id) }, [])
  // Kalau ini tidak ada, interval akan TERUS jalan walau komponen sudah di-unmount
  // (misal user pindah halaman), menyebabkan memory leak.
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    mode,
    secondsLeft,
    isRunning,
    formattedTime,
    progress,
    start,
    pause,
    reset,
  };
}
