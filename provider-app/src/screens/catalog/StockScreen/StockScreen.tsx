import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Ban,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  History,
  Layers,
  Minus,
  Package,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { Measure, Product, StockAdjustment } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatAmount, measureUnits, priceLabel, toBase } from '@/utils/units';

import { isLow, isOut, StockFilter, useStockScreen } from './useStockScreen';
import { REASON_OPTIONS } from './types';
import { BRAND_BLUE, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FILTERS: { key: StockFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low stock' },
  { key: 'out', label: 'Out of stock' },
];

const round = (x: number) => parseFloat(x.toFixed(3));

/** "piece" reads as "pcs" in the unit picker, matching `formatAmount`. */
const unitLabel = (value: string, label: string) => (value === 'piece' ? 'pcs' : label);

/** "Oct 30, 10:15 AM" */
function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const h = d.getHours();
  const hh = String(h % 12 === 0 ? 12 : h % 12).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${hh}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}

function stockColors(p: Product): PillColors {
  if (isOut(p)) {
    return PILL.red;
  }
  return isLow(p) ? PILL.orange : PILL.green;
}

/** Pill on a product in the pick list. */
function listPill(p: Product): { label: string; colors: PillColors } {
  if (p.unlimitedStock) {
    return p.stockQty > 0 ? { label: 'Available', colors: PILL.green } : { label: 'Unavailable', colors: PILL.red };
  }
  if (isOut(p)) {
    return { label: 'Out of stock', colors: PILL.red };
  }
  return { label: formatAmount(p.stockQty, p.measure), colors: stockColors(p) };
}

/** Pill on the selected product. */
function currentPill(p: Product): { label: string; colors: PillColors } {
  if (p.unlimitedStock) {
    return {
      label: `Made to order • ${p.stockQty > 0 ? 'Available' : 'Unavailable'}`,
      colors: stockColors(p),
    };
  }
  return { label: `Current stock: ${formatAmount(Math.max(0, p.stockQty), p.measure)}`, colors: stockColors(p) };
}

function productMeta(p: Product): string {
  const group = p.section?.trim() || p.productType?.name?.trim();
  return [group, priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)].filter(Boolean).join('  •  ');
}

function Thumb({ product, large }: { product: Product; large?: boolean }) {
  const style = large ? styles.thumbLarge : styles.thumb;
  if (product.imageUrl) {
    return <Image source={{ uri: product.imageUrl }} style={style} />;
  }
  return (
    <View style={[style, styles.thumbFallback]}>
      <Package size={large ? 30 : 20} color={Color.placeholder} strokeWidth={1.6} />
    </View>
  );
}

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

function ChangeRow({ item }: { item: StockAdjustment }) {
  const up = item.delta > 0;
  const measure: Measure = item.product.measure;
  const reasonText = REASON_OPTIONS.find((r) => r.value === item.reason)?.label;
  const meta = [reasonText, formatWhen(item.createdAt)].filter(Boolean).join('  •  ');
  return (
    <View style={styles.changeRow}>
      <View style={[styles.changeIcon, up ? styles.changeIconUp : styles.changeIconDown]}>
        {up ? (
          <ArrowUp size={20} color={PILL.green.fg} strokeWidth={2.2} />
        ) : (
          <ArrowDown size={20} color={Color.error} strokeWidth={2.2} />
        )}
      </View>
      <View style={styles.changeMain}>
        <Text style={styles.changeName} numberOfLines={1}>
          {item.product.name}
        </Text>
        {!!meta && (
          <Text style={styles.mutedText} numberOfLines={1}>
            {meta}
          </Text>
        )}
      </View>
      <View style={styles.changeSide}>
        <Text style={up ? styles.deltaUp : styles.deltaDown}>
          {`${up ? '+' : '−'}${formatAmount(Math.abs(item.delta), measure)}`}
        </Text>
        {item.stockAfter !== null && (
          <Text style={styles.mutedText}>{`→ ${formatAmount(item.stockAfter, measure)}`}</Text>
        )}
      </View>
    </View>
  );
}

export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const {
    businessName,
    products,
    counts,
    isLoading,
    refreshing,
    refresh,
    goBack,
    search,
    setSearch,
    filter,
    setFilter,
    results,
    selected,
    selectProduct,
    clearSelection,
    direction,
    setDirection,
    amount,
    setAmount,
    unit,
    setUnit,
    reason,
    setReason,
    note,
    setNote,
    error,
    saving,
    toggleAvailability,
    markOutOfStock,
    submitAdjustment,
    adjustments,
    historyLoading,
    showAllHistory,
    toggleShowAllHistory,
  } = useStockScreen();

  const [reasonOpen, setReasonOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  // The product list shows until a product is picked, and again whenever
  // the provider types a new search on top of a selection.
  const showResults = !selected || search.trim().length > 0;
  const hasProducts = products.length > 0;
  const countLabel = `${products.length} product${products.length === 1 ? '' : 's'}`;

  const pick = (p: Product) => {
    setSearch('');
    setReasonOpen(false);
    setUnitOpen(false);
    selectProduct(p);
  };

  const step = (dir: 1 | -1) => {
    const current = Number(amount);
    const base = Number.isFinite(current) ? current : 0;
    setAmount(String(Math.max(0, round(base + dir))));
  };

  const reasonLabel = REASON_OPTIONS.find((r) => r.value === reason)?.label ?? 'Select a reason';
  const units = selected ? measureUnits(selected.measure) : [];
  const activeUnit = units.find((u) => u.value === unit) ?? units[0];

  // Live "New stock will be …" preview, in the product's base unit.
  let preview: { text: string; warn: boolean } | null = null;
  const qty = Number(amount);
  if (selected && !selected.unlimitedStock && amount.trim() && Number.isFinite(qty) && qty > 0) {
    const current = Math.max(0, selected.stockQty);
    const change = toBase(qty, selected.measure, unit);
    const next = direction === 'add' ? current + change : current - change;
    preview =
      next < 0
        ? { text: `Only ${formatAmount(current, selected.measure)} in stock — can't remove more`, warn: true }
        : { text: `New stock will be ${formatAmount(round(next), selected.measure)}`, warn: false };
  }

  const showFooter = !!selected && !selected.unlimitedStock;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Manage Stock
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {businessName ? `${businessName}  •  ${countLabel}` : countLabel}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {isLoading ? (
            <ActivityIndicator style={styles.loading} color={BRAND_BLUE} />
          ) : !hasProducts ? (
            <EmptyState
              icon={<Package size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="No products yet"
              body="Add products to your catalog to manage their stock."
            />
          ) : (
            <>
              <View style={styles.tiles}>
                <SummaryTile
                  label="In stock"
                  value={counts.inStock}
                  theme={TINT.mint}
                  icon={<CircleCheck size={28} color={TINT.mint.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Low stock"
                  value={counts.low}
                  theme={TINT.peach}
                  icon={<TriangleAlert size={28} color={TINT.peach.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Out of stock"
                  value={counts.out}
                  theme={TINT.pink}
                  icon={<Ban size={28} color={TINT.pink.icon} strokeWidth={1.8} />}
                />
              </View>

              {/* ── Select Product ─────────────────────────────────────── */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Box size={24} color={INK} strokeWidth={1.8} />
                  <Text style={styles.cardTitle}>Select Product</Text>
                </View>

                <View style={styles.search}>
                  <Search size={20} color={INK} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search a product..."
                    placeholderTextColor={Color.placeholder}
                    value={search}
                    onChangeText={setSearch}
                    returnKeyType="search"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                  />
                </View>

                <View style={styles.chips}>
                  {FILTERS.map((f) => {
                    const active = filter === f.key;
                    return (
                      <TouchableOpacity
                        key={f.key}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setFilter(f.key)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {showResults ? (
                  results.length === 0 ? (
                    <Text style={styles.mutedText}>
                      {search.trim() ? `No products match “${search.trim()}”.` : 'No products in this filter.'}
                    </Text>
                  ) : (
                    <View>
                      {results.map((p, i) => {
                        const pill = listPill(p);
                        return (
                          <View key={p.id}>
                            {i > 0 && <View style={styles.divider} />}
                            <TouchableOpacity style={styles.resultRow} onPress={() => pick(p)} activeOpacity={0.7}>
                              <Thumb product={p} />
                              <View style={styles.resultMain}>
                                <Text style={styles.resultName} numberOfLines={1}>
                                  {p.name}
                                </Text>
                                <Pill label={pill.label} colors={pill.colors} />
                              </View>
                              <ChevronRight size={18} color={Color.placeholder} />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )
                ) : (
                  selected && (
                    <View style={styles.selectedBox}>
                      <Thumb product={selected} large />
                      <View style={styles.selectedMain}>
                        <Text style={styles.selectedName} numberOfLines={2}>
                          {selected.name}
                        </Text>
                        <Text style={styles.mutedText} numberOfLines={1}>
                          {productMeta(selected)}
                        </Text>
                        <Pill {...currentPill(selected)} style={styles.stockPill} />
                      </View>
                      <TouchableOpacity
                        style={styles.linkRow}
                        onPress={clearSelection}
                        hitSlop={HIT_SLOP}
                        accessibilityRole="button"
                        accessibilityLabel="Change product"
                      >
                        <Text style={styles.linkText}>Change</Text>
                        <ChevronRight size={18} color={BRAND_BLUE} strokeWidth={2.2} />
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>

              {/* ── Adjust Stock ───────────────────────────────────────── */}
              {!!selected && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Layers size={24} color={BRAND_BLUE} strokeWidth={1.8} />
                    <Text style={styles.cardTitle}>Adjust Stock</Text>
                  </View>

                  {selected.unlimitedStock ? (
                    <View style={styles.availRow}>
                      <View style={styles.availText}>
                        <Text style={styles.label}>Available to customers</Text>
                        <Text style={styles.mutedText}>
                          Made to order — currently {selected.stockQty > 0 ? 'available' : 'unavailable'}.
                        </Text>
                      </View>
                      {saving ? (
                        <ActivityIndicator color={BRAND_BLUE} />
                      ) : (
                        <Switch
                          value={selected.stockQty > 0}
                          onValueChange={toggleAvailability}
                          trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
                          thumbColor={Color.white}
                          ios_backgroundColor={SWITCH_OFF}
                          accessibilityLabel={`${selected.name} available`}
                        />
                      )}
                    </View>
                  ) : (
                    <>
                      <View style={styles.segment}>
                        {(['add', 'remove'] as const).map((d) => {
                          const active = direction === d;
                          const color = active ? Color.white : INK;
                          return (
                            <TouchableOpacity
                              key={d}
                              style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                              onPress={() => setDirection(d)}
                              activeOpacity={0.8}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                            >
                              {d === 'add' ? (
                                <Plus size={20} color={color} strokeWidth={2.2} />
                              ) : (
                                <Minus size={20} color={color} strokeWidth={2.2} />
                              )}
                              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                                {d === 'add' ? 'Add Stock' : 'Remove Stock'}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.label}>
                          Quantity <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.qtyRow}>
                          <View style={styles.stepper}>
                            <TouchableOpacity
                              style={styles.stepBtn}
                              onPress={() => step(-1)}
                              accessibilityRole="button"
                              accessibilityLabel="Decrease quantity"
                            >
                              <Minus size={22} color={INK} />
                            </TouchableOpacity>
                            <TextInput
                              style={styles.stepInput}
                              keyboardType="decimal-pad"
                              value={amount}
                              onChangeText={setAmount}
                              placeholder="0"
                              placeholderTextColor={Color.placeholder}
                              textAlign="center"
                            />
                            <TouchableOpacity
                              style={styles.stepBtn}
                              onPress={() => step(1)}
                              accessibilityRole="button"
                              accessibilityLabel="Increase quantity"
                            >
                              <Plus size={22} color={INK} />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={[styles.unitSelect, units.length <= 1 && styles.unitSelectDisabled]}
                            disabled={units.length <= 1}
                            onPress={() => {
                              setReasonOpen(false);
                              setUnitOpen((o) => !o);
                            }}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Choose unit"
                          >
                            <Text style={styles.selectText}>
                              {activeUnit ? unitLabel(activeUnit.value, activeUnit.label) : ''}
                            </Text>
                            {units.length > 1 && <ChevronDown size={20} color={INK} />}
                          </TouchableOpacity>
                        </View>
                        {unitOpen && (
                          <View style={[styles.dropdown, styles.unitMenu]}>
                            {units.map((u, i) => {
                              const active = unit === u.value;
                              return (
                                <View key={u.value}>
                                  {i > 0 && <View style={styles.divider} />}
                                  <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                      setUnit(u.value);
                                      setUnitOpen(false);
                                    }}
                                  >
                                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                                      {unitLabel(u.value, u.label)}
                                    </Text>
                                    {active && <Check size={18} color={BRAND_BLUE} />}
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        )}
                        {!!preview && (
                          <Text style={preview.warn ? styles.helperWarn : styles.helperOk}>{preview.text}</Text>
                        )}
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.label}>
                          Reason <Text style={styles.required}>*</Text>
                        </Text>
                        <TouchableOpacity
                          style={styles.select}
                          onPress={() => {
                            setUnitOpen(false);
                            setReasonOpen((o) => !o);
                          }}
                          activeOpacity={0.8}
                          accessibilityRole="button"
                          accessibilityLabel="Choose reason"
                        >
                          <Text style={styles.selectText}>{reasonLabel}</Text>
                          <ChevronDown size={20} color={INK} />
                        </TouchableOpacity>
                        {reasonOpen && (
                          <View style={styles.dropdown}>
                            {REASON_OPTIONS.map((r, i) => {
                              const active = reason === r.value;
                              return (
                                <View key={r.value}>
                                  {i > 0 && <View style={styles.divider} />}
                                  <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                      setReason(r.value);
                                      setReasonOpen(false);
                                    }}
                                  >
                                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                                      {r.label}
                                    </Text>
                                    {active && <Check size={18} color={BRAND_BLUE} />}
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.label}>
                          Note <Text style={styles.optional}>(optional)</Text>
                        </Text>
                        <TextInput
                          style={styles.noteInput}
                          value={note}
                          onChangeText={setNote}
                          placeholder="e.g. Received new stock from supplier"
                          placeholderTextColor={Color.placeholder}
                          multiline
                          textAlignVertical="top"
                        />
                      </View>

                      {!!error && <Text style={styles.errorText}>{error}</Text>}
                    </>
                  )}
                </View>
              )}
            </>
          )}

          {/* ── Recent changes ─────────────────────────────────────────── */}
          {!isLoading && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <History size={24} color={INK} strokeWidth={1.8} />
                <Text style={styles.cardTitle}>Recent changes</Text>
                {(showAllHistory || adjustments.length >= 3) && (
                  <TouchableOpacity
                    style={styles.linkRow}
                    onPress={toggleShowAllHistory}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                  >
                    <Text style={styles.linkText}>{showAllHistory ? 'Show less' : 'View all'}</Text>
                    {!showAllHistory && <ChevronRight size={18} color={BRAND_BLUE} strokeWidth={2.2} />}
                  </TouchableOpacity>
                )}
              </View>
              {historyLoading ? (
                <ActivityIndicator color={BRAND_BLUE} />
              ) : adjustments.length === 0 ? (
                <Text style={styles.mutedText}>No stock changes yet.</Text>
              ) : (
                <View>
                  {adjustments.map((a, i) => (
                    <View key={a.id}>
                      {i > 0 && <View style={styles.divider} />}
                      <ChangeRow item={a} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {showFooter && selected && (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            <TouchableOpacity
              style={[styles.primaryBtn, saving && styles.btnDisabled]}
              disabled={saving}
              onPress={submitAdjustment}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {saving ? (
                <ActivityIndicator color={Color.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Update Stock</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dangerBtn, saving && styles.btnDisabled]}
              disabled={saving}
              onPress={() => markOutOfStock(selected)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Ban size={22} color={Color.error} strokeWidth={2} />
              <Text style={styles.dangerBtnText}>Mark as Out of Stock</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
