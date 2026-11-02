import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ban, Check, ChevronDown, ChevronRight, Minus, Package, Plus, Search } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { ACTION, INK, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatAmount, measureUnits, stockLevel } from '@/utils/units';
import { Product } from '@/redux/api/business/types';

import { useStockScreen } from './useStockScreen';
import { REASON_OPTIONS } from './types';
import { styles } from './styles';

function stockPill(p: Product, prefix: string): { label: string; colors: PillColors } {
  if (p.unlimitedStock) {
    return p.stockQty > 0 ? { label: 'Available', colors: PILL.green } : { label: 'Unavailable', colors: PILL.red };
  }
  const level = stockLevel(p.stockQty, p.stepQty);
  if (level === 'out') {
    return { label: 'Out of Stock', colors: PILL.red };
  }
  return {
    label: `${prefix}${formatAmount(p.stockQty, p.measure)}`,
    colors: level === 'low' ? PILL.yellow : PILL.green,
  };
}

function Thumb({ product, large }: { product: Product; large?: boolean }) {
  const style = large ? styles.thumbLarge : styles.thumb;
  if (product.imageUrl) {
    return <Image source={{ uri: product.imageUrl }} style={style} />;
  }
  return (
    <View style={[style, styles.thumbFallback]}>
      <Package size={large ? 28 : 20} color={TINT.blue.icon} />
    </View>
  );
}

const round = (x: number) => parseFloat(x.toFixed(3));

export default function StockScreen() {
  const {
    search,
    setSearch,
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
  } = useStockScreen();

  const [reasonOpen, setReasonOpen] = useState(false);

  // The product list shows until a product is picked, and again whenever
  // the provider types a new search on top of a selection.
  const showResults = !selected || search.trim().length > 0;

  const pick = (p: Product) => {
    setSearch('');
    setReasonOpen(false);
    selectProduct(p);
  };

  const step = (dir: 1 | -1) => {
    const current = Number(amount);
    const base = Number.isFinite(current) ? current : 0;
    setAmount(String(Math.max(0, round(base + dir))));
  };

  const reasonLabel = REASON_OPTIONS.find((r) => r.value === reason)?.label ?? 'Select a reason';
  const units = selected ? measureUnits(selected.measure) : [];

  return (
    <View style={styles.root}>
      <AppHeader title="Stock" variant="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchBox}>
            <Search size={20} color={Color.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search product..."
              placeholderTextColor={Color.placeholder}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>

          {showResults &&
            (results.length === 0 ? (
              <Text style={styles.emptyText}>No products match “{search.trim()}”.</Text>
            ) : (
              <View style={styles.card}>
                {results.map((p, i) => {
                  const pill = stockPill(p, '');
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
            ))}

          {!!selected && (
            <>
              <View style={styles.selectedRow}>
                <Thumb product={selected} large />
                <View style={styles.selectedMain}>
                  <Text style={styles.selectedName} numberOfLines={2}>
                    {selected.name}
                  </Text>
                  <Pill {...stockPill(selected, 'Current Stock: ')} />
                </View>
                <TouchableOpacity onPress={clearSelection} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>

              {selected.unlimitedStock ? (
                <>
                  <Text style={styles.helpText}>
                    Made to order — currently {selected.stockQty > 0 ? 'available' : 'unavailable'}.
                  </Text>
                  {selected.stockQty > 0 ? (
                    <TouchableOpacity
                      style={styles.dangerBtn}
                      disabled={saving}
                      onPress={() => toggleAvailability(false)}
                      activeOpacity={0.8}
                    >
                      {saving ? (
                        <ActivityIndicator color={Color.error} />
                      ) : (
                        <>
                          <Ban size={20} color={Color.error} />
                          <Text style={styles.dangerBtnText}>Mark Unavailable</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.primaryBtn, saving && styles.btnDisabled]}
                      disabled={saving}
                      onPress={() => toggleAvailability(true)}
                      activeOpacity={0.85}
                    >
                      {saving ? (
                        <ActivityIndicator color={Color.white} />
                      ) : (
                        <Text style={styles.primaryBtnText}>Mark Available</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.segment}>
                    {(['add', 'remove'] as const).map((d) => {
                      const active = direction === d;
                      return (
                        <TouchableOpacity
                          key={d}
                          style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                          onPress={() => setDirection(d)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                            {d === 'add' ? 'Add Stock' : 'Remove Stock'}
                          </Text>
                          {active && <View style={styles.segmentUnderline} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.field}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>
                        Quantity <Text style={styles.required}>*</Text>
                      </Text>
                      {units.length > 1 && (
                        <View style={styles.unitToggle}>
                          {units.map((u) => {
                            const active = unit === u.value;
                            return (
                              <TouchableOpacity
                                key={u.value}
                                style={[styles.unitBtn, active && styles.unitBtnActive]}
                                onPress={() => setUnit(u.value)}
                              >
                                <Text style={[styles.unitText, active && styles.unitTextActive]}>{u.label}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => step(-1)}
                        accessibilityRole="button"
                        accessibilityLabel="Decrease quantity"
                      >
                        <Minus size={20} color={INK} />
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
                        <Plus size={20} color={INK} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      Reason <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.select}
                      onPress={() => setReasonOpen((o) => !o)}
                      activeOpacity={0.8}
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
                                <Text style={[styles.optionText, active && styles.optionTextActive]}>{r.label}</Text>
                                {active && <Check size={18} color={ACTION} />}
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      Note <Text style={styles.optional}>(Optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.noteInput}
                      value={note}
                      onChangeText={setNote}
                      placeholder="e.g. Received new stock from supplier."
                      placeholderTextColor={Color.placeholder}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>

                  {!!error && <Text style={styles.errorText}>{error}</Text>}

                  <TouchableOpacity
                    style={[styles.primaryBtn, saving && styles.btnDisabled]}
                    disabled={saving}
                    onPress={submitAdjustment}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator color={Color.white} />
                    ) : (
                      <Text style={styles.primaryBtnText}>Update Stock</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dangerBtn}
                    disabled={saving}
                    onPress={() => markOutOfStock(selected)}
                    activeOpacity={0.8}
                  >
                    <Ban size={20} color={Color.error} />
                    <Text style={styles.dangerBtnText}>Mark as Out of Stock</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
