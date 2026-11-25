import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Boxes, IndianRupee, Package, Wallet } from 'lucide-react-native';

import { Measure } from '@/redux/api/business/types';
import { PILL } from '@/utils/modernTheme';
import { MEASURES, SECTION_SUGGESTIONS } from '@/utils/units';
import {
  ActionBar,
  Chip,
  ChipScroller,
  Field,
  FieldLabel,
  FormHeader,
  Segmented,
  SectionCard,
  ToggleRow,
} from '@/screens/catalog/ServiceFormScreen/formKit';
import { kit } from '@/screens/catalog/ServiceFormScreen/formKitStyles';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useProductFormScreen } from './useProductFormScreen';
import { styles } from './styles';

const MEASURE_OPTIONS: { value: Measure; label: string }[] = [
  { value: 'weight', label: 'Weight' },
  { value: 'volume', label: 'Volume' },
  { value: 'count', label: 'Count' },
];

/** "grains, flour, vegetables…" — the examples half of MEASURES' label. */
function measureExamples(measure: Measure): string {
  const label = MEASURES.find((m) => m.value === measure)?.label ?? '';
  const [, examples] = label.split('— ');
  return examples ? `For ${examples}` : '';
}

export default function ProductFormScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    isNew,
    businessName,
    form,
    onChange,
    setMeasure,
    unitOptions,
    error,
    saving,
    codLocked,
    partialPayLocked,
    submit,
  } = useProductFormScreen();

  const unitLabel = unitOptions.find((u) => u.value === form.unit)?.label ?? form.unit;
  const pricePreview =
    form.price.trim() && form.priceQty.trim() ? `Customers see ₹${form.price} / ${form.priceQty} ${unitLabel}` : '';

  return (
    <View style={kit.root}>
      <FormHeader title={isNew ? 'Add product' : 'Edit product'} subtitle={businessName} />
      <KeyboardAvoidingView style={kit.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={kit.flex}
          contentContainerStyle={withBottomInset(kit.content)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionCard title="Basic info" subtitle="What customers will see" Icon={Package} tint={PILL.blue}>
            <Field
              label="Product name"
              placeholder="e.g. Basmati rice"
              invalid={error === 'Enter a product name'}
              value={form.name}
              onChangeText={(v) => onChange('name', v)}
            />
            <Field
              label="Description"
              optional
              multiline
              placeholder="Brand, variety, pack details…"
              value={form.description}
              onChangeText={(v) => onChange('description', v)}
            />
            <Field
              label="Section"
              optional
              placeholder="e.g. Grains & Rice"
              value={form.section}
              onChangeText={(v) => onChange('section', v)}
            />
            <ChipScroller>
              {SECTION_SUGGESTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={form.section === s}
                  onPress={() => onChange('section', form.section === s ? '' : s)}
                />
              ))}
            </ChipScroller>
          </SectionCard>

          <SectionCard title="Pricing" Icon={IndianRupee} tint={PILL.green}>
            <View style={kit.field}>
              <FieldLabel label="Measured by" />
              <Segmented options={MEASURE_OPTIONS} value={form.measure} onChange={setMeasure} />
              {!!measureExamples(form.measure) && <Text style={kit.hint}>{measureExamples(form.measure)}</Text>}
            </View>
            <View style={kit.row}>
              <View style={kit.rowItem}>
                <Field
                  label="Price"
                  prefix="₹"
                  keyboardType="decimal-pad"
                  placeholder="0"
                  invalid={error === 'Enter a valid price'}
                  value={form.price}
                  onChangeText={(v) => onChange('price', v)}
                />
              </View>
              <View style={kit.rowItem}>
                <Field
                  label="For quantity"
                  suffix={unitLabel}
                  keyboardType="decimal-pad"
                  invalid={error === 'Enter a valid quantity'}
                  value={form.priceQty}
                  onChangeText={(v) => onChange('priceQty', v)}
                />
              </View>
            </View>
            <View style={kit.field}>
              <FieldLabel label="Unit" />
              <Segmented
                options={unitOptions.map((u) => ({ value: u.value, label: u.label }))}
                value={form.unit}
                onChange={(v) => onChange('unit', v)}
              />
            </View>
            {!!pricePreview && (
              <View style={styles.preview}>
                <Text style={styles.previewText}>{pricePreview}</Text>
              </View>
            )}
          </SectionCard>

          <SectionCard title="Stock" Icon={Boxes} tint={PILL.orange}>
            <ToggleRow
              title="Track stock quantity"
              hint="Off = made to order / always available"
              value={form.trackStock}
              onValueChange={(v) => onChange('trackStock', v)}
            />
            <View style={kit.row}>
              {form.trackStock && (
                <View style={kit.rowItem}>
                  <Field
                    label="Stock on hand"
                    suffix={unitLabel}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    invalid={error === 'Enter the stock you have'}
                    value={form.stockQty}
                    onChangeText={(v) => onChange('stockQty', v)}
                  />
                </View>
              )}
              <View style={kit.rowItem}>
                <Field
                  label="Minimum order"
                  suffix={unitLabel}
                  keyboardType="decimal-pad"
                  value={form.stepQty}
                  onChangeText={(v) => onChange('stepQty', v)}
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard title="Payments" Icon={Wallet} tint={PILL.lavender}>
            <ToggleRow
              title="Cash on delivery"
              hint={codLocked ? 'Turned off at the business level' : 'Customers can pay when it arrives'}
              value={form.codEnabled}
              onValueChange={(v) => onChange('codEnabled', v)}
              disabled={codLocked}
            />
            <ToggleRow
              divider
              title="Allow partial payment"
              hint={partialPayLocked ? 'Turned off at the business level' : 'Customers can pay part now, the rest later'}
              value={form.partialPayEnabled}
              onValueChange={(v) => onChange('partialPayEnabled', v)}
              disabled={partialPayLocked}
            />
          </SectionCard>
        </ScrollView>
        <ActionBar label={isNew ? 'Add product' : 'Save product'} loading={saving} onPress={submit} error={error} />
      </KeyboardAvoidingView>
    </View>
  );
}
