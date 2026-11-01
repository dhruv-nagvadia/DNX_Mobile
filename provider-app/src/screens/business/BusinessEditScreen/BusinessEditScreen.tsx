import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { AppInput } from '@/components/AppInput';
import { LoadingView } from '@/components/LoadingView';

import { useBusinessEditScreen } from './useBusinessEditScreen';
import { styles } from './styles';

const DESCRIPTION_MAX_LENGTH = 500;

export default function BusinessEditScreen() {
  const { isLoading, saving, form, onChange, error, save } = useBusinessEditScreen();

  if (isLoading) {
    return (
      <View style={styles.root}>
        <AppHeader title="Edit business details" />
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Edit business details" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <AppInput
            label="Business name"
            value={form.businessName}
            onChangeText={(v) => onChange('businessName', v)}
          />
          <AppInput
            label="Phone"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => onChange('phone', v)}
          />
          <AppInput
            label="Email"
            hint="Optional"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => onChange('email', v)}
          />
          <AppInput
            label="Description"
            hint={`Optional — shown to customers · ${form.description.length}/${DESCRIPTION_MAX_LENGTH}`}
            multiline
            maxLength={DESCRIPTION_MAX_LENGTH}
            style={styles.description}
            value={form.description}
            onChangeText={(v) => onChange('description', v)}
          />
          <AppInput
            label="Address"
            hint="Optional"
            value={form.addressLine}
            onChangeText={(v) => onChange('addressLine', v)}
          />
          <AppInput label="City" hint="Optional" value={form.city} onChangeText={(v) => onChange('city', v)} />
          <AppInput label="State" hint="Optional" value={form.state} onChangeText={(v) => onChange('state', v)} />
          <AppInput
            label="Postal code"
            hint="Optional"
            keyboardType="number-pad"
            value={form.postalCode}
            onChangeText={(v) => onChange('postalCode', v)}
          />

          <AppButton title="Save changes" loading={saving} onPress={save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
