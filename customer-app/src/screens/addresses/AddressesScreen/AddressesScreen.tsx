import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { Address } from '@/redux/api/address/types';
import { formatAddress } from '@/utils/formatAddress';

import { useAddressesScreen } from './useAddressesScreen';
import { styles } from './styles';

/** Profile → Addresses — manage saved addresses used for on-location bookings. */
export default function AddressesScreen() {
  const { addresses, isLoading, addNew, edit, makeDefault, remove } = useAddressesScreen();

  const renderCard = (a: Address) => (
    <View key={a.id} style={styles.card}>
      <TouchableOpacity
        style={[styles.radioBtn, a.isDefault && styles.radioBtnSelected]}
        activeOpacity={0.7}
        onPress={() => makeDefault(a)}
        accessibilityRole="radio"
        accessibilityState={{ selected: a.isDefault }}
        accessibilityLabel={`Set ${a.label || a.line} as default`}
      >
        {a.isDefault && <View style={styles.radioBtnDot} />}
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{a.label || 'Address'}</Text>
          {a.isDefault && <Text style={styles.defaultTag}>Default</Text>}
        </View>
        <Text style={styles.line}>{formatAddress(a)}</Text>
      </View>

      <View style={styles.rowActions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => edit(a)}
          accessibilityLabel={`Edit ${a.label || a.line}`}
        >
          <Pencil size={16} color={Color.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => remove(a)}
          accessibilityLabel={`Delete ${a.label || a.line}`}
        >
          <Trash2 size={16} color={Color.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Your addresses" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.center}>
          <MapPin size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>No addresses yet</Text>
          <Text style={styles.emptyText}>
            Add an address so on-location providers (like a plumber or electrician) know where to
            come.
          </Text>
          <TouchableOpacity style={[styles.addBtn, { paddingHorizontal: 24 }]} onPress={addNew}>
            <Plus size={16} color={Color.primary} />
            <Text style={styles.addBtnText}>Add address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {addresses.map(renderCard)}
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={addNew}>
            <Plus size={16} color={Color.primary} />
            <Text style={styles.addBtnText}>Add address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
