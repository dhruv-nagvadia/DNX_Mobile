import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Search, X } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { INK, LINK, ModernSize } from '@/utils/modernTheme';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { BusinessListCard } from './BusinessListCard';
import { ListSort, useProviderListScreen } from './useProviderListScreen';
import { styles } from './styles';

const SORTS: { key: ListSort; label: string }[] = [
  { key: 'rating', label: 'Top rated' },
  { key: 'nearest', label: 'Nearest' },
  { key: 'reviews', label: 'Most reviewed' },
];

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  dot?: boolean;
}

function Chip({ label, active, onPress, dot }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {dot && <View style={[styles.chipDot, active && styles.chipDotActive]} />}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Mockup "designs/customer/mobile/Unisex Salon Booking App Listings.png". */
export default function ProviderListScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    title,
    subtitle,
    providers,
    total,
    shown,
    hasMore,
    isLoading,
    isLoadingMore,
    isFiltering,
    searchText,
    setSearchText,
    sort,
    setSort,
    canSortNearest,
    openNow,
    toggleOpenNow,
    topRatedOnly,
    toggleTopRatedOnly,
    loadMore,
    onProviderPress,
  } = useProviderListScreen();

  const { width } = useWindowDimensions();
  const cardW = width - ModernSize.gutter * 2;
  const sorts = SORTS.filter((s) => s.key !== 'nearest' || canSortNearest);

  const header = (
    <View>
      {/* ── Search ───────────────────────────────────────────────────── */}
      <View style={styles.search}>
        <Search size={20} color={INK} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={`Search ${title.toLowerCase()} by name`}
          placeholderTextColor="#64748B"
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search by name"
        />
        {!!searchText && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            hitSlop={10}
            accessibilityLabel="Clear search"
          >
            <X size={18} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Sort + filter chips ──────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsBleed}
        contentContainerStyle={styles.chips}
      >
        {sorts.slice(0, 1).map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            active={sort === s.key}
            onPress={() => setSort(s.key)}
          />
        ))}
        <Chip label="Open now" active={openNow} onPress={toggleOpenNow} dot />
        <Chip label="4★ & above" active={topRatedOnly} onPress={toggleTopRatedOnly} />
        {sorts.slice(1).map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            active={sort === s.key}
            onPress={() => setSort(s.key)}
          />
        ))}
      </ScrollView>

      <View style={styles.countRow}>
        <Text style={styles.count}>
          {total} {total === 1 ? 'result' : 'results'}
        </Text>
        {isFiltering && <ActivityIndicator size="small" color={LINK} />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title={title} subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(p) => p.id}
          contentContainerStyle={withBottomInset(styles.content)}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={header}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <BusinessListCard
              provider={item}
              width={cardW}
              index={index}
              onPress={onProviderPress}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No places match</Text>
              <Text style={styles.emptyText}>
                {searchText || openNow || topRatedOnly
                  ? 'Try clearing the search or filters.'
                  : `No businesses listed for ${title} near you yet.`}
              </Text>
            </View>
          }
          ListFooterComponent={
            providers.length > 0 ? (
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>
                  Showing {shown} of {total}
                </Text>
                {(isLoadingMore || hasMore) && <ActivityIndicator size="small" color={LINK} />}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
