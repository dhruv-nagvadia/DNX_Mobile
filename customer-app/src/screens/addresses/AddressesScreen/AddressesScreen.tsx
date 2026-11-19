import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CircleCheck, MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Color } from '@/utils/Theme';
import { LINK } from '@/utils/modernTheme';
import { Address } from '@/redux/api/address/types';
import { formatAddress } from '@/utils/formatAddress';

import { useAddressesScreen } from './useAddressesScreen';
import { addressKind, KIND_ICON, KIND_TONE } from './addressLabel';
import { styles } from './styles';

/** Profile → Addresses — manage saved addresses used for on-location bookings. */
export default function AddressesScreen() {
  const { addresses, isLoading, addNew, edit, makeDefault, remove } = useAddressesScreen();

  const renderCard = (a: Address) => {
    const kind = addressKind(a.label);
    const Icon = KIND_ICON[kind];
    const tone = KIND_TONE[kind];
    const name = a.label || 'Address';
    const full = formatAddress(a);

    return (
      <View key={a.id} style={[styles.card, a.isDefault && styles.cardDefault]}>
        <View
          style={styles.cardTop}
          accessible
          accessibilityLabel={`${name}${a.isDefault ? ', default' : ''}, ${full}`}
        >
          <View style={[styles.iconTile, { backgroundColor: tone.bg }]}>
            <Icon size={20} color={tone.fg} />
          </View>
          <View style={styles.info}>
            <View style={styles.labelRow}>
              <Text style={styles.label} numberOfLines={1}>
                {name}
              </Text>
              {a.isDefault && (
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultPillText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.line}>{full}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => edit(a)}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${a.label || a.line}`}
          >
            <Pencil size={16} color={LINK} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          {!a.isDefault && (
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={() => makeDefault(a)}
              accessibilityRole="button"
              accessibilityLabel={`Set ${a.label || a.line} as default`}
            >
              <CircleCheck size={16} color={LINK} />
              <Text style={styles.actionText}>Set as default</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionsSpacer} />

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => remove(a)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${a.label || a.line}`}
          >
            <Trash2 size={16} color={Color.error} />
            <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const subtitle = isLoading
    ? undefined
    : addresses.length === 0
      ? 'Where providers should come'
      : `${addresses.length} saved`;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Saved addresses" subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <MapPin size={32} color={LINK} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptyText}>
            Add an address so on-location providers (like a plumber or electrician) know where to
            come.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={addNew}
            accessibilityRole="button"
            accessibilityLabel="Add your first address"
          >
            <Plus size={20} color={Color.white} />
            <Text style={styles.primaryBtnText}>Add your first address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {addresses.map(renderCard)}
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.8}
            onPress={addNew}
            accessibilityRole="button"
            accessibilityLabel="Add new address"
          >
            <View style={styles.addIcon}>
              <Plus size={18} color={LINK} strokeWidth={2.4} />
            </View>
            <Text style={styles.addText}>Add new address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
