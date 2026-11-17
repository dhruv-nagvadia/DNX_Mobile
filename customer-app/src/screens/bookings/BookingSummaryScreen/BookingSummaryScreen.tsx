import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  House,
  Info,
  MapPin,
  PartyPopper,
  Plus,
} from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { PaymentMethodModal } from '@/components/PaymentMethodModal';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';
import { formatAddress } from '@/utils/formatAddress';

import { useBookingSummary } from './useBookingSummary';
import {
  BusinessCard,
  DashedLine,
  OffersStrip,
  formatClock,
  formatDay,
  formatDuration,
  formatKm,
} from './parts';
import { styles } from './styles';

const MUTED_ICON = '#64748B';

function Header() {
  return (
    <View>
      <ScreenHeader title="Review & pay" subtitle="Step 2 of 2" />
      <View
        style={styles.progress}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Step 2 of 2"
      >
        <View style={styles.progressSeg} />
        <View style={styles.progressSeg} />
      </View>
    </View>
  );
}

/** Review-and-pay step: booking details, cost breakdown, and offers — before choosing how to pay. */
export default function BookingSummaryScreen() {
  const insets = useSafeAreaInsets();
  const {
    provider,
    service,
    isLoading,
    startTime,
    total,
    currency,
    depositPercent,
    appliedCoupon,
    needsAddress,
    travelFeeMinor,
    travelKm,
    addresses,
    selectedAddress,
    addressModalOpen,
    openAddressModal,
    closeAddressModal,
    selectAddress,
    goToAddAddress,
    changeAppointment,
    methodOpen,
    openPayment,
    closePayment,
    chooseMethod,
  } = useBookingSummary();

  if (isLoading || !provider || !service) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      </View>
    );
  }

  const discount = appliedCoupon?.discountMinor ?? 0;
  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.durationMin * 60_000);
  const km = travelKm != null ? formatKm(travelKm) : null;

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BusinessCard provider={provider} />

        {/* ── Your appointment ─────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Your appointment</Text>
            <TouchableOpacity
              onPress={changeAppointment}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Change service or time"
            >
              <Text style={styles.link}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.apptRow}>
            <View style={styles.apptIcon}>
              <CategoryIcon slug={provider.category.slug} size={18} color={INK} />
            </View>
            <View style={styles.apptText}>
              <Text style={styles.apptTitle} numberOfLines={2}>
                {service.name}
              </Text>
              <Text style={styles.apptSub}>{formatDuration(service.durationMin)}</Text>
            </View>
          </View>
          <View style={[styles.apptRow, styles.apptDivider]}>
            <View style={styles.apptIcon}>
              <CalendarDays size={20} color={INK} strokeWidth={1.8} />
            </View>
            <Text style={styles.apptTitle}>{formatDay(start)}</Text>
          </View>
          <View style={[styles.apptRow, styles.apptDivider]}>
            <View style={styles.apptIcon}>
              <Clock3 size={20} color={INK} strokeWidth={1.8} />
            </View>
            <Text style={styles.apptTitle}>
              {formatClock(start)} – {formatClock(end)}
            </Text>
          </View>
        </View>

        {/* ── Where should they come? (at-home services) ──────────────── */}
        {needsAddress && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Where should they come?</Text>
            {selectedAddress ? (
              <View style={styles.addrRow}>
                <View style={styles.addrIcon}>
                  <House size={20} color={INK} strokeWidth={1.8} />
                </View>
                <View style={styles.apptText}>
                  <Text style={styles.addrLabel}>{selectedAddress.label || 'Address'}</Text>
                  <Text style={styles.addrLine}>{formatAddress(selectedAddress)}</Text>
                </View>
                <TouchableOpacity
                  onPress={openAddressModal}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Change address"
                >
                  <Text style={styles.link}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addrRow}
                activeOpacity={0.8}
                onPress={openAddressModal}
                accessibilityRole="button"
                accessibilityLabel="Choose an address"
              >
                <View style={styles.addrIcon}>
                  <MapPin size={20} color={LINK} strokeWidth={1.8} />
                </View>
                <View style={styles.apptText}>
                  <Text style={styles.addrPlaceholder}>Choose an address</Text>
                  <Text style={styles.addrLine}>Needed so the provider can come to you</Text>
                </View>
                <Text style={styles.link}>Select</Text>
              </TouchableOpacity>
            )}
            {!!selectedAddress && km != null && (
              <View style={styles.travelRow}>
                <Car size={18} color={MUTED_ICON} strokeWidth={1.8} />
                <Text style={styles.travelText}>They’ll travel ~{km} km to you</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Offers ───────────────────────────────────────────────────── */}
        <OffersStrip
          providerId={provider.id}
          serviceId={service.id}
          subtotalMinor={service.priceMinor}
          currency={currency}
        />

        {/* ── Bill details ─────────────────────────────────────────────── */}
        <View style={[styles.card, styles.billCard]}>
          <Text style={styles.cardTitle}>Bill details</Text>
          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Service price</Text>
            <Text style={styles.billValue}>{formatMoney(service.priceMinor, currency)}</Text>
          </View>
          {travelFeeMinor > 0 && (
            <View style={styles.billLine}>
              <Text style={styles.billLabel}>Travel fee{km != null ? ` (${km} km)` : ''}</Text>
              <Text style={styles.billValue}>{formatMoney(travelFeeMinor, currency)}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.billLine}>
              <Text style={styles.discLabel}>Coupon {appliedCoupon?.code}</Text>
              <Text style={styles.discLabel}>−{formatMoney(discount, currency)}</Text>
            </View>
          )}
          <DashedLine />
          <View style={styles.billLine}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatMoney(total, currency)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.savePill}>
              <PartyPopper size={16} color="#15803D" strokeWidth={2} />
              <Text style={styles.saveText}>
                You’re saving {formatMoney(discount, currency)} on this booking
              </Text>
            </View>
          )}
        </View>

        {/* ── Cancellation note ────────────────────────────────────────── */}
        <View style={styles.infoStrip}>
          <Info size={18} color={LINK} strokeWidth={2} />
          <Text style={styles.infoText}>Free cancellation until your slot starts.</Text>
        </View>
      </ScrollView>

      {/* ── Sticky continue bar ────────────────────────────────────────── */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={styles.barInfo}>
          <Text style={styles.barLabel}>Total</Text>
          <Text style={styles.barTotal}>{formatMoney(total, currency)}</Text>
          {discount > 0 && (
            <Text style={styles.barSaved}>Saved {formatMoney(discount, currency)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.9}
          onPress={openPayment}
          accessibilityRole="button"
          accessibilityLabel="Continue to payment"
        >
          <Text style={styles.payBtnText}>Continue to payment</Text>
          <ArrowRight size={20} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <PaymentMethodModal
        visible={methodOpen}
        total={total}
        currency={currency}
        depositPercent={depositPercent}
        serviceName={service.name}
        context="visit"
        onSelect={chooseMethod}
        onClose={closePayment}
      />

      {needsAddress && (
        <Modal
          visible={addressModalOpen}
          transparent
          animationType="slide"
          onRequestClose={closeAddressModal}
        >
          <TouchableOpacity
            style={styles.sheetOverlay}
            activeOpacity={1}
            onPress={closeAddressModal}
          >
            <TouchableOpacity activeOpacity={1} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Choose an address</Text>
              <ScrollView
                style={styles.addressScrollArea}
                showsVerticalScrollIndicator
                nestedScrollEnabled
              >
                {addresses.map((a) => {
                  const selected = selectedAddress?.id === a.id;
                  return (
                    <TouchableOpacity
                      key={a.id}
                      style={styles.addressOption}
                      activeOpacity={0.7}
                      onPress={() => selectAddress(a)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                    >
                      <View style={[styles.addressRadio, selected && styles.addressRadioSelected]}>
                        {selected && <View style={styles.addressRadioDot} />}
                      </View>
                      <View style={styles.apptText}>
                        {!!a.label && <Text style={styles.addressLabel}>{a.label}</Text>}
                        <Text style={styles.addrLine}>{formatAddress(a)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.addNewAddressBtn}
                activeOpacity={0.85}
                onPress={goToAddAddress}
                accessibilityRole="button"
              >
                <Plus size={16} color={LINK} />
                <Text style={styles.addNewAddressBtnText}>Add new address</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}
