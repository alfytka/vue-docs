export type HabitCategory = 'health' | 'productivity' | 'mindfulness' | 'social'

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  completedDates: string[]; // format ISO: '2026-07-05', ganti dari `completed: boolean`
  createdAt: Date;
}

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: '💪 Kesehatan',
  productivity: '📈 Produktivitas',
  mindfulness: '🧘 Mindfulness',
  social: '👥 Sosial',
}

// Helper untuk format tanggal konsisten di seluruh app
export function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0]; // '2026-07-05'
}
