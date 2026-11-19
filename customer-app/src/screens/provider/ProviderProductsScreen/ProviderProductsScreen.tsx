import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingBag, X } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { StoreProductCard } from '@/components/StoreProductCard';
import { Product } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';
import { ACTION, INK, ModernSize } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';

import { useProviderProductsScreen } from './useProviderProductsScreen';
import { ProviderProductsNavigationProp } from './types';
import { styles, MUTED } from './styles';

const GRID_GAP = 10;

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Show ${label}`}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * A store's product catalog — a flat grid for one category tile / section, or
 * the full catalog grouped by section (with a chip per section) when opened
 * from "View all products". Mockup look: "FreshMart Kirana Grocery App UI.png".
 */
export default function ProviderProductsScreen() {
  const navigation = useNavigation<ProviderProductsNavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const {
    title,
    subtitle,
    businessName,
    provider,
    isLoading,
    groups,
    groupChips,
    activeGroup,
    setActiveGroup,
    products,
    count,
    query,
    setQuery,
    searching,
    results,
    cartCount,
    cartTotal,
  } = useProviderProductsScreen();

  const cardW = Math.floor((width - ModernSize.gutter * 2 - GRID_GAP) / 2);

  const renderCard = (p: Product) => (
    <StoreProductCard
      key={p.id}
      product={p}
      providerId={provider!.id}
      providerName={provider!.businessName}
      categorySlug={provider!.category.slug}
      depositPercent={provider!.depositPercent}
      width={cardW}
      onPress={() =>
        navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: provider!.id, productId: p.id })
      }
    />
  );

  const renderBody = () => {
    if (searching) {
      return (
        <>
          <Text style={styles.resultsTitle}>
            {results.length} {results.length === 1 ? 'result' : 'results'} for “{query.trim()}”
          </Text>
          {results.length === 0 ? (
            <Text style={styles.muted}>No products match. Try another word.</Text>
          ) : (
            <View style={styles.grid}>{results.map(renderCard)}</View>
          )}
        </>
      );
    }
    if (groups) {
      return groups.map((g) => (
        <View key={g.section} style={styles.group}>
          <View style={styles.groupHead}>
            <Text style={styles.groupTitle} numberOfLines={1} accessibilityRole="header">
              {g.section}
            </Text>
            {g.hasCoupon && (
              <View style={styles.dealTag}>
                <Text style={styles.dealTagText}>Deal</Text>
              </View>
            )}
            <Text style={styles.groupCount}>{g.items.length}</Text>
          </View>
          <View style={styles.grid}>{g.items.map(renderCard)}</View>
        </View>
      ));
    }
    return <View style={styles.grid}>{products.map(renderCard)}</View>;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={title} subtitle={isLoading ? businessName : subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={ACTION} />
        </View>
      ) : !provider || count === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <ShoppingBag size={30} color={MUTED} strokeWidth={1.6} />
          </View>
          <Text style={styles.emptyTitle}>No products yet</Text>
          <Text style={styles.hint}>This store hasn’t added anything here. Check back soon.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, cartCount > 0 && styles.contentWithBar]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Search ─────────────────────────────────────────────────── */}
          <View style={styles.search}>
            <Search size={20} color={INK} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder={businessName ? `Search in ${businessName}` : 'Search products'}
              placeholderTextColor={MUTED}
              returnKeyType="search"
              autoCorrect={false}
              accessibilityLabel="Search products"
            />
            {!!query && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <X size={18} color={MUTED} />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Section chips (full catalog only) ──────────────────────── */}
          {groupChips.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsBleed}
              contentContainerStyle={styles.chips}
            >
              <Chip label="All" active={!activeGroup} onPress={() => setActiveGroup(null)} />
              {groupChips.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  active={activeGroup === name}
                  onPress={() => setActiveGroup(activeGroup === name ? null : name)}
                />
              ))}
            </ScrollView>
          )}

          {renderBody()}
        </ScrollView>
      )}

      {/* ── Sticky cart bar (this store's lines) ───────────────────────── */}
      {cartCount > 0 && (
        <View style={[styles.cartBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>
              {cartCount} item{cartCount > 1 ? 's' : ''}
            </Text>
            <Text style={styles.cartTotal} numberOfLines={1}>
              {formatMoney(cartTotal)}
              {businessName ? ` • ${businessName}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(ROUTES.CART)}
            accessibilityRole="button"
            accessibilityLabel="View cart"
          >
            <ShoppingBag size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.checkoutText}>View cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
