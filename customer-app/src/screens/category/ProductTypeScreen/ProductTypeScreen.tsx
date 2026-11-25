import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { ShoppingBag } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { StoreProductCard } from '@/components/StoreProductCard';
import { ACTION, ModernSize } from '@/utils/modernTheme';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useProductTypeScreen } from './useProductTypeScreen';
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

/** One product type pooled across every store. JSX only — logic in useProductTypeScreen. */
export default function ProductTypeScreen() {
  const withBottomInset = useBottomInsetStyle();
  const { width } = useWindowDimensions();
  const { title, subtitle, products, stores, storeId, setStoreId, isFetching, onProductPress } =
    useProductTypeScreen();

  const cardW = Math.floor((width - ModernSize.gutter * 2 - GRID_GAP) / 2);

  return (
    <View style={styles.container}>
      <ScreenHeader title={title} subtitle={subtitle} />

      {isFetching && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={ACTION} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <ShoppingBag size={30} color={MUTED} strokeWidth={1.6} />
          </View>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.stateText}>No products of this type yet — check back soon.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={withBottomInset(styles.content)} showsVerticalScrollIndicator={false}>
          {/* ── Store filter chips (only when several stores sell it) ──── */}
          {stores.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsBleed}
              contentContainerStyle={styles.chips}
            >
              <Chip label="All stores" active={!storeId} onPress={() => setStoreId(null)} />
              {stores.map((s) => (
                <Chip
                  key={s.id}
                  label={s.name}
                  active={storeId === s.id}
                  onPress={() => setStoreId(storeId === s.id ? null : s.id)}
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.grid}>
            {products.map((p) => (
              <StoreProductCard
                key={p.id}
                product={p}
                providerId={p.provider.id}
                providerName={p.provider.businessName}
                width={cardW}
                storeLabel={
                  p.provider.city
                    ? `${p.provider.businessName} · ${p.provider.city}`
                    : p.provider.businessName
                }
                onPress={() => onProductPress(p)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
