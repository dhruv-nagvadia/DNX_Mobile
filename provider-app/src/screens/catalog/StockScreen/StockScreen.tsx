import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { measureUnits, stockLabel } from '@/utils/units';

import { useStockScreen } from './useStockScreen';
import { REASON_OPTIONS } from './types';
import { styles } from './styles';

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

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Update stock</Text>

          {!selected ? (
            <>
              <AppInput
                label="Find a product"
                placeholder="Search by name"
                value={search}
                onChangeText={setSearch}
              />
              {results.map((p) => (
                <TouchableOpacity key={p.id} style={styles.resultCard} onPress={() => selectProduct(p)}>
                  <View>
                    <Text style={styles.resultName}>{p.name}</Text>
                    <Text style={styles.resultMeta}>
                      {p.unlimitedStock ? (p.stockQty > 0 ? 'Available' : 'Unavailable') : stockLabel(p.stockQty, p.measure)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.selectedCard}>
              <View style={styles.selectedHeader}>
                <Text style={styles.selectedName}>{selected.name}</Text>
                <TouchableOpacity onPress={clearSelection}>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>

              {selected.unlimitedStock ? (
                <>
                  <Text style={styles.resultMeta}>
                    Made to order — currently {selected.stockQty > 0 ? 'available' : 'unavailable'}.
                  </Text>
                  <AppButton
                    title={selected.stockQty > 0 ? 'Mark unavailable' : 'Mark available'}
                    variant={selected.stockQty > 0 ? 'secondary' : 'primary'}
                    loading={saving}
                    onPress={() => toggleAvailability(!(selected.stockQty > 0))}
                  />
                </>
              ) : (
                <>
                  <View style={styles.segment}>
                    <TouchableOpacity
                      style={[styles.segmentBtn, direction === 'add' && styles.segmentBtnActive]}
                      onPress={() => setDirection('add')}
                    >
                      <Text style={[styles.segmentText, direction === 'add' && styles.segmentTextActive]}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segmentBtn, direction === 'remove' && styles.segmentBtnActive]}
                      onPress={() => setDirection('remove')}
                    >
                      <Text style={[styles.segmentText, direction === 'remove' && styles.segmentTextActive]}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.field}>
                      <AppInput label="Amount" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.resultMeta}>Unit</Text>
                      <View style={styles.segment}>
                        {measureUnits(selected.measure).map((u) => (
                          <TouchableOpacity
                            key={u.value}
                            style={[styles.segmentBtn, unit === u.value && styles.segmentBtnActive]}
                            onPress={() => setUnit(u.value)}
                          >
                            <Text style={[styles.segmentText, unit === u.value && styles.segmentTextActive]}>
                              {u.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <Text style={styles.resultMeta}>Reason (optional)</Text>
                  <View style={styles.reasonRow}>
                    {REASON_OPTIONS.map((r) => (
                      <TouchableOpacity
                        key={r.value}
                        style={[styles.reasonChip, reason === r.value && styles.reasonChipActive]}
                        onPress={() => setReason(r.value)}
                      >
                        <Text style={[styles.reasonText, reason === r.value && styles.reasonTextActive]}>
                          {r.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <AppInput label="Note" hint="Optional" value={note} onChangeText={setNote} />

                  {!!error && <Text style={styles.errorText}>{error}</Text>}

                  <AppButton title="Save" loading={saving} onPress={submitAdjustment} />

                  <TouchableOpacity style={styles.outOfStockLink} onPress={() => markOutOfStock(selected)}>
                    <Text style={styles.outOfStockText}>Mark out of stock</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
