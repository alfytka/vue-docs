import { describe, beforeEach, vi, afterEach, it, expect } from 'vitest';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  // vi.useFakeTimers() = mock setInterval/setTimeout, biar test tidak perlu nunggu waktu asli
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dimulai dengan 25 menit (1500 detik) di mode focus', () => {
    const { secondsLeft, mode } = useTimer();
    expect(secondsLeft.value).toBe(1500);
    expect(mode.value).toBe('focus');
  });

  // vi.advanceTimersByTime = "percepat" waktu palsu, tanpa nunggu asli
  it('mengurangi secondsLeft setiap 1 detik setelah start()', () => {
    const { secondsLeft, start } = useTimer();
    start();

    vi.advanceTimersByTime(3000); // maju 3 detik

    expect(secondsLeft.value).toBe(1497); // 1500 - 3
  });

  it('pause() menghentikan countdown', () => {
    const { secondsLeft, start, pause } = useTimer();
    start();
    vi.advanceTimersByTime(2000);
    pause();

    const valueAfterPause = secondsLeft.value;
    vi.advanceTimersByTime(5000); // waktu tetap jalan, tapi timer sudah pause

    expect(secondsLeft.value).toBe(valueAfterPause); // tidak berubah
  });

  it('formattedTime menampilkan format MM:SS yang benar', () => {
    const { formattedTime } = useTimer();
    expect(formattedTime.value).toBe('25:00');
  });
})