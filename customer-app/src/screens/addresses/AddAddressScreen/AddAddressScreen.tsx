import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Building2,
  Check,
  CircleCheck,
  Hash,
  House,
  LocateFixed,
  LucideIcon,
  Map as MapIcon,
  MapPin,
  Save,
  Star,
  Tag,
  Trash2,
} from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Color } from '@/utils/Theme';
import { INK, LINK, PILL } from '@/utils/modernTheme';
import {
  AddressKind,
  addressKind,
  KIND_ICON,
  KIND_LABEL,
  KIND_TONE,
} from '../AddressesScreen/addressLabel';

import { useAddAddressScreen } from './useAddAddressScreen';
import { AddAddressScreenProps } from './types';
import { styles } from './styles';

const KINDS: AddressKind[] = ['home', 'work', 'other'];

interface FieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: LucideIcon;
  required?: boolean;
  error?: string;
  /** Rendered under the input when there's no error (e.g. the PIN lookup). */
  helper?: React.ReactNode;
}

/** 48px input with a leading icon, label above and an inline error below. */
function Field({ label, icon: Icon, required, error, helper, ...input }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputWrap, !!error && styles.inputError]}>
        <Icon size={18} color={INK} />
        <TextInput
          style={styles.input}
          placeholderTextColor={Color.placeholder}
          accessibilityLabel={label}
          {...input}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : helper}
    </View>
  );
}

/** Add or edit a saved address (Profile → Addresses). */
export default function AddAddressScreen(props: AddAddressScreenProps) {
  const {
    isEdit,
    form,
    errors,
    locating,
    resolvingPincode,
    pinResolved,
    saving,
    deleting,
    isDefaultLocked,
    makeDefault,
    setMakeDefault,
    onField,
    onPostalCode,
    useCurrentLocation,
    save,
    remove,
  } = useAddAddressScreen(props);
  const insets = useSafeAreaInsets();

  // The label is free text; the chips are presets. "Other" opens a name field.
  const [otherOpen, setOtherOpen] = useState(false);
  const labelKind = addressKind(form.label);
  const selectedKind: AddressKind | null =
    labelKind !== 'other' ? labelKind : otherOpen || form.label.trim() ? 'other' : null;

  const pickKind = (kind: AddressKind) => {
    if (kind === selectedKind) {
      // Tapping the selected chip again clears it — the label is optional.
      onField('label', '');
      setOtherOpen(false);
      return;
    }
    if (kind === 'other') {
      if (labelKind !== 'other') {
        onField('label', '');
      }
      setOtherOpen(true);
    } else {
      onField('label', KIND_LABEL[kind]);
      setOtherOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isEdit ? 'Edit address' : 'New address'}
        subtitle="Where providers should come"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* GPS prefill */}
        <TouchableOpacity
          style={styles.gpsCard}
          activeOpacity={0.85}
          onPress={useCurrentLocation}
          disabled={locating}
          accessibilityRole="button"
          accessibilityLabel="Use my current location"
          accessibilityHint="Fills in the address from your device's location"
          accessibilityState={{ disabled: locating, busy: locating }}
        >
          <View style={styles.gpsIcon}>
            {locating ? (
              <ActivityIndicator size="small" color={Color.white} />
            ) : (
              <LocateFixed size={20} color={Color.white} />
            )}
          </View>
          <View style={styles.gpsText}>
            <Text style={styles.gpsTitle}>Use my current location</Text>
            <Text style={styles.gpsSub}>
              {locating ? 'Finding where you are…' : 'Fill in the address from GPS'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Label */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Save as</Text>
          <View style={styles.chipRow} accessibilityRole="radiogroup">
            {KINDS.map((kind) => {
              const Icon = KIND_ICON[kind];
              const tone = KIND_TONE[kind];
              const active = selectedKind === kind;
              return (
                <TouchableOpacity
                  key={kind}
                  style={[
                    styles.chip,
                    { backgroundColor: tone.bg },
                    active && { borderColor: tone.fg },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => pickKind(kind)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active, checked: active }}
                  accessibilityLabel={`Save as ${KIND_LABEL[kind]}`}
                >
                  <Icon size={16} color={tone.fg} />
                  <Text style={[styles.chipText, { color: tone.fg }]}>{KIND_LABEL[kind]}</Text>
                  {active && <Check size={14} color={tone.fg} strokeWidth={3} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedKind === 'other' && (
            <Field
              label="Name this place (optional)"
              icon={Tag}
              placeholder="e.g. Mom's house, Gym"
              value={form.label}
              onChangeText={(v) => onField('label', v)}
              autoCapitalize="words"
            />
          )}
        </View>

        {/* Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Address</Text>
          <Field
            label="House / flat / apartment"
            icon={House}
            placeholder="e.g. Flat 4B, Sunrise Apartments"
            value={form.houseFlat}
            onChangeText={(v) => onField('houseFlat', v)}
          />
          <Field
            label="Area, street, or sector"
            icon={MapPin}
            required
            placeholder="e.g. Thaltej, near XYZ temple"
            value={form.areaStreet}
            onChangeText={(v) => onField('areaStreet', v)}
            error={errors.areaStreet}
          />
        </View>

        {/* PIN / city / state */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PIN code & city</Text>
          <Field
            label="PIN code"
            icon={Hash}
            required
            placeholder="380001"
            keyboardType="number-pad"
            maxLength={6}
            value={form.postalCode}
            onChangeText={onPostalCode}
            error={errors.postalCode}
            helper={
              resolvingPincode ? (
                <View style={styles.helperRow}>
                  <ActivityIndicator size="small" color={LINK} />
                  <Text style={styles.helperText}>Looking up your city…</Text>
                </View>
              ) : pinResolved ? (
                <View style={styles.helperRow}>
                  <CircleCheck size={14} color={PILL.green.fg} />
                  <Text style={styles.resolvedText}>{pinResolved}</Text>
                </View>
              ) : null
            }
          />
          <View style={styles.row2}>
            <View style={styles.flex1}>
              <Field
                label="City"
                icon={Building2}
                placeholder="Auto-filled"
                value={form.city}
                onChangeText={(v) => onField('city', v)}
              />
            </View>
            <View style={styles.flex1}>
              <Field
                label="State"
                icon={MapIcon}
                placeholder="Auto-filled"
                value={form.state}
                onChangeText={(v) => onField('state', v)}
              />
            </View>
          </View>
        </View>

        {/* Default */}
        <View style={[styles.card, styles.defaultCard]}>
          <View style={[styles.defaultIcon, { backgroundColor: PILL.yellow.bg }]}>
            <Star size={20} color={PILL.yellow.fg} />
          </View>
          <View style={styles.defaultText}>
            <Text style={styles.defaultTitle}>Default address</Text>
            <Text style={styles.defaultSub}>
              {isDefaultLocked
                ? isEdit
                  ? 'This is your default address'
                  : 'Your first address is your default'
                : 'Pre-selected when you book'}
            </Text>
          </View>
          <Switch
            value={makeDefault}
            onValueChange={setMakeDefault}
            disabled={isDefaultLocked}
            trackColor={{ false: '#CBD5E1', true: LINK }}
            thumbColor={Color.white}
            ios_backgroundColor="#CBD5E1"
            accessibilityLabel="Make this my default address"
          />
        </View>

        {!!errors.submit && (
          <View style={styles.submitError} accessibilityLiveRegion="polite">
            <Text style={styles.submitErrorText}>{errors.submit}</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        {isEdit && (
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.85}
            onPress={remove}
            disabled={deleting || saving}
            accessibilityRole="button"
            accessibilityLabel="Delete address"
            accessibilityState={{ disabled: deleting || saving, busy: deleting }}
          >
            {deleting ? (
              <ActivityIndicator color={Color.error} />
            ) : (
              <>
                <Trash2 size={20} color={Color.error} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnBusy]}
          activeOpacity={0.85}
          onPress={save}
          disabled={saving || deleting}
          accessibilityRole="button"
          accessibilityLabel="Save address"
          accessibilityState={{ disabled: saving || deleting, busy: saving }}
        >
          {saving ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <>
              <Save size={20} color={Color.white} />
              <Text style={styles.saveBtnText}>{isEdit ? 'Save changes' : 'Save address'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
