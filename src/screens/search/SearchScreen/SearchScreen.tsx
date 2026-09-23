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
import { Clock, MapPin, Search, ShoppingBag, Star, BadgeCheck } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { formatMoney, unitPriceLabel } from '@/utils/units';
import { ProductSearchResult, Provider, ServiceSearchResult } from '@/redux/api/provider/types';

import { useSearchScreen, TypeFilter } from './useSearchScreen';
import { styles } from './styles';

const TYPES: { key: TypeFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SERVICE', label: 'Service' },
  { key: 'PRODUCT', label: 'Product' },
  { key: 'BUSINESS', label: 'Business' },
];

const PLACEHOLDER: Record<TypeFilter, string> = {
  ALL: 'Search businesses, services, products…',
  SERVICE: 'Search a service — haircut, AC repair…',
  PRODUCT: 'Search a product — rice, shampoo…',
  BUSINESS: 'Search a business by name…',
};

/** A business result — name, category, rating. */
function ProviderCard({ provider: p, onPress }: { provider: Provider; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
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
        </Text>
        <View style={styles.ratingRow}>
          <Star size={13} color={Color.warning} fill={Color.warning} />
          <Text style={styles.ratingText}>
            {p.ratingAvg.toFixed(1)} ({p.ratingCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/** A product result — name, selling business, price and rating. */
function ProductCard({ product: p, onPress }: { product: ProductSearchResult; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.avatar}>
        {p.imageUrl ? (
          <Image source={{ uri: p.imageUrl }} style={styles.avatarImg} />
        ) : (
          <ShoppingBag size={22} color={Color.primary} />
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {p.name}
          </Text>
          {p.provider.isVerified && <BadgeCheck size={15} color={Color.success} />}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {p.provider.businessName}
          {p.provider.city ? ` · ${p.provider.city}` : ''}
        </Text>
        <Text style={[styles.price, styles.standalonePrice]}>
          {unitPriceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}
        </Text>
        {!!p.ratingCount && (
          <View style={styles.ratingRow}>
            <Star size={13} color={Color.warning} fill={Color.warning} />
            <Text style={styles.ratingText}>
              {(p.ratingAvg ?? 0).toFixed(1)} ({p.ratingCount})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/** A service result — name, offering business, price/duration and the business's rating. */
function ServiceCard({ service: s, onPress }: { service: ServiceSearchResult; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.avatar}>
        <CategoryIcon slug={s.category.slug} size={24} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {s.name}
          </Text>
          {s.provider.isVerified && <BadgeCheck size={15} color={Color.success} />}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {s.provider.businessName}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatMoney(s.priceMinor, s.currency)}</Text>
          <View style={styles.durationChip}>
            <Clock size={11} color={Color.textSecondary} />
            <Text style={styles.durationText}>{s.durationMin} min</Text>
          </View>
        </View>
        {!!s.provider.ratingCount && (
          <View style={styles.ratingRow}>
            <Star size={13} color={Color.warning} fill={Color.warning} />
            <Text style={styles.ratingText}>
              {s.provider.ratingAvg.toFixed(1)} ({s.provider.ratingCount})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/** Provider/service/product search — a type toggle up top, nothing else in the way. */
export default function SearchScreen() {
  const {
    query,
    setQuery,
    type,
    selectType,
    locationLabel,
    goToLocationPicker,
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

  const trimmed = query.trim();

  return (
    <View style={styles.container}>
      <AppHeader title="Search" />

      {/* What to search for — the one filter that's always visible */}
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

      <View style={styles.searchBar}>
        <Search size={18} color={Color.placeholder} />
        <TextInput
          style={styles.searchInput}
          placeholder={PLACEHOLDER[type]}
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

      {/* Nothing to browse without a search — show history instead */}
      {trimmed.length === 0 ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {recentSearches.length === 0 && recentSearchViews.length === 0 ? (
            <View style={styles.center}>
              <Search size={44} color={Color.placeholder} strokeWidth={1.4} />
              <Text style={styles.hint}>Search for a business, service or product.</Text>
            </View>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <View>
                  <View style={styles.historyHeader}>
                    <Text style={styles.sectionTitle}>Recent searches</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={styles.clearLink}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.wrapRow}>
                    {recentSearches.map((term) => (
                      <TouchableOpacity
                        key={term}
                        style={styles.chip}
                        activeOpacity={0.85}
                        onPress={() => onRecentSearchPress(term)}
                      >
                        <Clock size={12} color={Color.textSecondary} />
                        <Text style={styles.chipText}>{term}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {recentSearchViews.length > 0 && (
                <View>
                  <View style={styles.historyHeader}>
                    <Text style={styles.sectionTitle}>Recently viewed</Text>
                    <TouchableOpacity onPress={clearRecentSearchViews}>
                      <Text style={styles.clearLink}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearchViews.map((entry) => {
                    const key = `${entry.kind}-${entry.item.id}`;
                    if (entry.kind === 'product') {
                      return (
                        <ProductCard
                          key={key}
                          product={entry.item}
                          onPress={() => onRecentViewPress(entry)}
                        />
                      );
                    }
                    if (entry.kind === 'service') {
                      return (
                        <ServiceCard
                          key={key}
                          service={entry.item}
                          onPress={() => onRecentViewPress(entry)}
                        />
                      );
                    }
                    return (
                      <ProviderCard
                        key={key}
                        provider={entry.item}
                        onPress={() => onRecentViewPress(entry)}
                      />
                    );
                  })}
                </View>
              )}
            </>
          )}
        </ScrollView>
      ) : !hasActiveQuery ? (
        <View style={styles.center}>
          <Search size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>Type at least {minQueryLength} characters to search.</Text>
        </View>
      ) : isFetching && resultCount === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : resultCount === 0 ? (
        <View style={styles.center}>
          <Search size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>
            {isProductSearch
              ? 'No products match your search.'
              : isServiceSearch
                ? 'No services match your search.'
                : isAllSearch
                  ? 'Nothing matches your search.'
                  : 'No businesses match your search.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isAllSearch ? (
            <>
              {providers.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>Businesses</Text>
                  {providers.map((p) => (
                    <ProviderCard key={p.id} provider={p} onPress={() => onProviderPress(p)} />
                  ))}
                </View>
              )}
              {services.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>Services</Text>
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} onPress={() => onServicePress(s)} />
                  ))}
                </View>
              )}
              {products.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>Products</Text>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} onPress={() => onProductPress(p)} />
                  ))}
                </View>
              )}
            </>
          ) : isServiceSearch ? (
            services.map((s) => <ServiceCard key={s.id} service={s} onPress={() => onServicePress(s)} />)
          ) : isProductSearch ? (
            products.map((p) => <ProductCard key={p.id} product={p} onPress={() => onProductPress(p)} />)
          ) : (
            providers.map((p) => <ProviderCard key={p.id} provider={p} onPress={() => onProviderPress(p)} />)
          )}
        </ScrollView>
      )}
    </View>
  );
}
