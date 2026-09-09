import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Clock, MapPin, Search, Star, BadgeCheck } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { ProviderSort } from '@/redux/api/provider/types';

import { useSearchScreen, TypeFilter } from './useSearchScreen';
import { styles } from './styles';

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SERVICE', label: 'Services' },
  { key: 'STORE', label: 'Stores' },
];

const SORTS: { key: ProviderSort; label: string }[] = [
  { key: 'rating', label: 'Top rated' },
  { key: 'reviews', label: 'Most reviewed' },
  { key: 'newest', label: 'Newest' },
  { key: 'nearest', label: 'Nearest' },
];

const RATINGS = [4, 4.5];

/** Provider search + filters (type, category, rating, sort, open-now, location). */
export default function SearchScreen() {
  const {
    query,
    setQuery,
    type,
    selectType,
    categories,
    categorySlug,
    toggleCategory,
    clearCategory,
    minRating,
    toggleRating,
    openNow,
    toggleOpenNow,
    sort,
    setSort,
    nearestAvailable,
    locationLabel,
    goToLocationPicker,
    providers,
    isFetching,
    onProviderPress,
  } = useSearchScreen();

  const onSortPress = (key: ProviderSort) => {
    // "Nearest" needs GPS — send them to set a location first if it isn't on.
    if (key === 'nearest' && !nearestAvailable) {
      goToLocationPicker();
      return;
    }
    setSort(key);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Search" />

      <View style={styles.searchBar}>
        <Search size={18} color={Color.placeholder} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons, doctors, stores…"
          placeholderTextColor={Color.placeholder}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* Location */}
      <TouchableOpacity style={styles.locationRow} activeOpacity={0.7} onPress={goToLocationPicker}>
        <MapPin size={14} color={Color.primary} />
        <Text style={styles.locationText} numberOfLines={1}>
          {locationLabel ? `Near ${locationLabel}` : 'Set your location'}
        </Text>
        <Text style={styles.locationChange}>Change</Text>
      </TouchableOpacity>

      {/* Filters */}
      <View style={styles.filters}>
        {/* Business kind */}
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const active = type === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.typeChip, active && styles.typeChipActive]}
                activeOpacity={0.85}
                onPress={() => selectType(t.key)}
              >
                <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
            keyboardShouldPersistTaps="handled"
          >
            <Chip label="All categories" active={!categorySlug} onPress={clearCategory} />
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                active={categorySlug === c.slug}
                onPress={() => toggleCategory(c.slug)}
              />
            ))}
          </ScrollView>
        )}

        {/* Rating + open now */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          keyboardShouldPersistTaps="handled"
        >
          {RATINGS.map((r) => (
            <Chip
              key={r}
              label={`${r}★+`}
              active={minRating === r}
              onPress={() => toggleRating(r)}
            />
          ))}
          <View style={styles.sep} />
          <Chip
            label="Open now"
            active={openNow}
            onPress={toggleOpenNow}
            icon={<Clock size={12} color={openNow ? Color.primary : Color.textSecondary} />}
          />
        </ScrollView>

        {/* Sort */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          keyboardShouldPersistTaps="handled"
        >
          {SORTS.map((s) => (
            <Chip
              key={s.key}
              label={s.key === 'nearest' && !nearestAvailable ? 'Nearest (set location)' : s.label}
              active={sort === s.key}
              onPress={() => onSortPress(s.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {isFetching && providers.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.center}>
          <Search size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>No businesses match your filters.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {providers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => onProviderPress(p)}
            >
              <View style={styles.avatar}>
                {p.images.length > 0 ? (
                  <Image source={{ uri: p.images[0] }} style={styles.avatarImg} />
                ) : (
                  <CategoryIcon slug={p.category.slug} size={24} />
                )}
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {p.businessName}
                  </Text>
                  {p.isVerified && <BadgeCheck size={15} color={Color.success} />}
                </View>
                <Text style={styles.meta} numberOfLines={1}>
                  {p.subcategory?.name ?? p.category.name}
                  {p.city ? ` · ${p.city}` : ''}
                  {sort === 'nearest' && p.distanceKm != null ? ` · ${p.distanceKm} km` : ''}
                </Text>
                <View style={styles.ratingRow}>
                  <Star size={13} color={Color.warning} fill={Color.warning} />
                  <Text style={styles.ratingText}>
                    {p.ratingAvg.toFixed(1)} ({p.ratingCount})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/** A single pill filter chip. */
function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
