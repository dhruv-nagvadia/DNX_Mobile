import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Color } from '@/utils/Theme';
import { Measure } from '@/redux/api/business/types';

import { useProductFormScreen } from './useProductFormScreen';
import { styles } from './styles';

const MEASURE_OPTIONS: { value: Measure; label: string }[] = [
  { value: 'weight', label: 'Weight' },
  { value: 'volume', label: 'Volume' },
  { value: 'count', label: 'Count' },
];

export default function ProductFormScreen() {
  const { isNew, form, onChange, setMeasure, unitOptions, error, saving, codLocked, partialPayLocked, submit } =
    useProductFormScreen();

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{isNew ? 'Add a product' : 'Edit product'}</Text>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <AppInput label="Product name" value={form.name} onChangeText={(v) => onChange('name', v)} />
          <AppInput
            label="Description"
            hint="Optional"
            multiline
            style={styles.description}
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
          />
          <AppInput
            label="Section"
            hint="Optional — e.g. Grains & Rice"
            value={form.section}
            onChangeText={(v) => onChange('section', v)}
          />

          <Text style={styles.label}>Measured by</Text>
          <View style={styles.segment}>
            {MEASURE_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.segmentBtn, form.measure === m.value && styles.segmentBtnActive]}
                onPress={() => setMeasure(m.value)}
              >
                <Text style={[styles.segmentText, form.measure === m.value && styles.segmentTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <AppInput
                label="Price"
                prefix="₹"
                keyboardType="decimal-pad"
                value={form.price}
                onChangeText={(v) => onChange('price', v)}
              />
            </View>
            <View style={styles.field}>
              <AppInput
                label="For this quantity"
                keyboardType="decimal-pad"
                value={form.priceQty}
                onChangeText={(v) => onChange('priceQty', v)}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Unit</Text>
              <View style={styles.segment}>
                {unitOptions.map((u) => (
                  <TouchableOpacity
                    key={u.value}
                    style={[styles.segmentBtn, form.unit === u.value && styles.segmentBtnActive]}
                    onPress={() => onChange('unit', u.value)}
                  >
                    <Text style={[styles.segmentText, form.unit === u.value && styles.segmentTextActive]}>
                      {u.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Track stock quantity</Text>
              <Text style={styles.toggleHint}>Off = made to order / always available</Text>
            </View>
            <Switch
              value={form.trackStock}
              onValueChange={(v) => onChange('trackStock', v)}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          {form.trackStock && (
            <AppInput
              label={`Stock on hand (${form.unit})`}
              keyboardType="decimal-pad"
              value={form.stockQty}
              onChangeText={(v) => onChange('stockQty', v)}
            />
          )}

          <AppInput
            label={`Minimum order (${form.unit})`}
            keyboardType="decimal-pad"
            value={form.stepQty}
            onChangeText={(v) => onChange('stepQty', v)}
          />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Cash on delivery</Text>
              {codLocked && <Text style={styles.toggleHint}>Turned off at the business level</Text>}
            </View>
            <Switch
              value={form.codEnabled}
              onValueChange={(v) => onChange('codEnabled', v)}
              disabled={codLocked}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Allow partial payment</Text>
              {partialPayLocked && <Text style={styles.toggleHint}>Turned off at the business level</Text>}
            </View>
            <Switch
              value={form.partialPayEnabled}
              onValueChange={(v) => onChange('partialPayEnabled', v)}
              disabled={partialPayLocked}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          <AppButton title={isNew ? 'Add product' : 'Save changes'} loading={saving} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
