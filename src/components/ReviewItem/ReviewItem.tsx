import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { Review } from '@/redux/api/provider/types';

import { styles } from './styles';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

/** One customer review: avatar, name, stars, date, comment. */
export function ReviewItem({ review }: { review: Review }) {
  return (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(review.user.fullName)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={styles.name} numberOfLines={1}>
            {review.user.fullName}
          </Text>
          <Text style={styles.date}>{relativeDate(review.createdAt)}</Text>
        </View>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={13}
              color={Color.warning}
              fill={n <= review.rating ? Color.warning : 'transparent'}
            />
          ))}
        </View>
        {!!review.comment && <Text style={styles.comment}>{review.comment}</Text>}
      </View>
    </View>
  );
}
