import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { AppButton } from '@/components/AppButton';
import { CategoryIcon } from '@/components/CategoryIcon';
import { PaymentMethodModal } from '@/components/PaymentMethodModal';
import { OffersSection } from '@/components/OffersSection';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/units';

import { useBookingSummary } from './useBookingSummary';
import { styles } from './styles';

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Review-and-pay step: booking details, cost breakdown, and offers — before choosing how to pay. */
export default function BookingSummaryScreen() {
  const {
    provider,
    service,
    isLoading,
    startTime,
    total,
    currency,
    depositPercent,
    appliedCoupon,
    methodOpen,
    openPayment,
    closePayment,
    chooseMethod,
    paymentBusy,
  } = useBookingSummary();

  if (isLoading || !provider || !service) {
    return (
      <View style={styles.container}>
        <AppHeader title="Booking summary" />
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      </View>
    );
  }

  const discount = appliedCoupon?.discountMinor ?? 0;

  return (
    <View style={styles.container}>
      <AppHeader title="Booking summary" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business + service */}
        <View style={styles.card}>
          <View style={styles.bizRow}>
            <View style={styles.avatar}>
              {provider.images.length > 0 ? (
                <Image source={{ uri: provider.images[0] }} style={styles.avatarImg} />
              ) : (
                <CategoryIcon slug={provider.category.slug} size={22} />
              )}
            </View>
            <View style={styles.bizInfo}>
              <Text style={styles.bizName} numberOfLines={1}>
                {provider.businessName}
              </Text>
              <Text style={styles.bizMeta} numberOfLines={1}>
                {provider.subcategory?.name ?? provider.category.name}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service</Text>
            <Text style={styles.rowValue}>{service.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Duration</Text>
            <Text style={styles.rowValue}>{formatDuration(service.durationMin)}</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>When</Text>
            <Text style={styles.rowValue}>{formatWhen(startTime)}</Text>
          </View>
        </View>

        {/* Offers */}
        <Text style={styles.sectionTitle}>Offers</Text>
        <OffersSection
          groups={[
            { providerId: provider.id, subtotalMinor: service.priceMinor, serviceId: service.id },
          ]}
          currency={currency}
          compact
        />

        {/* Cost breakdown */}
        <Text style={styles.sectionTitle}>Amount</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service price</Text>
            <Text style={styles.rowValue}>{formatMoney(service.priceMinor, currency)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.discountLabel}>Discount ({appliedCoupon?.code})</Text>
              <Text style={styles.discountValue}>−{formatMoney(discount, currency)}</Text>
            </View>
          )}
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatMoney(total, currency)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue bar */}
      <View style={styles.bar}>
        <View>
          <Text style={styles.barLabel}>Total</Text>
          <Text style={styles.barTotal}>{formatMoney(total, currency)}</Text>
        </View>
        <AppButton style={styles.continueBtn} title="Continue to payment" onPress={openPayment} />
      </View>

      <PaymentMethodModal
        visible={methodOpen}
        total={total}
        currency={currency}
        depositPercent={depositPercent}
        serviceName={service.name}
        loading={paymentBusy}
        onSelect={chooseMethod}
        onClose={closePayment}
      />
    </View>
  );
}
