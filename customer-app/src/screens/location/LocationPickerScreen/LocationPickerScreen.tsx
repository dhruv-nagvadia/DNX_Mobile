import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { LocateFixed, MapPin, Search, X } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';

import { useLocationPicker } from './useLocationPicker';
import { styles } from './styles';

/** Sets where the customer is searching from — device GPS, or a typed city/PIN code. */
export default function LocationPickerScreen() {
  const {
    current,
    locating,
    manualText,
    setManualText,
    suggestions,
    searching,
    selectSuggestion,
    useCurrentLocation,
    search,
    clear,
  } = useLocationPicker();

  const canSearch = manualText.trim().length >= 3;

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

        <Text style={styles.label}>Enter your city, area, or PIN code</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Thaltej, Ahmedabad, or 380059"
            placeholderTextColor={Color.placeholder}
            value={manualText}
            onChangeText={setManualText}
            autoCapitalize="words"
            returnKeyType="search"
            onSubmitEditing={search}
          />
          <TouchableOpacity
            style={[styles.saveBtn, !canSearch && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            disabled={!canSearch}
            onPress={search}
          >
            <Search size={16} color={Color.white} />
            <Text style={styles.saveBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {searching && (
          <View style={styles.suggestLoading}>
            <ActivityIndicator size="small" color={Color.primary} />
          </View>
        )}

        {suggestions.length > 0 && (
          <ScrollView
            style={styles.suggestList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={`${s.pincode}-${s.name}-${i}`}
                style={[styles.suggestRow, i === suggestions.length - 1 && styles.suggestRowLast]}
                activeOpacity={0.7}
                onPress={() => selectSuggestion(s)}
              >
                <MapPin size={14} color={Color.textSecondary} />
                <Text style={styles.suggestText} numberOfLines={1}>
                  {s.name}, {s.district}
                </Text>
                <Text style={styles.suggestPin}>{s.pincode}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!searching && canSearch && suggestions.length === 0 && (
          <Text style={styles.noResults}>No matches found. Try a different city or PIN code.</Text>
        )}

        <Text style={styles.hint}>
          Used to show nearby businesses first and to filter search by area.
        </Text>
      </View>
    </View>
  );
}
