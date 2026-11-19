import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, Search, X } from 'lucide-react-native';

import { StoreItemCard } from '@/components/StoreItemCard';
import { Color } from '@/utils/Theme';
import { INK, LINK, ModernSize, PAGE_BG } from '@/utils/modernTheme';
import { ProductSearchResult } from '@/redux/api/provider/types';

import { useSearchScreen, TypeFilter } from './useSearchScreen';
import {
  BusinessResultCard,
  PopularTile,
  RecentViewRow,
  SectionHeader,
  ServiceResultRow,
} from './parts';
import { styles } from './styles';

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SERVICE', label: 'Services' },
  // { key: 'PRODUCT', label: 'Products' }, // SERVICES-ONLY: products hidden for launch — uncomment to restore
  { key: 'BUSINESS', label: 'Businesses' },
];

// How much of each type "All" previews before "See all".
const PREVIEW = { BUSINESS: 3, SERVICE: 3, PRODUCT: 6 } as const;

const PLACEHOLDER = '#94A3B8';
const G = ModernSize.gutter;
const GAP = 10;

/** Provider/service/product search — mockup "Modern Hair Search App Interface.png". */
export default function SearchScreen() {
  const {
    query,
    setQuery,
    type,
    selectType,
    locationLabel,
    goToLocationPicker,
    goBack,
    popularCategories,
    onCategoryPress,
    minQueryLength,
    hasActiveQuery,
    isProductSearch,
    isServiceSearch,
    isAllSearch,
    providers,
    products,
    services,
    resultCount,
    isFetching,
    onProviderPress,
    onProductPress,
    onServicePress,
    recentSearches,
    recentSearchViews,
    onRecentSearchPress,
    onRecentViewPress,
    clearRecentSearches,
    clearRecentSearchViews,
  } = useSearchScreen();

  const { width: screenW } = useWindowDimensions();
  const tileW = Math.floor((screenW - G * 2 - GAP * 2) / 3);
  const productW = Math.round(screenW * 0.36);
  const productGridW = Math.floor((screenW - G * 2 - GAP) / 2);

  const trimmed = query.trim();
  const showBusinesses = isAllSearch || type === 'BUSINESS';

  // The business results double as a photo source for service rows, since a
  // service hit only carries its business's id and name.
  const providerPhoto = new Map(providers.map((p) => [p.id, p.images?.[0]]));

  const shownProviders = isAllSearch ? providers.slice(0, PREVIEW.BUSINESS) : providers;
  const shownServices = isAllSearch ? services.slice(0, PREVIEW.SERVICE) : services;
  const shownProducts = isAllSearch ? products.slice(0, PREVIEW.PRODUCT) : products;

  const renderProduct = (p: ProductSearchResult, width: number) => (
    <StoreItemCard
      key={p.id}
      product={p}
      providerId={p.provider.id}
      providerName={p.provider.businessName}
      storeLabel={p.provider.businessName}
      width={width}
      onPress={() => onProductPress(p)}
    />
  );

  const renderBrowse = () => {
    const nothing =
      recentSearches.length === 0 &&
      recentSearchViews.length === 0 &&
      popularCategories.length === 0;
    return (
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {trimmed.length > 0 && (
          <Text style={styles.hintText}>Type at least {minQueryLength} characters to search.</Text>
        )}

        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recent searches" action="Clear" onAction={clearRecentSearches} />
            <View style={styles.wrapRow}>
              {recentSearches.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.recentChip}
                  activeOpacity={0.85}
                  onPress={() => onRecentSearchPress(term)}
                  accessibilityRole="button"
                  accessibilityLabel={`Search again for ${term}`}
                >
                  <Clock size={17} color={INK} strokeWidth={1.8} />
                  <Text style={styles.recentChipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {recentSearchViews.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Recently viewed"
              action="Clear"
              onAction={clearRecentSearchViews}
            />
            <View style={styles.listCard}>
              {recentSearchViews.map((entry, i) => (
                <React.Fragment key={`${entry.kind}-${entry.item.id}`}>
                  {i > 0 && <View style={styles.divider} />}
                  <RecentViewRow entry={entry} onPress={() => onRecentViewPress(entry)} />
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {popularCategories.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Popular near you" />
            <View style={styles.tileGrid}>
              {popularCategories.map((c, i) => (
                <PopularTile
                  key={c.id}
                  category={c}
                  index={i}
                  width={tileW}
                  onPress={() => onCategoryPress(c)}
                />
              ))}
            </View>
          </View>
        )}

        {nothing && trimmed.length === 0 && (
          <View style={styles.center}>
            <View style={styles.emptyIcon}>
              <Search size={30} color={LINK} strokeWidth={1.8} />
            </View>
            {/* SERVICES-ONLY: was "Search for a business, service or product." — restore for products */}
            <Text style={styles.emptyText}>Search for a business or service.</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderEmpty = () => (
    <View style={styles.center}>
      <View style={styles.emptyIcon}>
        <Search size={30} color={LINK} strokeWidth={1.8} />
      </View>
      <Text style={styles.emptyTitle}>
        {isProductSearch
          ? 'No products match your search.'
          : isServiceSearch
            ? 'No services match your search.'
            : isAllSearch
              ? 'Nothing matches your search.'
              : 'No businesses match your search.'}
      </Text>
      <Text style={styles.emptyText}>Try a shorter word or another area.</Text>
    </View>
  );

  const renderResults = () => (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Text style={styles.resultsTitle} accessibilityRole="header">
        {resultCount} {resultCount === 1 ? 'result' : 'results'} for “{trimmed}”
      </Text>

      {showBusinesses && providers.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title={`Businesses (${providers.length})`}
            action={isAllSearch && providers.length > PREVIEW.BUSINESS ? 'See all' : undefined}
            onAction={() => selectType('BUSINESS')}
          />
          {shownProviders.map((p) => (
            <BusinessResultCard
              key={p.id}
              provider={p}
              query={trimmed}
              onPress={() => onProviderPress(p)}
            />
          ))}
        </View>
      )}

      {(isAllSearch || isServiceSearch) && services.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title={`Services (${services.length})`}
            action={isAllSearch && services.length > PREVIEW.SERVICE ? 'See all' : undefined}
            onAction={() => selectType('SERVICE')}
          />
          <View style={styles.listCard}>
            {shownServices.map((s, i) => (
              <React.Fragment key={s.id}>
                {i > 0 && <View style={styles.divider} />}
                <ServiceResultRow
                  service={s}
                  query={trimmed}
                  imageUri={providerPhoto.get(s.provider.id)}
                  onPress={() => onServicePress(s)}
                />
              </React.Fragment>
            ))}
          </View>
        </View>
      )}

      {(isAllSearch || isProductSearch) && products.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title={`Products (${products.length})`}
            action={isAllSearch && products.length > PREVIEW.PRODUCT ? 'See all' : undefined}
            onAction={() => selectType('PRODUCT')}
          />
          {isAllSearch ? (
            <ScrollView
              horizontal
              style={styles.productScroll}
              contentContainerStyle={styles.productRow}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {shownProducts.map((p) => renderProduct(p, productW))}
            </ScrollView>
          ) : (
            <View style={styles.productGrid}>
              {shownProducts.map((p) => renderProduct(p, productGridW))}
            </View>
          )}
        </View>
      )}

      <View style={styles.footerHint}>
        <Search size={18} color={LINK} strokeWidth={2} />
        <Text style={styles.footerHintText}>
          Can’t find it? Try a shorter word or another area.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      {/* Back + search field */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={22} color={INK} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            // SERVICES-ONLY: was "Search services, stores or products" — restore for products/stores
            placeholder="Search services or businesses"
            placeholderTextColor={PLACEHOLDER}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={14} color={Color.white} strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* What to search for */}
      <View style={styles.typeRow}>
        {TYPES.map((t) => {
          const active = type === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, active && styles.typeChipActive]}
              activeOpacity={0.85}
              onPress={() => selectType(t.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Search ${t.label.toLowerCase()}`}
            >
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Location */}
      <TouchableOpacity
        style={styles.locationRow}
        activeOpacity={0.7}
        onPress={goToLocationPicker}
        accessibilityRole="button"
        accessibilityLabel={
          locationLabel ? `Searching near ${locationLabel}. Change location` : 'Set your location'
        }
      >
        <MapPin size={22} color={INK} strokeWidth={1.8} />
        <View style={styles.locationTextWrap}>
          <Text style={styles.locationLabel}>
            {locationLabel ? 'Searching near' : 'Location not set'}
          </Text>
          <Text style={styles.locationValue} numberOfLines={1}>
            {locationLabel ?? 'Set your location'}
          </Text>
        </View>
        <Text style={styles.locationChange}>Change</Text>
      </TouchableOpacity>

      {!hasActiveQuery ? (
        renderBrowse()
      ) : isFetching && resultCount === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : resultCount === 0 ? (
        renderEmpty()
      ) : (
        renderResults()
      )}
    </SafeAreaView>
  );
}
