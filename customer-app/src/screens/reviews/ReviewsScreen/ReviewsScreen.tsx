import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageSquare, Star } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Review } from '@/redux/api/provider/types';
import { LINK } from '@/utils/modernTheme';

import { useReviewsScreen } from './useReviewsScreen';
import { ReviewFilter } from './types';
import { AMBER, AVATAR_TINTS, EMPTY_STAR, styles } from './styles';

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const filled = Math.round(value);
  return (
    <View
      style={styles.stars}
      accessible
      accessibilityLabel={`${filled} out of 5 stars`}
      accessibilityRole="image"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          color={i <= filled ? AMBER : EMPTY_STAR}
          fill={i <= filled ? AMBER : 'transparent'}
        />
      ))}
    </View>
  );
}

function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 30) {
    return `${days} days ago`;
  }
  const months = Math.floor(days / 30);
  return months < 12
    ? `${months} month${months > 1 ? 's' : ''} ago`
    : `${Math.floor(months / 12)} yr ago`;
}

function ReviewCard({
  review,
  index,
  businessName,
}: {
  review: Review;
  index: number;
  businessName?: string;
}) {
  const tint = AVATAR_TINTS[index % AVATAR_TINTS.length];
  return (
    <View style={styles.reviewCard}>
      <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
        <Text style={[styles.avatarText, { color: tint.fg }]}>
          {review.user.fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewHead}>
          <Text style={styles.reviewName} numberOfLines={1}>
            {review.user.fullName}
          </Text>
          <Text style={styles.reviewAgo}>{ago(review.createdAt)}</Text>
        </View>
        <Stars value={review.rating} size={13} />
        {!!review.comment && <Text style={styles.reviewText}>{review.comment}</Text>}
        {!!review.providerReply && (
          <View style={styles.reply}>
            <Text style={styles.replyTitle}>Reply from {businessName || 'the owner'}</Text>
            <Text style={styles.replyText}>{review.providerReply}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/** Full reviews list: rating summary + breakdown, filter chips, review cards. */
export default function ReviewsScreen() {
  const {
    businessName,
    visibleReviews,
    filter,
    setFilter,
    isLoading,
    count,
    avg,
    distribution,
    withComments,
  } = useReviewsScreen();
  const insets = useSafeAreaInsets();

  const chips: { key: ReviewFilter; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: count },
    ...distribution.map((d) => ({ key: d.star as ReviewFilter, label: `${d.star} ★`, n: d.n })),
    { key: 'comments', label: 'With comments', n: withComments },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reviews" subtitle={businessName} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : count === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Star size={30} color={AMBER} />
          </View>
          <Text style={styles.emptyTitle}>No reviews yet</Text>
          <Text style={styles.hint}>Reviews from customers will show up here.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary + breakdown */}
          <View style={styles.card}>
            <View style={styles.summary}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryAvg}>{avg.toFixed(1)}</Text>
                <Stars value={avg} size={16} />
                <Text style={styles.summaryCount}>
                  {count.toLocaleString('en-IN')} review{count === 1 ? '' : 's'}
                </Text>
              </View>
              <View style={styles.bars}>
                {distribution.map(({ star, pct }) => (
                  <View
                    key={star}
                    style={styles.barRow}
                    accessible
                    accessibilityLabel={`${star} stars, ${Math.round(pct)} percent`}
                  >
                    <Text style={styles.barLabel}>{star} ★</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.barPct}>{Math.round(pct)}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipRow}
          >
            {chips.map((c) => {
              const active = c.key === filter;
              return (
                <TouchableOpacity
                  key={String(c.key)}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setFilter(c.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${c.label.replace('★', 'stars')}, ${c.n}`}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                  <Text style={[styles.chipCount, active && styles.chipTextActive]}>{c.n}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Reviews */}
          {visibleReviews.length === 0 ? (
            <View style={styles.noMatch}>
              <MessageSquare size={22} color={EMPTY_STAR} />
              <Text style={styles.hint}>No reviews match this filter.</Text>
            </View>
          ) : (
            visibleReviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} businessName={businessName} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
