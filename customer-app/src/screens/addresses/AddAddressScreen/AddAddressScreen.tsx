import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';

import { useAddAddressScreen } from './useAddAddressScreen';
import { AddAddressScreenProps } from './types';
import { styles } from './styles';

/** Add or edit a saved address (Profile → Addresses). */
export default function AddAddressScreen(props: AddAddressScreenProps) {
  const {
    isEdit,
    form,
    error,
    locating,
    resolvingPincode,
    saving,
    onField,
    onPostalCode,
    useCurrentLocation,
    save,
  } = useAddAddressScreen(props);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={isEdit ? 'Edit address' : 'Add address'} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.label}>Label (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Home, Work…"
            placeholderTextColor={Color.placeholder}
            value={form.label}
            onChangeText={(v) => onField('label', v)}
          />
        </View>

        <View>
          <Text style={styles.label}>House / flat / apartment</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Flat 4B, Sunrise Apartments"
            placeholderTextColor={Color.placeholder}
            value={form.houseFlat}
            onChangeText={(v) => onField('houseFlat', v)}
          />
        </View>

        <View>
          <Text style={styles.label}>Area, street, or sector</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Thaltej, near XYZ temple"
            placeholderTextColor={Color.placeholder}
            value={form.areaStreet}
            onChangeText={(v) => onField('areaStreet', v)}
          />
        </View>

        <View style={styles.row2}>
          <View style={styles.field}>
            <Text style={styles.label}>PIN code</Text>
            <TextInput
              style={styles.input}
              placeholder="380001"
              placeholderTextColor={Color.placeholder}
              keyboardType="number-pad"
              maxLength={6}
              value={form.postalCode}
              onChangeText={onPostalCode}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Auto-filled from PIN"
              placeholderTextColor={Color.placeholder}
              value={form.city}
              onChangeText={(v) => onField('city', v)}
            />
          </View>
        </View>
        {resolvingPincode && <Text style={styles.resolvedHint}>Looking up your city…</Text>}

        <View>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="Auto-filled from PIN"
            placeholderTextColor={Color.placeholder}
            value={form.state}
            onChangeText={(v) => onField('state', v)}
          />
        </View>

        <TouchableOpacity
          style={styles.gpsBtn}
          activeOpacity={0.85}
          onPress={useCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator color={Color.primary} />
          ) : (
            <>
              <LocateFixed size={16} color={Color.primary} />
              <Text style={styles.gpsBtnText}>Use my current location instead</Text>
            </>
          )}
        </TouchableOpacity>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          activeOpacity={0.85}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save address</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
