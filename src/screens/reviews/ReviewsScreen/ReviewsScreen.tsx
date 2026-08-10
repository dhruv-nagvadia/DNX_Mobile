import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Star } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { ReviewItem } from '@/components/ReviewItem';
import { Color } from '@/utils/Theme';

import { useReviewsScreen } from './useReviewsScreen';
import { styles } from './styles';

/** Full reviews list with the star-rating breakdown. */
export default function ReviewsScreen() {
  const { businessName, reviews, isLoading, count, avg, distribution } = useReviewsScreen();

  return (
    <View style={styles.container}>
      <AppHeader title={businessName ? `${businessName} · Reviews` : 'Reviews'} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : count === 0 ? (
        <View style={styles.center}>
          <Star size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>No reviews yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Summary + breakdown */}
          <View style={styles.summary}>
            <View style={styles.score}>
              <Text style={styles.scoreNum}>{avg.toFixed(1)}</Text>
              <View style={styles.scoreStars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={13}
                    color={Color.warning}
                    fill={n <= Math.round(avg) ? Color.warning : 'transparent'}
                  />
                ))}
              </View>
              <Text style={styles.scoreCount}>
                {count} review{count === 1 ? '' : 's'}
              </Text>
            </View>

            <View style={styles.dist}>
              {distribution.map(({ star, n, pct }) => (
                <View key={star} style={styles.distRow}>
                  <View style={styles.distStar}>
                    <Text style={styles.distStarText}>{star}</Text>
                    <Star size={11} color={Color.warning} fill={Color.warning} />
                  </View>
                  <View style={styles.distTrack}>
                    <View style={[styles.distFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.distN}>{n}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* All reviews */}
          <View style={styles.listCard}>
            {reviews.map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
