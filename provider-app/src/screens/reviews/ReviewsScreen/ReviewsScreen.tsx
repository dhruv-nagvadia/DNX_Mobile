import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Color } from '@/utils/Theme';
import { BusinessReview } from '@/redux/api/business/types';

import { useReviewsScreen } from './useReviewsScreen';
import { styles } from './styles';

function stars(rating: number): string {
  const n = Math.round(rating);
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export default function ReviewsScreen() {
  const { reviews, summary, isLoading, refreshing, refresh, editingId, draft, setDraft, saving, startReply, cancelReply, saveReply } =
    useReviewsScreen();

  const renderReview = (r: BusinessReview) => {
    const isEditing = editingId === r.id;

    return (
      <View key={r.id} style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.name}>{r.user.fullName}</Text>
          <Text style={styles.date}>{relativeDate(r.createdAt)}</Text>
        </View>
        <Text style={styles.stars}>{stars(r.rating)}</Text>
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
          <TouchableOpacity style={styles.replyLink} onPress={() => startReply(r.id, r.providerReply)}>
            <Text style={styles.replyLinkText}>{r.providerReply ? 'Edit reply' : 'Reply'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <Text style={styles.title}>Reviews</Text>

        {summary.count > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryAvg}>{summary.avg.toFixed(1)}</Text>
              <Text style={styles.summaryStars}>{stars(summary.avg)}</Text>
              <Text style={styles.summaryCount}>{summary.count} reviews</Text>
            </View>
            <View style={styles.distribution}>
              {summary.distribution.map((d) => (
                <View key={d.star} style={styles.distRow}>
                  <Text style={styles.distLabel}>{d.star}</Text>
                  <View style={styles.distTrack}>
                    <View
                      style={[
                        styles.distFill,
                        { width: summary.count ? `${(d.count / summary.count) * 100}%` : '0%' },
                      ]}
                    />
                  </View>
                  <Text style={styles.distCount}>{d.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {reviews.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No reviews yet. Reviews appear here after customers complete a booking and rate you.
            </Text>
          </View>
        ) : (
          reviews.map(renderReview)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
