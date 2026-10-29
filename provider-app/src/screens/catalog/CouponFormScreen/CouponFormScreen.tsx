import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Color } from '@/utils/Theme';

import { useCouponFormScreen } from './useCouponFormScreen';
import { styles } from './styles';

export default function CouponFormScreen() {
  const {
    isNew,
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

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{isNew ? 'Add a coupon' : 'Edit coupon'}</Text>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <AppInput
            label="Code"
            placeholder="e.g. WELCOME50"
            autoCapitalize="characters"
            value={form.code}
            onChangeText={(v) => onChange('code', v)}
          />
          <AppInput
            label="Description"
            hint="Optional — shown to customers"
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
          />

          <Text style={styles.label}>Discount type</Text>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, form.discountType === 'PERCENT' && styles.segmentBtnActive]}
              onPress={() => onChange('discountType', 'PERCENT')}
            >
              <Text style={[styles.segmentText, form.discountType === 'PERCENT' && styles.segmentTextActive]}>
                Percentage
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, form.discountType === 'FLAT' && styles.segmentBtnActive]}
              onPress={() => onChange('discountType', 'FLAT')}
            >
              <Text style={[styles.segmentText, form.discountType === 'FLAT' && styles.segmentTextActive]}>
                Flat amount
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <AppInput
                label={form.discountType === 'PERCENT' ? 'Percent off' : 'Amount off'}
                prefix={form.discountType === 'FLAT' ? '₹' : undefined}
                keyboardType="decimal-pad"
                placeholder={form.discountType === 'PERCENT' ? '20' : '50'}
                value={form.discountValue}
                onChangeText={(v) => onChange('discountValue', v)}
              />
            </View>
            {form.discountType === 'PERCENT' && (
              <View style={styles.field}>
                <AppInput
                  label="Max discount"
                  prefix="₹"
                  hint="Optional"
                  keyboardType="decimal-pad"
                  value={form.maxDiscount}
                  onChangeText={(v) => onChange('maxDiscount', v)}
                />
              </View>
            )}
          </View>

          <Text style={styles.label}>Applies to</Text>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, form.scope === 'ORDER' && styles.segmentBtnActive]}
              onPress={() => setScope('ORDER')}
            >
              <Text style={[styles.segmentText, form.scope === 'ORDER' && styles.segmentTextActive]}>Any order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, form.scope === itemScope && styles.segmentBtnActive]}
              onPress={() => setScope(itemScope)}
            >
              <Text style={[styles.segmentText, form.scope === itemScope && styles.segmentTextActive]}>
                A {itemScope === 'SERVICE' ? 'service' : 'product'}
              </Text>
            </TouchableOpacity>
          </View>

          {form.scope === 'ORDER' ? (
            <AppInput
              label="Minimum order amount"
              prefix="₹"
              hint="Optional — leave blank for any amount"
              keyboardType="decimal-pad"
              value={form.minOrder}
              onChangeText={(v) => onChange('minOrder', v)}
            />
          ) : items.length === 0 ? (
            <Text style={styles.emptyHint}>
              Add a {itemScope === 'SERVICE' ? 'service' : 'product'} first to target this coupon at it.
            </Text>
          ) : (
            <View style={styles.pickerList}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.pickerRow, selectedItemId === item.id && styles.pickerRowActive]}
                  onPress={() => selectItem(item.id)}
                >
                  <Text style={[styles.pickerText, selectedItemId === item.id && styles.pickerTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.field}>
              <AppInput
                label="Expires"
                hint="Optional — YYYY-MM-DD"
                placeholder="2026-12-31"
                value={form.expiresAt}
                onChangeText={(v) => onChange('expiresAt', v)}
              />
            </View>
            <View style={styles.field}>
              <AppInput
                label="Usage limit"
                hint="Optional"
                keyboardType="number-pad"
                placeholder="Unlimited"
                value={form.usageLimit}
                onChangeText={(v) => onChange('usageLimit', v)}
              />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Active</Text>
            <Switch
              value={form.isActive}
              onValueChange={(v) => onChange('isActive', v)}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          <AppButton title={isNew ? 'Add coupon' : 'Save changes'} loading={saving} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
