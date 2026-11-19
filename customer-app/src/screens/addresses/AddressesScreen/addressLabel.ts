import { Briefcase, House, LucideIcon, MapPin } from 'lucide-react-native';

import { PILL, PillColors } from '@/utils/modernTheme';

export type AddressKind = 'home' | 'work' | 'other';

/** Label presets offered on the add/edit form — the label itself stays free text. */
export const KIND_LABEL: Record<AddressKind, string> = {
  home: 'Home',
  work: 'Work',
  other: 'Other',
};

export const KIND_ICON: Record<AddressKind, LucideIcon> = {
  home: House,
  work: Briefcase,
  other: MapPin,
};

/** Pastel icon-tile tone per kind (same pill pairs as Profile's rows). */
export const KIND_TONE: Record<AddressKind, PillColors> = {
  home: PILL.blue,
  work: PILL.lavender,
  other: PILL.orange,
};

/** Which preset a free-text label corresponds to ("home" → Home, anything else → Other). */
export function addressKind(label?: string | null): AddressKind {
  const l = (label ?? '').trim().toLowerCase();
  if (l === 'home') {
    return 'home';
  }
  if (l === 'work' || l === 'office') {
    return 'work';
  }
  return 'other';
}
