import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

import { CouponList } from './CouponList';
import { styles } from './styles';

interface CouponSheetProps {
  visible: boolean;
  providerId: string;
  subtotalMinor: number;
  currency: string;
  /** Apply a code (typed or tapped); parent validates against the backend. */
  onApply: (code: string) => void;
  applying?: boolean;
  error?: string | null;
  onClose: () => void;
}

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

/** Standalone bottom sheet wrapping CouponList (kept for spots outside a payment step). */
export function CouponSheet({
  visible,
  providerId,
  subtotalMinor,
  currency,
  onApply,
  applying,
  error,
  onClose,
}: CouponSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={applying ? undefined : onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />
          <Text style={styles.title}>Offers for you</Text>
          <Text style={styles.subtitle}>Total {money(subtotalMinor, currency)}</Text>

          <CouponList
            providerId={providerId}
            subtotalMinor={subtotalMinor}
            currency={currency}
            onApply={onApply}
            applying={applying}
            error={error}
            active={visible}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
