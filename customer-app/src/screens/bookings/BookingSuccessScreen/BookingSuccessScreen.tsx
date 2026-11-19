import React, { useEffect, useRef } from 'react';
import {
  Animated,
  BackHandler,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarCheck, House, X } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { INK, LINK, PAGE_BG } from '@/utils/modernTheme';

import { BookingCard, Celebration, NextSteps, PaymentPendingCard, WhereCard } from './parts';
import { styles } from './styles';

const OUTCOME_COPY: Record<RootStackParamList[typeof ROUTES.BOOKING_SUCCESS]['outcome'], string> = {
  paid: 'Booking confirmed!',
  partial: 'Booking confirmed!',
  cash: 'Booking confirmed!',
  pending: 'Booking confirmed',
};

/**
 * Full-screen booking confirmation — the booking twin of OrderSuccessScreen:
 * a real success state (checkmark, summary, next steps, where to go) instead
 * of a popup dumping the user straight into the bookings list.
 */
export default function BookingSuccessScreen() {
  // Loosely typed so navigating to a nested tab screen (Bookings/Home) type-checks.
  const navigation = useNavigation<{ replace: (r: string, p?: object) => void }>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.BOOKING_SUCCESS>>();
  const {
    bookingId,
    providerName,
    serviceName,
    startTime,
    amountMinor,
    amountPaidMinor,
    currency,
    outcome,
  } = params;
  const insets = useSafeAreaInsets();

  // The params carry everything essential; the booking (end time, status,
  // at-home address) and its business (photo, address) are a progressive
  // enhancement once the lists load.
  const { data: bookings = [] } = useGetMyBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const booking = bookings.find((b) => b.id === bookingId) ?? null;
  const providerId = booking?.provider.id ?? '';
  const { data: provider } = useGetProviderByIdQuery({ id: providerId }, { skip: !providerId });
  const photo = provider?.images?.[0] ?? booking?.provider.images?.[0];
  const homeAddress = booking?.serviceAddressLine;

  const badgeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(badgeAnim, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
      Animated.timing(titleAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(actionsAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [badgeAnim, titleAnim, cardAnim, actionsAnim]);

  const rise = (v: Animated.Value) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  });

  const pending = outcome === 'pending';
  const due = Math.max(0, amountMinor - amountPaidMinor);

  const subtitle =
    outcome === 'cash'
      ? `Your appointment with ${providerName} is booked. Pay cash when you arrive.`
      : pending
        ? `Your appointment with ${providerName} is booked, but the payment didn't go through.`
        : `Your appointment with ${providerName} is booked and confirmed.`;

  const goToBooking = () => navigation.replace(ROUTES.BOOKING_DETAILS, { bookingId });
  const goHome = () => navigation.replace(ROUTES.TABS, { screen: ROUTES.HOME });

  // Hardware/gesture back from here should exit to Home, not pop back into
  // the now-stale booking summary screen that led up to this success state.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.replace(ROUTES.TABS, { screen: ROUTES.HOME });
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <TouchableOpacity
        style={[styles.closeBtn, { top: insets.top + 10 }]}
        onPress={goHome}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <X size={22} color={INK} strokeWidth={2.2} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[styles.badgeWrap, { opacity: badgeAnim, transform: [{ scale: badgeAnim }] }]}
        >
          <Celebration size={96} warning={pending} />
        </Animated.View>

        <Animated.View style={rise(titleAnim)}>
          <Text style={styles.title} accessibilityRole="header">
            {OUTCOME_COPY[outcome]}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View style={[styles.stack, rise(cardAnim)]}>
          <BookingCard
            bookingId={bookingId}
            providerName={providerName}
            serviceName={serviceName}
            startTime={startTime}
            booking={booking}
            photo={photo}
            total={amountMinor}
            paid={amountPaidMinor}
            due={due}
            currency={currency}
            outcome={outcome}
          />
          {pending && <PaymentPendingCard />}
          <NextSteps providerName={providerName} atHome={!!homeAddress} />
          <WhereCard homeAddress={homeAddress} provider={provider} />
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={[
          styles.actions,
          { paddingBottom: Math.max(insets.bottom, 12) + 4 },
          rise(actionsAnim),
        ]}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.9}
          onPress={goToBooking}
          accessibilityRole="button"
        >
          <CalendarCheck size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.primaryBtnText}>View booking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
          onPress={goHome}
          accessibilityRole="button"
        >
          <House size={20} color={LINK} strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Back to home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
