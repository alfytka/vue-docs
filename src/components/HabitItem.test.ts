import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { Habit } from '../types/habit';
import HabitItem from './HabitItem.vue';

const mockHabit: Habit = {
  id: '1',
  name: 'Baca buku',
  completed: false,
  createdAt: new Date(),
};

describe('HabitItem', () => {
  it('menampilkan nama habit dengan benar', () => {
    const wrapper = mount(HabitItem, {
      props: { habit: mockHabit },
    })

    // Setara: expect(screen.getByText('Baca buku')).toBeInTheDocument() di RTL
    expect(wrapper.text()).toContain('Baca buku');
  });

  it('emit event "toggle" dengan id yang benar saat checkbox diklik', async () => {
    const wrapper = mount(HabitItem, {
      props: { habit: mockHabit },
    });

    await wrapper.find('input[type="checkbox"]').trigger('change');

    // Cek apakah event "toggle" ter-emit dengan payload yang sesuai
    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['1']);
  });

  it('menampilkan style line-through saat habit completed', () => {
    const completedHabit = { ...mockHabit, completed: true };
    const wrapper = mount(HabitItem, {
      props: { habit: completedHabit },
    });

    const span = wrapper.find('span');
    expect(span.classes()).toContain('line-through');
  });
});