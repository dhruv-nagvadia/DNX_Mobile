import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { LoadingView } from '@/components/LoadingView';
import { Color } from '@/utils/Theme';
import { INK } from '@/utils/modernTheme';

import { FormField } from './FormField';
import { useBusinessEditScreen } from './useBusinessEditScreen';
import { styles } from './styles';

const DESCRIPTION_MAX_LENGTH = 500;

export default function BusinessEditScreen() {
  const { isLoading, saving, form, onChange, error, save } = useBusinessEditScreen();

  if (isLoading) {
    return (
      <View style={styles.root}>
        <AppHeader title="Edit Business" variant="light" />
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Edit Business" variant="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.card}>
            <FormField
              label="Business Name"
              required
              value={form.businessName}
              onChangeText={(v) => onChange('businessName', v)}
            />
            <FormField
              label="Phone"
              required
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => onChange('phone', v)}
            />
            <FormField
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
            />
            <FormField
              label="Description"
              hint={`Shown to customers · ${form.description.length}/${DESCRIPTION_MAX_LENGTH}`}
              multiline
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={form.description}
              onChangeText={(v) => onChange('description', v)}
            />
            <FormField
              label="Address"
              multiline
              trailing={<MapPin size={20} color={INK} strokeWidth={2} />}
              style={styles.address}
              value={form.addressLine}
              onChangeText={(v) => onChange('addressLine', v)}
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FormField label="City" value={form.city} onChangeText={(v) => onChange('city', v)} />
              </View>
              <View style={styles.rowItem}>
                <FormField label="State" value={form.state} onChangeText={(v) => onChange('state', v)} />
              </View>
            </View>
            <FormField
              label="Postal Code"
              keyboardType="number-pad"
              value={form.postalCode}
              onChangeText={(v) => onChange('postalCode', v)}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={save}
            disabled={saving}
            accessibilityRole="button"
            accessibilityState={{ disabled: saving, busy: saving }}
          >
            {saving ? <ActivityIndicator color={Color.white} /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
