import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Color } from '@/utils/Theme';

import { useServiceFormScreen } from './useServiceFormScreen';
import { styles } from './styles';

export default function ServiceFormScreen() {
  const { isNew, form, onChange, error, saving, partialPayLocked, submit } = useServiceFormScreen();

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{isNew ? 'Add a service' : 'Edit service'}</Text>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <AppInput label="Service name" value={form.name} onChangeText={(v) => onChange('name', v)} />
          <AppInput
            label="Description"
            hint="Optional"
            multiline
            style={styles.description}
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
          />
          <AppInput
            label="Price"
            prefix="₹"
            keyboardType="decimal-pad"
            value={form.price}
            onChangeText={(v) => onChange('price', v)}
          />

          <View style={styles.row}>
            <View style={styles.field}>
              <AppInput
                label="Duration — hours"
                keyboardType="number-pad"
                value={form.hours}
                onChangeText={(v) => onChange('hours', v)}
              />
            </View>
            <View style={styles.field}>
              <AppInput
                label="Duration — minutes"
                keyboardType="number-pad"
                value={form.minutes}
                onChangeText={(v) => onChange('minutes', v)}
              />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>On-location service</Text>
              <Text style={styles.toggleHint}>You travel to the customer</Text>
            </View>
            <Switch
              value={form.travelRequired}
              onValueChange={(v) => onChange('travelRequired', v)}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          {form.travelRequired && (
            <View style={styles.row}>
              <View style={styles.field}>
                <AppInput
                  label="Base travel fee"
                  prefix="₹"
                  hint="Optional"
                  keyboardType="decimal-pad"
                  value={form.travelBaseFee}
                  onChangeText={(v) => onChange('travelBaseFee', v)}
                />
              </View>
              <View style={styles.field}>
                <AppInput
                  label="Fee per km"
                  prefix="₹"
                  hint="Optional"
                  keyboardType="decimal-pad"
                  value={form.travelPerKm}
                  onChangeText={(v) => onChange('travelPerKm', v)}
                />
              </View>
            </View>
          )}

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

          <AppButton title={isNew ? 'Add service' : 'Save changes'} loading={saving} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
