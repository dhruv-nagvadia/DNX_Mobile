import { ReminderType } from '@/redux/api/reminder/types';
import { TINT } from '@/utils/modernTheme';

type Tint = { colors: string[]; border: string; icon: string };

const GREY: Tint = { colors: ['#F7F8FA', '#EDF0F4'], border: '#E2E6EC', icon: '#475569' };

/** Pastel tile theme per reminder category (mockup's Category grid). */
export const CATEGORY_TINT: Record<ReminderType, Tint> = {
  vehicle: TINT.blue,
  insurance: TINT.lavender,
  health: TINT.pink,
  document: TINT.peach,
  home: TINT.mint,
  appointment: TINT.blue,
  other: GREY,
};

/** Selected tile: soft blue fill, regardless of category. */
export const SELECTED_TINT_COLORS = ['#EEF4FF', '#E1EBFD'];
