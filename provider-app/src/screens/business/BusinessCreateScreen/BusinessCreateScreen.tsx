import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { AppInput } from '@/components/AppInput';
import { Color } from '@/utils/Theme';

import { useBusinessCreateScreen } from './useBusinessCreateScreen';
import { styles } from './styles';

const DESCRIPTION_MAX_LENGTH = 500;

const STEP_COPY: Record<string, { label: string; title: string; subtitle?: string }> = {
  type: {
    label: 'Type',
    title: 'What kind of business is this?',
    subtitle: "Decides what customers see and how they'll book you.",
  },
  details: {
    label: 'Details',
    title: 'Business details',
  },
  payments: {
    label: 'Payments',
    title: 'How customers can pay',
    subtitle: 'You can change these any time from the business page.',
  },
  location: {
    label: 'Location',
    title: 'Where are you?',
    subtitle: 'All fields are optional.',
  },
};

export default function BusinessCreateScreen() {
  const {
    step,
    stepId,
    steps,
    isLastStep,
    next,
    back,
    form,
    onChange,
    setType,
    setCategory,
    categoriesForType,
    subcategories,
    errors,
    serverError,
    saving,
    submit,
  } = useBusinessCreateScreen();

  const copy = STEP_COPY[stepId];
  const depositPreview = Number(form.depositPercent) > 0 ? Number(form.depositPercent) : 20;

  return (
    <View style={styles.root}>
      <AppHeader title="Add a business" />

      <View style={styles.stepper}>
        {steps.map((id, i) => (
          <View key={id} style={[styles.stepDot, i <= step && styles.stepDotActive]} />
        ))}
      </View>
      <Text style={styles.stepMeta}>
        Step {step + 1} of {steps.length} · {copy.label}
      </Text>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>{copy.title}</Text>
          {!!copy.subtitle && <Text style={styles.stepSubtitle}>{copy.subtitle}</Text>}
          {!!serverError && <Text style={styles.errorText}>{serverError}</Text>}

          <View style={styles.card}>
            {stepId === 'type' && (
              <>
                <Text style={styles.label}>Business model</Text>
                <View style={styles.segment}>
                  <TouchableOpacity
                    style={[styles.segmentBtn, form.type === 'SERVICE' && styles.segmentBtnActive]}
                    onPress={() => setType('SERVICE')}
                  >
                    <Text style={[styles.segmentText, form.type === 'SERVICE' && styles.segmentTextActive]}>
                      Service — bookings
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.segmentBtn, form.type === 'STORE' && styles.segmentBtnActive]}
                    onPress={() => setType('STORE')}
                  >
                    <Text style={[styles.segmentText, form.type === 'STORE' && styles.segmentTextActive]}>
                      Store — orders
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>{form.type === 'STORE' ? 'Store category' : 'Service category'}</Text>
                {categoriesForType.length === 0 ? (
                  <Text style={styles.emptyHint}>Loading categories…</Text>
                ) : (
                  <View style={styles.chipRow}>
                    {categoriesForType.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.chip, form.categoryId === c.id && styles.chipActive]}
                        onPress={() => setCategory(c.id)}
                      >
                        <Text style={[styles.chipText, form.categoryId === c.id && styles.chipTextActive]}>
                          {c.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {!!errors.categoryId && <Text style={styles.fieldError}>{errors.categoryId}</Text>}

                {subcategories.length > 0 && (
                  <>
                    <Text style={styles.label}>Specific business type</Text>
                    <View style={styles.chipRow}>
                      {subcategories.map((s) => (
                        <TouchableOpacity
                          key={s.id}
                          style={[styles.chip, form.subcategoryId === s.id && styles.chipActive]}
                          onPress={() => onChange('subcategoryId', form.subcategoryId === s.id ? '' : s.id)}
                        >
                          <Text style={[styles.chipText, form.subcategoryId === s.id && styles.chipTextActive]}>
                            {s.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {!!errors.subcategoryId && <Text style={styles.fieldError}>{errors.subcategoryId}</Text>}
                  </>
                )}
              </>
            )}

            {stepId === 'details' && (
              <>
                <AppInput
                  label="Business name"
                  value={form.businessName}
                  onChangeText={(v) => onChange('businessName', v)}
                  error={errors.businessName}
                />
                <AppInput
                  label="Business phone"
                  keyboardType="phone-pad"
                  prefix="+91"
                  value={form.phone}
                  onChangeText={(v) => onChange('phone', v)}
                  error={errors.phone}
                />
                <AppInput
                  label="Business email"
                  hint="Optional"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(v) => onChange('email', v)}
                  error={errors.email}
                />
                <AppInput
                  label="Description"
                  hint={`Optional — shown to customers · ${form.description.length}/${DESCRIPTION_MAX_LENGTH}`}
                  multiline
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  value={form.description}
                  onChangeText={(v) => onChange('description', v)}
                />
              </>
            )}

            {stepId === 'payments' && (
              <>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleMain}>
                    <Text style={styles.toggleLabel}>Accept partial payment</Text>
                    <Text style={styles.toggleHint}>
                      {form.type === 'STORE'
                        ? 'Customers pay a part now, rest at pickup.'
                        : 'Customers pay a part now, rest at the appointment.'}
                    </Text>
                  </View>
                  <Switch
                    value={form.partialPayEnabled}
                    onValueChange={(v) => onChange('partialPayEnabled', v)}
                    trackColor={{ true: Color.primary, false: Color.border }}
                  />
                </View>

                {form.partialPayEnabled && (
                  <AppInput
                    label="Advance deposit (%)"
                    hint="Leave blank to use the standard 20%."
                    keyboardType="number-pad"
                    value={form.depositPercent}
                    onChangeText={(v) => onChange('depositPercent', v)}
                  />
                )}

                <Text style={styles.example}>
                  On a ₹1,000 {form.type === 'STORE' ? 'order' : 'booking'}, the customer pays ₹
                  {Math.round((1000 * depositPreview) / 100)} now and ₹
                  {1000 - Math.round((1000 * depositPreview) / 100)} in person.
                </Text>

                {form.type === 'STORE' && (
                  <View style={styles.toggleRow}>
                    <View style={styles.toggleMain}>
                      <Text style={styles.toggleLabel}>Accept Cash on Delivery</Text>
                      <Text style={styles.toggleHint}>Customers can pay cash when they pick up.</Text>
                    </View>
                    <Switch
                      value={form.codEnabled}
                      onValueChange={(v) => onChange('codEnabled', v)}
                      trackColor={{ true: Color.primary, false: Color.border }}
                    />
                  </View>
                )}
              </>
            )}

            {stepId === 'location' && (
              <>
                <AppInput
                  label="Address"
                  hint="Optional"
                  value={form.addressLine}
                  onChangeText={(v) => onChange('addressLine', v)}
                />
                <AppInput
                  label="Postal code"
                  hint="Optional"
                  keyboardType="number-pad"
                  value={form.postalCode}
                  onChangeText={(v) => onChange('postalCode', v)}
                />
                <AppInput label="City" hint="Optional" value={form.city} onChangeText={(v) => onChange('city', v)} />
                <AppInput
                  label="State"
                  hint="Optional"
                  value={form.state}
                  onChangeText={(v) => onChange('state', v)}
                />
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.actionBar}>
          <AppButton style={styles.actionButton} title="Back" variant="secondary" onPress={back} disabled={step === 0 || saving} />
          {isLastStep ? (
            <AppButton style={styles.actionButton} title="Create business" loading={saving} onPress={submit} />
          ) : (
            <AppButton style={styles.actionButton} title="Continue" onPress={next} />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
