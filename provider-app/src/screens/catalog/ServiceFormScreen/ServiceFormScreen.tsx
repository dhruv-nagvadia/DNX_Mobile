import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Car, FileText, IndianRupee, Wallet } from 'lucide-react-native';

import { PILL } from '@/utils/modernTheme';

import {
  ActionBar,
  Chip,
  ChipRow,
  Field,
  FieldLabel,
  FormHeader,
  SectionCard,
  ToggleRow,
} from './formKit';
import { kit } from './formKitStyles';
import { useServiceFormScreen } from './useServiceFormScreen';

/** Quick-pick durations (minutes). */
const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

function durationLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) {
    return `${m} min`;
  }
  return m ? `${h} hr ${m}` : `${h} hr`;
}

export default function ServiceFormScreen() {
  const { isNew, businessName, form, onChange, error, saving, partialPayLocked, submit } = useServiceFormScreen();

  const totalMin = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0);
  const setDuration = (min: number) => {
    onChange('hours', String(Math.floor(min / 60)));
    onChange('minutes', String(min % 60));
  };

  return (
    <View style={kit.root}>
      <FormHeader title={isNew ? 'Add service' : 'Edit service'} subtitle={businessName} />
      <KeyboardAvoidingView style={kit.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={kit.flex}
          contentContainerStyle={kit.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionCard title="Basic info" subtitle="What customers will see" Icon={FileText} tint={PILL.blue}>
            <Field
              label="Service name"
              placeholder="e.g. Haircut & styling"
              invalid={error === 'Enter a service name'}
              value={form.name}
              onChangeText={(v) => onChange('name', v)}
            />
            <Field
              label="Description"
              optional
              multiline
              placeholder="What's included, who it's for…"
              value={form.description}
              onChangeText={(v) => onChange('description', v)}
            />
          </SectionCard>

          <SectionCard title="Pricing & duration" Icon={IndianRupee} tint={PILL.green}>
            <Field
              label="Price"
              prefix="₹"
              keyboardType="decimal-pad"
              placeholder="0"
              invalid={error === 'Enter a valid price'}
              value={form.price}
              onChangeText={(v) => onChange('price', v)}
            />
            <View style={kit.field}>
              <FieldLabel label="Duration" />
              <ChipRow>
                {DURATION_PRESETS.map((min) => (
                  <Chip
                    key={min}
                    label={durationLabel(min)}
                    active={totalMin === min}
                    onPress={() => setDuration(min)}
                  />
                ))}
              </ChipRow>
            </View>
            <View style={kit.row}>
              <View style={kit.rowItem}>
                <Field
                  label="Hours"
                  suffix="hr"
                  keyboardType="number-pad"
                  invalid={error === 'Enter a duration'}
                  value={form.hours}
                  onChangeText={(v) => onChange('hours', v)}
                />
              </View>
              <View style={kit.rowItem}>
                <Field
                  label="Minutes"
                  suffix="min"
                  keyboardType="number-pad"
                  invalid={error === 'Enter a duration'}
                  value={form.minutes}
                  onChangeText={(v) => onChange('minutes', v)}
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard title="On-location" Icon={Car} tint={PILL.orange}>
            <ToggleRow
              title="On-location service"
              hint="You travel to the customer"
              value={form.travelRequired}
              onValueChange={(v) => onChange('travelRequired', v)}
            />
            {form.travelRequired && (
              <View style={kit.row}>
                <View style={kit.rowItem}>
                  <Field
                    label="Base travel fee"
                    optional
                    prefix="₹"
                    keyboardType="decimal-pad"
                    placeholder="0"
                    value={form.travelBaseFee}
                    onChangeText={(v) => onChange('travelBaseFee', v)}
                  />
                </View>
                <View style={kit.rowItem}>
                  <Field
                    label="Fee per km"
                    optional
                    prefix="₹"
                    keyboardType="decimal-pad"
                    placeholder="0"
                    value={form.travelPerKm}
                    onChangeText={(v) => onChange('travelPerKm', v)}
                  />
                </View>
              </View>
            )}
          </SectionCard>

          <SectionCard title="Payments" Icon={Wallet} tint={PILL.lavender}>
            <ToggleRow
              title="Allow partial payment"
              hint={partialPayLocked ? 'Turned off at the business level' : 'Customers can pay part now, the rest later'}
              value={form.partialPayEnabled}
              onValueChange={(v) => onChange('partialPayEnabled', v)}
              disabled={partialPayLocked}
            />
          </SectionCard>
        </ScrollView>
        <ActionBar label={isNew ? 'Add service' : 'Save service'} loading={saving} onPress={submit} error={error} />
      </KeyboardAvoidingView>
    </View>
  );
}
