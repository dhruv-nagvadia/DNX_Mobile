import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LocateFixed, MapPin, X } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';

import { useLocationPicker } from './useLocationPicker';
import { styles } from './styles';

/** Sets where the customer is searching from — device GPS, or a typed city/PIN code. */
export default function LocationPickerScreen() {
  const { current, locating, manualText, setManualText, useCurrentLocation, saveManual, clear } =
    useLocationPicker();

  return (
    <View style={styles.container}>
      <AppHeader title="Set your location" />

      <View style={styles.content}>
        {current && (
          <View style={styles.current}>
            <MapPin size={16} color={Color.primary} />
            <Text style={styles.currentText} numberOfLines={1}>
              {current.label}
            </Text>
            <TouchableOpacity onPress={clear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={16} color={Color.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.gpsBtn}
          activeOpacity={0.85}
          onPress={useCurrentLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <>
              <LocateFixed size={18} color={Color.white} />
              <Text style={styles.gpsBtnText}>Use my current location</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.label}>Enter your city or PIN code</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Ahmedabad or 380015"
            placeholderTextColor={Color.placeholder}
            value={manualText}
            onChangeText={setManualText}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={saveManual}
          />
          <TouchableOpacity
            style={[styles.saveBtn, !manualText.trim() && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            disabled={!manualText.trim()}
            onPress={saveManual}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          Used to show nearby businesses first and to filter search by area.
        </Text>
      </View>
    </View>
  );
}
