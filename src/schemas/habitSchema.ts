import z from 'zod';

export const habitSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama habit minimal 3 karakter')
    .max(50, 'Nama habit maksimal 50 karakter'),
   category: z.enum(['health', 'productivity', 'mindfulness', 'social'], {
    error: 'Pilih kategori terlebih dahulu',
  }),
});

// Infer TypeScript type LANGSUNG dari schema Zod — tidak perlu tulis interface manual lagi,
// satu sumber kebenaran untuk validasi RUNTIME sekaligus TYPE CHECKING compile-time
export type HabitFormValues = z.infer<typeof habitSchema>;