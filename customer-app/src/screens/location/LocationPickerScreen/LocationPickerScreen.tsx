import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  Check,
  ChevronRight,
  Info,
  LocateFixed,
  MapPin,
  MapPinOff,
  Navigation,
  Search,
  X,
} from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Color } from '@/utils/Theme';
import { INK, LINK, PILL } from '@/utils/modernTheme';

import { useLocationPicker } from './useLocationPicker';
import { styles } from './styles';

const MODE_LABEL = {
  gps: 'Current location',
  manual: 'Chosen area',
  profile: 'From your profile',
} as const;

/** Sets where the customer is searching from — device GPS, or a typed city/PIN code. */
export default function LocationPickerScreen() {
  const {
    current,
    locating,
    gpsFailed,
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
  const CurrentIcon = current?.mode === 'gps' ? Navigation : MapPin;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Choose your location" subtitle="To show businesses near you" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Current selection */}
        {current && (
          <View style={styles.selectedCard}>
            <View style={styles.selectedIcon}>
              <CurrentIcon size={18} color={LINK} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.selectedCaption}>{MODE_LABEL[current.mode]}</Text>
              <Text style={styles.selectedLabel} numberOfLines={2}>
                {current.label}
              </Text>
            </View>
            <View style={styles.checkBadge}>
              <Check size={12} color={Color.white} strokeWidth={3.5} />
            </View>
            <TouchableOpacity
              onPress={clear}
              style={styles.clearSelected}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={`Clear location ${current.label}`}
            >
              <X size={18} color={INK} />
            </TouchableOpacity>
          </View>
        )}

        {/* GPS */}
        <TouchableOpacity
          style={[styles.gpsCard, gpsFailed && styles.gpsCardFailed]}
          activeOpacity={0.85}
          onPress={useCurrentLocation}
          disabled={locating}
          accessibilityRole="button"
          accessibilityLabel="Use current location"
          accessibilityHint="Uses your device's GPS"
          accessibilityState={{ disabled: locating, busy: locating }}
        >
          <View style={[styles.gpsIcon, gpsFailed && styles.gpsIconFailed]}>
            {locating ? (
              <ActivityIndicator size="small" color={Color.white} />
            ) : gpsFailed ? (
              <MapPinOff size={20} color={PILL.red.fg} />
            ) : (
              <LocateFixed size={20} color={Color.white} />
            )}
          </View>
          <View style={styles.rowText}>
            <Text style={styles.gpsTitle}>
              {gpsFailed ? 'Location unavailable' : 'Use current location'}
            </Text>
            <Text style={styles.gpsSub}>
              {locating
                ? 'Finding where you are…'
                : gpsFailed
                  ? 'Allow location access in Settings, then tap to try again'
                  : 'Using your device GPS'}
            </Text>
          </View>
          {!locating && <ChevronRight size={20} color={gpsFailed ? PILL.red.fg : LINK} />}
        </TouchableOpacity>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search by area, city or PIN code</Text>
          <View style={styles.searchBar}>
            <Search size={20} color={INK} />
            <TextInput
              style={styles.searchInput}
              placeholder="e.g. Thaltej, Ahmedabad, or 380059"
              placeholderTextColor={Color.placeholder}
              value={manualText}
              onChangeText={setManualText}
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={search}
              accessibilityLabel="Search area, city or PIN code"
            />
            {searching ? (
              <ActivityIndicator size="small" color={LINK} />
            ) : manualText.length > 0 ? (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setManualText('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <X size={13} color={Color.white} strokeWidth={3} />
              </TouchableOpacity>
            ) : null}
          </View>
          {manualText.trim().length > 0 && !canSearch && (
            <Text style={styles.hint}>Type at least 3 characters</Text>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.listCard}>
            {suggestions.map((s, i) => {
              const selected =
                current?.mode === 'manual' &&
                current.postalCode === s.pincode &&
                current.label.startsWith(`${s.name},`);
              return (
                <TouchableOpacity
                  key={`${s.pincode}-${s.name}-${i}`}
                  style={[styles.resultRow, i > 0 && styles.rowBorder]}
                  activeOpacity={0.7}
                  onPress={() => selectSuggestion(s)}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.name}, ${s.district}, ${s.state}, PIN ${s.pincode}`}
                  accessibilityState={{ selected }}
                >
                  <View style={[styles.resultIcon, selected && styles.resultIconSelected]}>
                    <MapPin size={18} color={selected ? Color.white : LINK} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text style={styles.resultSub} numberOfLines={1}>
                      {s.district}, {s.state}
                    </Text>
                  </View>
                  {selected ? (
                    <View style={styles.checkBadge}>
                      <Check size={12} color={Color.white} strokeWidth={3.5} />
                    </View>
                  ) : (
                    <View style={styles.pinPill}>
                      <Text style={styles.pinPillText}>{s.pincode}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!searching && canSearch && suggestions.length === 0 && (
          <View style={styles.empty}>
            <MapPinOff size={28} color="#94A3B8" />
            <Text style={styles.emptyText}>
              No matches found. Try a different city or PIN code.
            </Text>
          </View>
        )}

        <View style={styles.infoStrip}>
          <Info size={18} color={LINK} />
          <Text style={styles.infoText}>
            Used to show nearby businesses first and to filter search by area.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
