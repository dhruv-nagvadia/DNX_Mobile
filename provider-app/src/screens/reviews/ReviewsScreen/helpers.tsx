import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';

import { PillColors } from '@/utils/modernTheme';

import { STAR_EMPTY, STAR_FILLED, styles } from './styles';

/** Pastel avatar colour pairs, picked by the reviewer's name. */
const AVATAR_COLORS: PillColors[] = [
  { bg: '#DBEAFE', fg: '#1D4ED8' },
  { bg: '#FCE7F3', fg: '#BE185D' },
  { bg: '#DCFCE7', fg: '#15803D' },
  { bg: '#EDE9FE', fg: '#5B21B6' },
  { bg: '#FDEBD8', fg: '#C2410C' },
  { bg: '#CCFBF1', fg: '#0F766E' },
];

export function avatarColors(name: string): PillColors {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 1000003;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** "Today" / "1 day ago" / "3 days ago" / "2 months ago" / "1 year ago". */
export function relativeDate(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return '';
  }
  const days = Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
  if (days <= 0) {
    return 'Today';
  }
  if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Five stars with fractional fill (e.g. 4.7 → four full + 70% of the fifth). */
export function StarRow({ rating, size }: { rating: number; size: number }) {
  return (
    <View style={styles.starRow}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <View key={i}>
            <Star size={size} color={STAR_EMPTY} fill={STAR_EMPTY} />
            {fill > 0 && (
              <View style={[styles.starClip, { width: size * fill }]}>
                <Star size={size} color={STAR_FILLED} fill={STAR_FILLED} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
