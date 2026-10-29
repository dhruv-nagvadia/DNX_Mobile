import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CheckCircle2, TriangleAlert } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/units';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const OUTCOME_COPY: Record<RootStackParamList[typeof ROUTES.BOOKING_SUCCESS]['outcome'], string> = {
  paid: 'Booking confirmed!',
  partial: 'Booking confirmed!',
  cash: 'Booking confirmed!',
  pending: 'Booking confirmed',
};

/**
 * Full-screen booking confirmation — mirrors OrderSuccessScreen for the same
 * reason: a real success state (checkmark, summary, clear next step) instead
 * of a popup dumping the user straight into the bookings list.
 */
export default function BookingSuccessScreen() {
  // Loosely typed so navigating to a nested tab screen (Bookings/Home) type-checks.
  const navigation = useNavigation<{ replace: (r: string, p?: object) => void }>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.BOOKING_SUCCESS>>();
  const { bookingId, providerName, serviceName, startTime, amountMinor, amountPaidMinor, currency, outcome } = params;

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

  const paymentLine = (() => {
    if (outcome === 'cash') {
      return 'Pay cash at the venue';
    }
    if (outcome === 'pending') {
      return 'Not paid yet';
    }
    if (outcome === 'partial') {
      return `${formatMoney(amountPaidMinor, currency)} paid · ${formatMoney(due, currency)} at the venue`;
    }
    return `${formatMoney(amountPaidMinor, currency)} paid`;
  })();

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.badgeWrap, { opacity: badgeAnim, transform: [{ scale: badgeAnim }] }]}>
          <View style={[styles.badge, pending && styles.badgePending]}>
            {pending ? (
              <TriangleAlert size={52} color={Color.warning} strokeWidth={2} />
            ) : (
              <CheckCircle2 size={56} color={Color.success} strokeWidth={2} />
            )}
          </View>
        </Animated.View>

        <Animated.View style={rise(titleAnim)}>
          <Text style={styles.title}>{OUTCOME_COPY[outcome]}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, rise(cardAnim)]}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service</Text>
            <Text style={styles.rowValue}>{serviceName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>When</Text>
            <Text style={styles.rowValue}>{formatWhen(startTime)}</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Payment</Text>
            <Text style={styles.rowValue}>{paymentLine}</Text>
          </View>
        </Animated.View>

        {pending && (
          <Animated.View style={[styles.warningCard, rise(cardAnim)]}>
            <TriangleAlert size={18} color={Color.warning} />
            <View style={styles.warningTextWrap}>
              <Text style={styles.warningTitle}>Payment not completed</Text>
              <Text style={styles.warningText}>
                Your booking is still saved. You can pay from the booking's details page.
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.actions, rise(actionsAnim)]}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={goToBooking}>
            <Text style={styles.primaryBtnText}>View booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={goHome}>
            <Text style={styles.secondaryBtnText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
