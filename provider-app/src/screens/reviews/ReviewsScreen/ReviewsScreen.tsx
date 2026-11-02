import React from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Reply, Star } from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';
import { LINK, PILL } from '@/utils/modernTheme';
import { BusinessReview } from '@/redux/api/business/types';

import { useReviewsScreen } from './useReviewsScreen';
import { STAR_EMPTY, STAR_FILLED, styles } from './styles';

/** Pastel avatar colour pairs, cycled by the reviewer's name. */
const AVATAR_COLORS = [PILL.blue, PILL.lavender, PILL.green, PILL.orange, PILL.red];

function avatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash];
}

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
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
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Five stars with fractional fill (e.g. 4.7 → four full + 70% of the fifth). */
function StarRow({ rating, size }: { rating: number; size: number }) {
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

export default function ReviewsScreen() {
  const { reviews, summary, isLoading, refreshing, refresh, editingId, draft, setDraft, saving, startReply, cancelReply, saveReply } =
    useReviewsScreen();

  const renderReview = (r: BusinessReview, index: number) => {
    const isEditing = editingId === r.id;
    const name = r.user.fullName || 'Customer';
    const avatar = avatarColors(name);

    return (
      <View key={r.id} style={[styles.review, index > 0 && styles.reviewDivider]}>
        <View style={styles.reviewTop}>
          <View style={[styles.avatar, { backgroundColor: avatar.bg }]}>
            <Text style={[styles.avatarText, { color: avatar.fg }]}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.reviewHead}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <StarRow rating={r.rating} size={16} />
            <Text style={styles.date}>{relativeDate(r.createdAt)}</Text>
          </View>
        </View>

        {!!r.comment && <Text style={styles.comment}>{r.comment}</Text>}

        {!!r.providerReply && !isEditing && (
          <View style={styles.replyBox}>
            <Text style={styles.replyLabel}>Your reply</Text>
            <Text style={styles.replyText}>{r.providerReply}</Text>
          </View>
        )}

        {isEditing ? (
          <View>
            <TextInput
              style={styles.editorInput}
              value={draft}
              onChangeText={setDraft}
              placeholder="Write a reply…"
              placeholderTextColor={Color.placeholder}
              multiline
              maxLength={1000}
            />
            <View style={styles.editorActions}>
              <AppButton style={styles.editorButton} title="Cancel" variant="secondary" onPress={cancelReply} />
              <AppButton style={styles.editorButton} title="Save reply" loading={saving} onPress={saveReply} />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.replyLink}
            onPress={() => startReply(r.id, r.providerReply)}
            accessibilityRole="button"
            hitSlop={6}
          >
            <Reply size={18} color={LINK} />
            <Text style={styles.replyLinkText}>{r.providerReply ? 'Edit reply' : 'Reply'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Reviews" variant="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {summary.count > 0 && (
          <View style={styles.card}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryAvg}>{summary.avg.toFixed(1)}</Text>
              <StarRow rating={summary.avg} size={26} />
              <Text style={styles.summaryCount}>
                {summary.count} review{summary.count === 1 ? '' : 's'}
              </Text>
            </View>
            <View style={styles.distribution}>
              {summary.distribution.map((d) => {
                const pct = Math.round((d.count / summary.count) * 100);
                return (
                  <View key={d.star} style={styles.distRow}>
                    <View style={styles.distLabelWrap}>
                      <Text style={styles.distLabel}>{d.star}</Text>
                      <Star size={16} color={STAR_FILLED} fill={STAR_FILLED} />
                    </View>
                    <View style={styles.distTrack}>
                      <View style={[styles.distFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.distPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {reviews.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Star size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No reviews yet"
            body="Reviews appear here after customers complete a booking and rate you."
          />
        ) : (
          reviews.length > 0 && <View style={styles.card}>{reviews.map(renderReview)}</View>
        )}
      </ScrollView>
    </View>
  );
}
