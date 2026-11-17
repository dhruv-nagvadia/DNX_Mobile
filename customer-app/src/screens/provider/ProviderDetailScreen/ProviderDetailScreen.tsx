import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Users } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { useAppSelector } from '@/redux/hooks';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { LINK, PAGE_BG } from '@/utils/modernTheme';

import { StoreDetail } from '../StoreDetailScreen/StoreDetailScreen';
import { useProviderDetail } from './useProviderDetail';
import { ProviderDetailRouteProp } from './types';
import {
  AboutCard,
  LocationHoursCard,
  OfferCard,
  QuickActions,
  ReviewsSection,
  TopCard,
} from './parts';
import { styles } from './styles';

/** Slots shown per period before "Show more". */
const SLOTS_PREVIEW = 10;

function formatPrice(minor: number, currency: string): string {
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' ? `₹${amount}` : `${amount} ${currency}`;
}

function formatDuration(min: number): string {
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function timeLabel(d: Date): string {
  return d
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();
}

function weekday(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

/**
 * Entry point: picks the store catalog view for STORE businesses, otherwise the
 * service booking view below.
 */
export default function ProviderDetailScreen() {
  const { params } = useRoute<ProviderDetailRouteProp>();
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const { data: provider, isLoading } = useGetProviderByIdQuery({
    id: params.providerId,
    postalCode,
  });

  if (isLoading && !provider) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={params.name ?? 'Business'} />
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      </View>
    );
  }

  if (provider?.type === 'STORE') {
    return <StoreDetail provider={provider} />;
  }

  return <ServiceDetail />;
}

/**
 * Service (appointment) view — mockup "Aura Salon Booking App Interface.png".
 * JSX only; logic comes from useProviderDetail.
 */
function ServiceDetail() {
  const {
    provider,
    isLoading,
    isReschedule,
    headerTitle,
    reviews,
    onViewAllReviews,
    openGallery,
    services,
    selectedService,
    selectedServiceId,
    selectService,
    days,
    dayIndex,
    selectDay,
    slots,
    slotGroups,
    dayOpen,
    selectedSlot,
    selectSlot,
    canBook,
    booking,
    onBook,
    dayClosed,
    offer,
    ratingBreakdown,
    hoursRows,
    address,
    depositPercent,
    onCall,
    onDirections,
    onShare,
    goBack,
  } = useProviderDetail();

  const insets = useSafeAreaInsets();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  if (isLoading || !provider) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={headerTitle} />
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      </View>
    );
  }

  const subline = [
    provider.subcategory?.name ?? provider.category.name,
    services
      .slice(0, 3)
      .map((s) => s.name)
      .join(', '),
  ]
    .filter(Boolean)
    .join(' • ');
  const selectedTime = selectedSlot ? new Date(selectedSlot) : null;
  const priceText = selectedService
    ? formatPrice(selectedService.priceMinor, selectedService.currency)
    : null;
  const barHint = !selectedServiceId
    ? 'Select a service'
    : !selectedSlot
      ? 'Pick a time slot'
      : null;
  // The code is redeemed on the booking summary; tell the customer how.
  const onApplyOffer = () =>
    offer &&
    Alert.alert(
      `Code ${offer.code}`,
      'Pick a service and a time, then tap Book now — you can apply this code on the next screen.',
    );
  const visibleServices = isReschedule ? (selectedService ? [selectedService] : []) : services;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopCard
          provider={provider}
          subline={subline}
          strip={
            provider.areaCount
              ? {
                  icon: <Users size={16} color={LINK} strokeWidth={2} />,
                  text:
                    provider.areaCount === 1
                      ? '1 person from your area booked here'
                      : `${provider.areaCount} people from your area booked here`,
                }
              : null
          }
          onBack={goBack}
          onShare={onShare}
          onOpenImage={openGallery}
        />

        <View style={styles.body}>
          <QuickActions onCall={onCall} onDirections={onDirections} onShare={onShare} />
          {!isReschedule && !!offer && <OfferCard offer={offer} onApply={onApplyOffer} />}

          {/* ── Services ────────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>
            {isReschedule ? 'Rescheduling' : 'Select a service'}
          </Text>
          {visibleServices.length === 0 ? (
            <Text style={styles.muted}>No services listed yet.</Text>
          ) : (
            <View style={styles.serviceCard}>
              {visibleServices.map((s, i) => {
                const active = s.id === selectedServiceId;
                const partial = depositPercent > 0 && s.partialPayEnabled !== false;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.serviceRow,
                      i > 0 && !active && styles.serviceRowDivider,
                      active && styles.serviceRowActive,
                    ]}
                    activeOpacity={0.85}
                    disabled={isReschedule}
                    onPress={() => selectService(s.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{s.name}</Text>
                      <Text style={styles.serviceMeta}>{formatDuration(s.durationMin)}</Text>
                    </View>
                    <View style={styles.servicePriceCol}>
                      <Text style={styles.servicePrice}>
                        {formatPrice(s.priceMinor, s.currency)}
                      </Text>
                      {active && partial && (
                        <View style={styles.payPill}>
                          <Text style={styles.payPillText}>Pay {depositPercent}% now</Text>
                        </View>
                      )}
                    </View>
                    {!isReschedule && (
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active && <View style={styles.radioDot} />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── Date ────────────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Select a date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bleed}
            contentContainerStyle={styles.dayRow}
          >
            {days.map((d, i) => {
              const active = i === dayIndex;
              const closed = dayClosed[i];
              return (
                <TouchableOpacity
                  key={d.toISOString()}
                  style={[
                    styles.dayPill,
                    active && styles.dayPillActive,
                    closed && !active && styles.dayPillClosed,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => selectDay(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    style={[
                      styles.dayWeek,
                      active && styles.dayTextActive,
                      closed && !active && styles.dayTextClosed,
                    ]}
                  >
                    {i === 0 ? 'Today' : weekday(d)}
                  </Text>
                  <Text
                    style={[
                      styles.dayNum,
                      active && styles.dayTextActive,
                      closed && !active && styles.dayTextClosed,
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                  {closed && (
                    <Text style={[styles.dayClosed, active && styles.dayTextActive]}>Closed</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Slots ───────────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Available slots</Text>
          {slots.length === 0 ? (
            <Text style={styles.muted}>
              {!dayOpen
                ? 'Closed on this day — try another date.'
                : selectedServiceId
                  ? 'No open times for this service — try another day.'
                  : 'Fully booked on this day — try another date.'}
            </Text>
          ) : (
            slotGroups.map((group) => {
              const expanded = !!expandedGroups[group.period];
              const shown = expanded ? group.slots : group.slots.slice(0, SLOTS_PREVIEW);
              const hidden = group.slots.length - shown.length;
              return (
                <View key={group.period} style={styles.slotGroup}>
                  <Text style={styles.periodLabel}>{group.period}</Text>
                  <View style={styles.slotWrap}>
                    {shown.map(({ time, booked }) => {
                      const iso = time.toISOString();
                      const active = iso === selectedSlot;
                      return (
                        <TouchableOpacity
                          key={iso}
                          style={[
                            styles.slot,
                            active && styles.slotActive,
                            booked && styles.slotBooked,
                          ]}
                          activeOpacity={0.85}
                          disabled={booked}
                          onPress={() => selectSlot(iso)}
                          accessibilityLabel={`${timeLabel(time)}${booked ? ', booked' : ''}`}
                        >
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.slotText,
                              active && styles.slotTextActive,
                              booked && styles.slotTextBooked,
                            ]}
                          >
                            {timeLabel(time)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {(hidden > 0 || expanded) && group.slots.length > SLOTS_PREVIEW && (
                    <TouchableOpacity
                      style={styles.moreBtn}
                      onPress={() =>
                        setExpandedGroups((g) => ({ ...g, [group.period]: !expanded }))
                      }
                    >
                      <Text style={styles.moreText}>
                        {expanded ? 'Show less' : `Show ${hidden} more`}
                      </Text>
                      {expanded ? (
                        <ChevronUp size={16} color={LINK} />
                      ) : (
                        <ChevronDown size={16} color={LINK} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {!!provider.description && (
            <AboutCard name={provider.businessName} description={provider.description} />
          )}
          <LocationHoursCard
            title="Location & Hours"
            address={address}
            hoursRows={hoursRows}
            onDirections={onDirections}
          />
          {!isReschedule && (
            <ReviewsSection
              provider={provider}
              reviews={reviews}
              ratingBreakdown={ratingBreakdown}
              onViewAll={onViewAllReviews}
            />
          )}
        </View>
      </ScrollView>

      {/* ── Sticky book bar ─────────────────────────────────────────────── */}
      <View style={[styles.bookBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={styles.bookInfo}>
          {barHint ? (
            <Text style={styles.bookHint}>{barHint}</Text>
          ) : (
            <>
              <Text style={styles.bookService} numberOfLines={1}>
                {selectedService?.name}
              </Text>
              <Text style={styles.bookSummary} numberOfLines={1}>
                {priceText} •{' '}
                {selectedTime
                  ? `${weekday(selectedTime)} ${selectedTime.getDate()}, ${timeLabel(selectedTime)}`
                  : ''}
              </Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, !canBook && styles.bookBtnDisabled]}
          onPress={onBook}
          disabled={!canBook}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canBook, busy: booking }}
        >
          {booking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookBtnText}>{isReschedule ? 'Reschedule' : 'Book now'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
