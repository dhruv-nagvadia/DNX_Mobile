import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Search } from 'lucide-react-native';

import { CARD_GAP, ServiceRow } from '@/components/BusinessCards';
import { GradientBackground } from '@/components/GradientBackground';
import { RemoteImage } from '@/components/RemoteImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { IMAGE_FADE } from '@/utils/homeTiles';
import { INK, LINK, ModernSize } from '@/utils/modernTheme';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { SubcategoryCard } from './SubcategoryCard';
import { useCategoryScreen } from './useCategoryScreen';
import { styles } from './styles';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const BANNER_FALLBACK = ['#1E3A8A', '#1D4ED8', '#3B82F6'];

/**
 * Mockup "designs/customer/mobile/user_Beauty_Guide.png": light header with
 * counts, photo banner, search, 2-up sub-category cards and top-rated list.
 */
export default function CategoryScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    title,
    categorySlug,
    bannerUrl,
    bannerFallbackUrl,
    subtitle,
    tagline,
    bannerLine,
    sectionTitle,
    subcategories,
    isLoading,
    isStore,
    topRated,
    hasMoreTopRated,
    locationFilter,
    emptyText,
    onSubcategoryPress,
    onProviderPress,
    goToSearch,
    goToTopRated,
  } = useCategoryScreen();

  const { width } = useWindowDimensions();
  const contentW = width - ModernSize.gutter * 2;
  const cardW = Math.floor((contentW - CARD_GAP) / 2);

  return (
    <View style={styles.container}>
      <ScreenHeader title={title} subtitle={isLoading ? undefined : subtitle} />

      <ScrollView contentContainerStyle={withBottomInset(styles.content)} showsVerticalScrollIndicator={false}>
        {/* ── Banner ───────────────────────────────────────────────────── */}
        <View style={[styles.banner, { height: Math.round(contentW * 0.42) }]}>
          {/* Banner photo from the API (bannerUrl, else the category photo); plain blue if neither. */}
          <RemoteImage
            uris={[bannerUrl, bannerFallbackUrl]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<GradientBackground colors={BANNER_FALLBACK} />}
          />
          <GradientBackground colors={IMAGE_FADE} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 1 }} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle} numberOfLines={1}>
              {tagline}
            </Text>
            <Text style={styles.bannerLine} numberOfLines={1}>
              {bannerLine}
            </Text>
          </View>
        </View>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.search}
          activeOpacity={0.85}
          onPress={goToSearch}
          accessibilityRole="search"
        >
          <Search size={20} color={INK} strokeWidth={2} />
          <Text style={styles.searchText} numberOfLines={1}>
            Search in {title}
          </Text>
        </TouchableOpacity>

        {/* ── Sub-categories ───────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        {isLoading ? (
          <ActivityIndicator color={LINK} style={styles.loader} />
        ) : subcategories.length === 0 ? (
          <Text style={styles.stateText}>{emptyText}</Text>
        ) : (
          <View style={styles.grid}>
            {subcategories.map((sub, i) => (
              <SubcategoryCard
                key={sub.id}
                sub={sub}
                categorySlug={categorySlug}
                width={cardW}
                index={i}
                locationFilter={locationFilter}
                onPress={onSubcategoryPress}
              />
            ))}
          </View>
        )}

        {/* ── Top rated ────────────────────────────────────────────────── */}
        {topRated.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionHeadTitle} numberOfLines={1}>
                Top rated in {title}
              </Text>
              {hasMoreTopRated && (
                <TouchableOpacity onPress={goToTopRated} hitSlop={HIT} accessibilityRole="link">
                  <Text style={styles.sectionLink}>View all</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Stores and services both use the row layout here. */}
            <View style={styles.list}>
              {topRated.map((p, i) => (
                <ServiceRow
                  key={p.id}
                  provider={p}
                  index={i}
                  variant={isStore ? 'store' : 'service'}
                  onPress={onProviderPress}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
