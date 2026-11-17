import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banknote, CalendarDays, CreditCard, Lock } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { INK } from '@/utils/modernTheme';
import { PaymentMethod } from '@/redux/api/booking/types';

import { styles } from './styles';

interface PaymentMethodModalProps {
  visible: boolean;
  total: number; // minor units (already reflects any applied discount)
  currency: string;
  depositPercent: number; // 0 = partial disabled
  /** Kept for API compatibility; the redesigned sheet shows just the total. */
  serviceName?: string;
  loading?: boolean;
  // Greys out the cash option instead of removing it, with the reason
  // shown in place of the usual subtitle — e.g. a cart item that doesn't
  // accept Cash on Delivery.
  codDisabled?: boolean;
  codDisabledReason?: string;
  // Same treatment for "Pay X% now" — greyed out with a reason (e.g. a cart
  // item that doesn't accept Partial Pay) instead of just disappearing.
  partialDisabled?: boolean;
  partialDisabledReason?: string;
  /**
   * Where the balance / cash is paid: 'pickup' (cart orders — the default)
   * or 'visit' (service bookings). Only changes wording.
   */
  context?: 'pickup' | 'visit';
  /** Sheet title. */
  title?: string;
  /** Button label when cash is selected (default: "Place order" / "Confirm booking"). */
  cashCtaLabel?: string;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

interface OptionProps {
  Icon: LucideIcon;
  title: string;
  tag?: string;
  lines: string[];
  strongLine?: string;
  reason?: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function Option({
  Icon,
  title,
  tag,
  lines,
  strongLine,
  reason,
  selected,
  disabled,
  onPress,
}: OptionProps) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected, disabled && styles.optionDisabled]}
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={[title, ...lines, strongLine, reason].filter(Boolean).join(', ')}
    >
      <Icon size={26} color={disabled ? '#94A3B8' : selected ? '#1D4ED8' : INK} strokeWidth={1.7} />
      <View style={styles.optionBody}>
        <View style={styles.titleRow}>
          <Text style={[styles.optionTitle, disabled && styles.textDisabled]}>{title}</Text>
          {!!tag && !disabled && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
        </View>
        {lines.map((l) => (
          <Text key={l} style={[styles.optionSub, disabled && styles.textDisabled]}>
            {l}
          </Text>
        ))}
        {!!strongLine && <Text style={styles.optionStrong}>{strongLine}</Text>}
        {!!reason && <Text style={styles.optionReason}>{reason}</Text>}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

/** Bottom sheet to pick a payment method (online / partial deposit / cash), then confirm. */
export function PaymentMethodModal({
  visible,
  total,
  currency,
  depositPercent,
  loading,
  codDisabled,
  codDisabledReason,
  partialDisabled,
  partialDisabledReason,
  context = 'pickup',
  title = 'How would you like to pay?',
  cashCtaLabel,
  onSelect,
  onClose,
}: PaymentMethodModalProps) {
  const insets = useSafeAreaInsets();
  const deposit = Math.max(0, Math.round((total * depositPercent) / 100));
  const remaining = total - deposit;
  const showPartial = partialDisabled || (depositPercent > 0 && deposit > 0 && deposit < total);
  const where = context === 'visit' ? 'at your visit' : 'at pickup';

  // Online is never disabled, so it's always the first enabled option.
  const [picked, setMethod] = useState<PaymentMethod>('ONLINE');
  useEffect(() => {
    if (visible) {
      setMethod('ONLINE');
    }
  }, [visible]);
  // Never confirm an option that became unavailable while the sheet was open.
  const method: PaymentMethod =
    (picked === 'PARTIAL' && (partialDisabled || !showPartial)) ||
    (picked === 'CASH' && codDisabled)
      ? 'ONLINE'
      : picked;

  const cta =
    method === 'ONLINE'
      ? `Pay ${money(total, currency)}`
      : method === 'PARTIAL'
        ? `Pay ${money(deposit, currency)}`
        : (cashCtaLabel ?? (context === 'visit' ? 'Confirm booking' : 'Place order'));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={loading ? undefined : onClose}
        accessibilityLabel="Close"
      >
        <TouchableOpacity
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}
          activeOpacity={1}
        >
          <View style={styles.handle} />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitle}>Total {money(total, currency)}</Text>

          <View style={styles.options} accessibilityRole="radiogroup">
            <Option
              Icon={CreditCard}
              title="Pay online"
              lines={['UPI, cards, netbanking']}
              strongLine={`${money(total, currency)} now`}
              selected={method === 'ONLINE'}
              disabled={!!loading}
              onPress={() => setMethod('ONLINE')}
            />
            {showPartial && (
              <Option
                Icon={CalendarDays}
                title={`Pay ${depositPercent}% now`}
                tag="Popular"
                lines={
                  partialDisabled
                    ? []
                    : [`${money(deposit, currency)} now, ${money(remaining, currency)} ${where}`]
                }
                reason={partialDisabled ? partialDisabledReason : undefined}
                selected={method === 'PARTIAL'}
                disabled={!!loading || !!partialDisabled}
                onPress={() => setMethod('PARTIAL')}
              />
            )}
            <Option
              Icon={Banknote}
              title={context === 'visit' ? 'Pay after service' : 'Pay at pickup'}
              lines={[`Cash ${where}`]}
              reason={codDisabled ? codDisabledReason : undefined}
              selected={method === 'CASH'}
              disabled={!!loading || !!codDisabled}
              onPress={() => setMethod('CASH')}
            />
          </View>

          <View style={styles.secure}>
            <Lock size={14} color="#64748B" strokeWidth={2} />
            <Text style={styles.secureText}>Payments are secured by Razorpay</Text>
          </View>

          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.9}
            disabled={loading}
            onPress={() => onSelect(method)}
            accessibilityRole="button"
            accessibilityLabel={cta}
          >
            <Text style={styles.ctaText}>{cta}</Text>
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
