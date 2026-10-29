import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Phone, MapPin, Mail } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { styles } from './styles';

interface BusinessContactProps {
  phone: string;
  email?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  /** Label for the call row, e.g. "Call the store" / "Call the business". */
  callLabel?: string;
  /** Label for the address row, e.g. "Pickup address" / "Address". */
  addressLabel?: string;
}

/** Shared contact card: tap to call, plus address and email. */
export function BusinessContact({
  phone,
  email,
  addressLine,
  city,
  state,
  postalCode,
  callLabel = 'Call the business',
  addressLabel = 'Address',
}: BusinessContactProps) {
  const address = [addressLine, city, state, postalCode].filter(Boolean).join(', ');

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => Linking.openURL(`tel:${phone}`)}
      >
        <View style={styles.icon}>
          <Phone size={16} color={Color.primary} />
        </View>
        <View style={styles.text}>
          <Text style={styles.label}>{callLabel}</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>
        <Text style={styles.action}>Call</Text>
      </TouchableOpacity>

      {!!address && (
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.icon}>
            <MapPin size={16} color={Color.primary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.label}>{addressLabel}</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
        </View>
      )}

      {!!email && (
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.icon}>
            <Mail size={16} color={Color.primary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
