import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CalendarDays, Check, Percent, Power, SlidersHorizontal, Tag, Target } from 'lucide-react-native';

import { CouponScope, DiscountType } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { PILL } from '@/utils/modernTheme';
import {
  ActionBar,
  Chip,
  ChipRow,
  Field,
  FieldLabel,
  FormHeader,
  Segmented,
  SectionCard,
  ToggleRow,
} from '@/screens/catalog/ServiceFormScreen/formKit';
import { kit } from '@/screens/catalog/ServiceFormScreen/formKitStyles';

import { OfferPreview } from './OfferPreview';
import { useCouponFormScreen } from './useCouponFormScreen';
import { styles } from './styles';

const TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: 'PERCENT', label: 'Percentage %' },
  { value: 'FLAT', label: 'Flat ₹' },
];

/** Quick expiry picks, in days from today (0 = no expiry). */
const EXPIRY_PRESETS = [
  { days: 0, label: 'No expiry' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local "YYYY-MM-DD" for today + `days` ('' for 0 = no expiry). */
function dateInDays(days: number): string {
  if (!days) {
    return '';
  }
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function CouponFormScreen() {
  const {
    isNew,
    businessName,
    itemScope,
    services,
    products,
    form,
    onChange,
    setScope,
    error,
    saving,
    submit,
  } = useCouponFormScreen();

  const items = itemScope === 'SERVICE' ? services : products;
  const selectedItemId = itemScope === 'SERVICE' ? form.serviceId : form.productId;
  const selectItem = (id: string) => onChange(itemScope === 'SERVICE' ? 'serviceId' : 'productId', id);
  const itemWord = itemScope === 'SERVICE' ? 'service' : 'product';
  const selectedItemName = items.find((i) => i.id === selectedItemId)?.name;

  const scopeOptions: { value: CouponScope; label: string }[] = [
    { value: 'ORDER', label: 'Any order' },
    { value: itemScope, label: `A ${itemWord}` },
  ];

  const isPercent = form.discountType === 'PERCENT';
  const valueInvalid =
    error === 'Enter a valid discount' || error === 'A percentage can’t be over 100';
  const codeInvalid = error === 'Enter a coupon code' || error === 'Code can use letters, numbers, - or _';

  return (
    <View style={kit.root}>
      <FormHeader title={isNew ? 'Add offer' : 'Edit offer'} subtitle={businessName} />
      <KeyboardAvoidingView style={kit.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={kit.flex}
          contentContainerStyle={kit.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OfferPreview form={form} itemScope={itemScope} itemName={selectedItemName} />

          <SectionCard title="Discount" Icon={Percent} tint={PILL.blue}>
            <View style={kit.field}>
              <FieldLabel label="Offer type" />
              <Segmented options={TYPE_OPTIONS} value={form.discountType} onChange={(v) => onChange('discountType', v)} />
            </View>
            <Field
              label={isPercent ? 'Percent off' : 'Amount off'}
              prefix={isPercent ? undefined : '₹'}
              suffix={isPercent ? '%' : undefined}
              keyboardType="decimal-pad"
              placeholder={isPercent ? '20' : '50'}
              invalid={valueInvalid}
              value={form.discountValue}
              onChangeText={(v) => onChange('discountValue', v)}
            />
          </SectionCard>

          <SectionCard title="Code" subtitle="Customers enter this at checkout" Icon={Tag} tint={PILL.lavender}>
            <Field
              label="Code"
              placeholder="e.g. WELCOME50"
              autoCapitalize="characters"
              autoCorrect={false}
              invalid={codeInvalid}
              hint="Letters, numbers, - or _"
              value={form.code}
              onChangeText={(v) => onChange('code', v)}
            />
            <Field
              label="Description"
              optional
              placeholder="Shown to customers"
              value={form.description}
              onChangeText={(v) => onChange('description', v)}
            />
          </SectionCard>

          <SectionCard title="Applies to" Icon={Target} tint={PILL.teal}>
            <Segmented options={scopeOptions} value={form.scope} onChange={setScope} />
            {form.scope !== 'ORDER' &&
              (items.length === 0 ? (
                <Text style={styles.emptyHint}>Add a {itemWord} first to target this offer at it.</Text>
              ) : (
                <View style={styles.pickerList}>
                  {items.map((item) => {
                    const active = selectedItemId === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.pickerRow, active && styles.pickerRowActive]}
                        onPress={() => selectItem(item.id)}
                        activeOpacity={0.8}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                      >
                        <Text style={[styles.pickerText, active && styles.pickerTextActive]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={[styles.radio, active && styles.radioActive]}>
                          {active && <Check size={12} color={Color.white} strokeWidth={3} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
          </SectionCard>

          <SectionCard title="Conditions" Icon={SlidersHorizontal} tint={PILL.orange}>
            {(form.scope === 'ORDER' || isPercent) && (
              <View style={kit.row}>
                {form.scope === 'ORDER' && (
                  <View style={kit.rowItem}>
                    <Field
                      label="Min order"
                      optional
                      prefix="₹"
                      keyboardType="decimal-pad"
                      placeholder="Any"
                      value={form.minOrder}
                      onChangeText={(v) => onChange('minOrder', v)}
                    />
                  </View>
                )}
                {isPercent && (
                  <View style={kit.rowItem}>
                    <Field
                      label="Max discount"
                      optional
                      prefix="₹"
                      keyboardType="decimal-pad"
                      placeholder="No cap"
                      value={form.maxDiscount}
                      onChangeText={(v) => onChange('maxDiscount', v)}
                    />
                  </View>
                )}
              </View>
            )}
            <Field
              label="Usage limit"
              optional
              suffix="uses"
              keyboardType="number-pad"
              placeholder="Unlimited"
              value={form.usageLimit}
              onChangeText={(v) => onChange('usageLimit', v)}
            />
          </SectionCard>

          <SectionCard title="Validity" Icon={CalendarDays} tint={PILL.yellow}>
            <ChipRow>
              {EXPIRY_PRESETS.map((p) => {
                const date = dateInDays(p.days);
                return (
                  <Chip
                    key={p.label}
                    label={p.label}
                    active={form.expiresAt === date}
                    onPress={() => onChange('expiresAt', date)}
                  />
                );
              })}
            </ChipRow>
            <Field
              label="Expires on"
              optional
              hint="YYYY-MM-DD — valid until the end of that day"
              placeholder="2026-12-31"
              keyboardType="numbers-and-punctuation"
              suffix={<CalendarDays size={18} color={Color.textSecondary} strokeWidth={1.8} />}
              value={form.expiresAt}
              onChangeText={(v) => onChange('expiresAt', v)}
            />
          </SectionCard>

          <SectionCard title="Status" Icon={Power} tint={PILL.green}>
            <ToggleRow
              title="Active"
              hint={form.isActive ? 'Customers can use this code' : 'Hidden — customers can’t use it'}
              value={form.isActive}
              onValueChange={(v) => onChange('isActive', v)}
            />
          </SectionCard>
        </ScrollView>
        <ActionBar label={isNew ? 'Create offer' : 'Save offer'} loading={saving} onPress={submit} error={error} />
      </KeyboardAvoidingView>
    </View>
  );
}
