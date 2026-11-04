import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, SlidersHorizontal, Star } from 'lucide-react-native';

import { businessColor } from '@/screens/catalog/AllOffersScreen/helpers';
import { Spacing } from '@/utils/Theme';
import { INK, LINK, PAGE_BG } from '@/utils/modernTheme';

import { FilterSheet } from './FilterSheet';
import { ReviewCard } from './ReviewCard';
import { StarRow } from './helpers';
import { STAR_FILLED, styles } from './styles';
import { RatingFilter } from './types';
import { useReviewsScreen } from './useReviewsScreen';

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function Chip({
  selected,
  onPress,
  children,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const {
    reviews,
    scopedCount,
    totalCount,
    needsReplyCount,
    summary,
    businessChips,
    businessFilter,
    setBusinessFilter,
    selectedBusinessName,
    ratingFilter,
    setRatingFilter,
    sort,
    setSort,
    typeFilter,
    setTypeFilter,
    hasProductReviews,
    sheetOpen,
    openSheet,
    closeSheet,
    isLoading,
    isError,
    refreshing,
    refresh,
    editingKey,
    draft,
    setDraft,
    replyError,
    saving,
    startReply,
    cancelReply,
    saveReply,
    removeReply,
    maxReply,
    goBack,
  } = useReviewsScreen();

  const countLabel = `${scopedCount} review${scopedCount === 1 ? '' : 's'}`;
  const filtersActive = sort !== 'newest' || typeFilter !== 'all';

  const ratingChip = (key: RatingFilter, label: string, content: React.ReactNode) => {
    const selected = ratingFilter === key;
    return (
      <Chip key={key} label={label} selected={selected} onPress={() => setRatingFilter(key)}>
        {content}
      </Chip>
    );
  };
  const chipText = (key: RatingFilter, text: string) => (
    <Text style={[styles.chipText, ratingFilter === key && styles.chipTextActive]}>{text}</Text>
  );
  const chipStar = <Star size={16} color={STAR_FILLED} fill={STAR_FILLED} />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Reviews
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {`${selectedBusinessName ?? 'All businesses'} • ${countLabel}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={openSheet}
          accessibilityRole="button"
          accessibilityLabel="Sort and filter"
        >
          <SlidersHorizontal size={24} color={LINK} strokeWidth={2} />
          {filtersActive && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {summary.count > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryAvg}>{summary.avg.toFixed(1)}</Text>
              <StarRow rating={summary.avg} size={22} />
              <Text style={styles.summaryCount}>
                {summary.count} review{summary.count === 1 ? '' : 's'}
              </Text>
              {hasProductReviews && <Text style={styles.summaryNote}>Business reviews</Text>}
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.distribution}>
              {summary.distribution.map((d) => {
                const pct = Math.round((d.count / summary.count) * 100);
                return (
                  <View key={d.star} style={styles.distRow}>
                    <Text style={styles.distLabel}>{d.star}</Text>
                    <Star size={16} color={STAR_FILLED} fill={STAR_FILLED} />
                    <View style={styles.distTrack}>
                      <View style={[styles.distFill, { width: `${Math.max(pct, d.count > 0 ? 3 : 0)}%` }]} />
                    </View>
                    <Text style={styles.distPct} numberOfLines={1}>
                      {`${pct}% `}
                      <Text style={styles.distCount}>{`(${d.count})`}</Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {businessChips.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}
          >
            <Chip label="All businesses" selected={!businessFilter} onPress={() => setBusinessFilter(null)}>
              <Text style={[styles.chipText, !businessFilter && styles.chipTextActive]}>All businesses</Text>
            </Chip>
            {businessChips.map((b) => {
              const selected = businessFilter === b.id;
              return (
                <Chip key={b.id} label={b.name} selected={selected} onPress={() => setBusinessFilter(b.id)}>
                  <View style={[styles.dot, selected && styles.dotOnActive, { backgroundColor: businessColor(b.id) }]} />
                  <Text style={[styles.chipText, selected && styles.chipTextActive]} numberOfLines={1}>
                    {b.name}
                  </Text>
                </Chip>
              );
            })}
          </ScrollView>
        )}

        {totalCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}
          >
            {ratingChip('all', 'All', chipText('all', 'All'))}
            {ratingChip(
              'needsReply',
              `Needs reply, ${needsReplyCount}`,
              <>
                <View style={[styles.dot, styles.needsDot, ratingFilter === 'needsReply' && styles.dotOnActive]} />
                {chipText('needsReply', 'Needs reply')}
                <View style={[styles.countBadge, ratingFilter === 'needsReply' && styles.countBadgeActive]}>
                  <Text style={[styles.countBadgeText, ratingFilter === 'needsReply' && styles.chipTextActive]}>
                    {needsReplyCount}
                  </Text>
                </View>
              </>,
            )}
            {ratingChip(
              '5',
              '5 stars',
              <>
                {chipText('5', '5')}
                {chipStar}
              </>,
            )}
            {ratingChip(
              '4',
              '4 stars',
              <>
                {chipText('4', '4')}
                {chipStar}
              </>,
            )}
            {ratingChip(
              'low',
              '3 stars and below',
              <>
                {chipText('low', '3')}
                {chipStar}
                {chipText('low', '& below')}
              </>,
            )}
          </ScrollView>
        )}

        {isLoading && totalCount === 0 ? (
          <ActivityIndicator style={styles.loader} size="large" color={LINK} />
        ) : reviews.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Star size={34} color={STAR_FILLED} strokeWidth={1.6} />
            </View>
            <Text style={styles.emptyTitle}>
              {isError ? 'Could not load reviews' : totalCount === 0 ? 'No reviews yet' : 'No reviews match'}
            </Text>
            <Text style={styles.emptyBody}>
              {isError
                ? 'Pull down to try again.'
                : totalCount === 0
                  ? 'Reviews appear here after customers complete a booking or order and rate you.'
                  : 'Try another business or filter.'}
            </Text>
          </View>
        ) : (
          reviews.map((r) => (
            <ReviewCard
              key={r.key}
              item={r}
              showBusiness={!businessFilter}
              editing={editingKey === r.key}
              draft={draft}
              maxReply={maxReply}
              error={editingKey === r.key ? replyError : null}
              saving={saving}
              onDraftChange={setDraft}
              onStartReply={startReply}
              onCancel={cancelReply}
              onPost={saveReply}
              onRemove={removeReply}
            />
          ))
        )}
      </ScrollView>

      <FilterSheet
        visible={sheetOpen}
        onClose={closeSheet}
        sort={sort}
        onSort={setSort}
        type={typeFilter}
        onType={setTypeFilter}
        showProducts={hasProductReviews}
      />
    </View>
  );
}
