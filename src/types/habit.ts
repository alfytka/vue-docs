export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // format ISO: '2026-07-05', ganti dari `completed: boolean`
  createdAt: Date;
}

// Helper untuk format tanggal konsisten di seluruh app
export function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0]; // '2026-07-05'
}
