import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Banknote, CreditCard, PieChart } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { PaymentMethod } from '@/redux/api/booking/types';

import { styles } from './styles';

interface PaymentMethodModalProps {
  visible: boolean;
  total: number; // minor units
  currency: string;
  depositPercent: number; // 0 = partial disabled
  serviceName?: string;
  loading?: boolean;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

/** Bottom sheet to pick a payment method (online / cash / partial deposit). */
export function PaymentMethodModal({
  visible,
  total,
  currency,
  depositPercent,
  serviceName,
  loading,
  onSelect,
  onClose,
}: PaymentMethodModalProps) {
  const deposit = Math.max(0, Math.round((total * depositPercent) / 100));
  const remaining = total - deposit;
  const showPartial = depositPercent > 0 && deposit > 0 && deposit < total;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={loading ? undefined : onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose how to pay</Text>
          <Text style={styles.subtitle}>
            {serviceName ? `${serviceName} · ` : ''}Total {money(total, currency)}
          </Text>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.85}
            disabled={loading}
            onPress={() => onSelect('ONLINE')}
          >
            <View style={styles.optionIcon}>
              <CreditCard size={22} color={Color.primary} />
            </View>
            <View style={styles.optionBody}>
              <Text style={styles.optionTitle}>Pay online</Text>
              <Text style={styles.optionSub}>Pay the full amount now, securely</Text>
            </View>
            <Text style={styles.optionAmount}>{money(total, currency)}</Text>
          </TouchableOpacity>

          {showPartial && (
            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.85}
              disabled={loading}
              onPress={() => onSelect('PARTIAL')}
            >
              <View style={styles.optionIcon}>
                <PieChart size={22} color={Color.primary} />
              </View>
              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>Pay {depositPercent}% now</Text>
                <Text style={styles.optionSub}>
                  {money(remaining, currency)} at the venue
                </Text>
              </View>
              <Text style={styles.optionAmount}>{money(deposit, currency)}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.85}
            disabled={loading}
            onPress={() => onSelect('CASH')}
          >
            <View style={styles.optionIcon}>
              <Banknote size={22} color={Color.primary} />
            </View>
            <View style={styles.optionBody}>
              <Text style={styles.optionTitle}>Pay at venue</Text>
              <Text style={styles.optionSub}>Book now, pay cash when you arrive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} activeOpacity={0.7} disabled={loading} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={Color.primary} size="large" />
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
