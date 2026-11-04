import React from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Ban,
  Box,
  CircleCheck,
  Clock,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  TriangleAlert,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Product } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatAmount, priceLabel, stockLabel } from '@/utils/units';

import { ALL_SECTIONS, productGroup, productStock, useProductsScreen } from './useProductsScreen';
import { BRAND_BLUE, STAR, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

function SummaryTile({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: number;
  theme: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue}>{value}</Text>
      </View>
    </View>
  );
}

function stockPill(p: Product): { label: string; colors: PillColors; Icon: typeof Package } {
  switch (productStock(p)) {
    case 'unlimited':
      return { label: 'Made to order', colors: PILL.grey, Icon: Clock };
    case 'out':
      return { label: 'Out of stock', colors: PILL.red, Icon: Ban };
    case 'low':
      return {
        // Count items read naturally without a unit ("Only 6 left"); weights
        // and volumes need one ("Only 500 g left").
        label: `Only ${p.measure === 'count' ? p.stockQty : formatAmount(p.stockQty, p.measure)} left`,
        colors: PILL.orange,
        Icon: TriangleAlert,
      };
    default:
      return { label: stockLabel(p.stockQty, p.measure), colors: PILL.green, Icon: Package };
  }
}

function ProductCard({
  product: p,
  deleting,
  onToggle,
  onEdit,
  onOpen,
  onDelete,
}: {
  product: Product;
  deleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  /** Opens the details screen (whole card is the tap target). */
  onOpen: () => void;
  onDelete: () => void;
}) {
  const active = p.isActive !== false;
  const group = productGroup(p);
  const pill = stockPill(p);
  const PillIcon = pill.Icon;
  const ratingCount = p.ratingCount ?? 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onOpen} activeOpacity={0.85} accessibilityRole="button">
      <View style={styles.cardTop}>
        <View style={styles.cardMain}>
          {p.imageUrl ? (
            <Image source={{ uri: p.imageUrl }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbFallback]}>
              <Package size={28} color={Color.placeholder} strokeWidth={1.6} />
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {p.name}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {[group, priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)].filter(Boolean).join('  •  ')}
            </Text>
            <View style={styles.metaRow}>
              {ratingCount > 0 ? (
                <>
                  <Star size={15} color={STAR} fill={STAR} />
                  <Text style={styles.ratingValue}>{(p.ratingAvg ?? 0).toFixed(1)}</Text>
                  <Text style={styles.meta}>({ratingCount})</Text>
                </>
              ) : (
                <Text style={styles.meta}>No reviews</Text>
              )}
              {p.stepQty > 0 && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    Min. {formatAmount(p.stepQty, p.measure)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.side}>
          <Switch
            value={active}
            onValueChange={onToggle}
            trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
            thumbColor={Color.white}
            ios_backgroundColor={SWITCH_OFF}
            style={styles.switch}
            accessibilityLabel={`${p.name} active`}
          />
          <View style={styles.sideBtns}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={onEdit}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${p.name}`}
            >
              <Pencil size={18} color={BRAND_BLUE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              disabled={deleting}
              onPress={onDelete}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${p.name}`}
            >
              <Trash2 size={18} color={PILL.red.fg} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={[styles.stockPill, { backgroundColor: pill.colors.bg }]}>
          <PillIcon size={16} color={pill.colors.fg} strokeWidth={2.2} />
          <Text style={[styles.stockPillText, { color: pill.colors.fg }]} numberOfLines={1}>
            {pill.label}
          </Text>
        </View>
        <View style={styles.payChips}>
          {p.codEnabled && (
            <View style={styles.payChip}>
              <Text style={styles.payChipText}>COD</Text>
            </View>
          )}
          {p.partialPayEnabled && (
            <View style={styles.payChip}>
              <Text style={styles.payChipText}>Partial</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const {
    businessName,
    products,
    filtered,
    sections,
    counts,
    query,
    setQuery,
    section,
    setSection,
    isLoading,
    refreshing,
    refresh,
    deleting,
    toggleActive,
    remove,
    goBack,
    addProduct,
    editProduct,
    openProduct,
    goToStock,
  } = useProductsScreen();

  const hasProducts = products.length > 0;
  const countLabel = `${products.length} product${products.length === 1 ? '' : 's'}`;

  const confirmDelete = (productId: string, name: string) => {
    Alert.alert('Delete product?', `"${name}" will be removed from your catalog.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(productId) },
    ]);
  };

  const chips = [{ key: ALL_SECTIONS, label: 'All' }, ...sections.map((s) => ({ key: s, label: s }))];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Products
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {businessName ? `${businessName}  •  ${countLabel}` : countLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addProduct}
          accessibilityRole="button"
          accessibilityLabel="Add a product"
        >
          <Plus size={28} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {!hasProducts && !isLoading ? (
          <EmptyState
            icon={<Package size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No products yet"
            body="Add one to start selling."
          />
        ) : (
          hasProducts && (
            <>
              <View style={styles.search}>
                <Search size={20} color={INK} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search products..."
                  placeholderTextColor={Color.placeholder}
                  returnKeyType="search"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chips}
              >
                {chips.map((c) => {
                  const selected = section === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => setSection(c.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.tiles}>
                <SummaryTile
                  label="Active"
                  value={counts.active}
                  theme={TINT.mint}
                  icon={<CircleCheck size={30} color={TINT.mint.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Low stock"
                  value={counts.low}
                  theme={TINT.peach}
                  icon={<TriangleAlert size={30} color={TINT.peach.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Out of stock"
                  value={counts.out}
                  theme={TINT.pink}
                  icon={<Ban size={30} color={TINT.pink.icon} strokeWidth={1.8} />}
                />
              </View>

              {filtered.length === 0 ? (
                <Text style={styles.noMatch}>No products match</Text>
              ) : (
                filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    deleting={deleting}
                    onToggle={() => toggleActive(p)}
                    onEdit={() => editProduct(p.id)}
                    onOpen={() => openProduct(p.id)}
                    onDelete={() => confirmDelete(p.id, p.name)}
                  />
                ))
              )}
            </>
          )
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.stockBtn} onPress={goToStock} activeOpacity={0.8} accessibilityRole="button">
          <Box size={24} color={BRAND_BLUE} strokeWidth={1.8} />
          <Text style={styles.stockBtnText}>Manage Stock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
