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
import { FileText, Package, ShoppingCart, TriangleAlert, X } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { INK, LINK, PAGE_BG } from '@/utils/modernTheme';

import { Celebration, NextSteps, PickupCard, PlacedOrderCard } from './parts';
import { styles } from './styles';

/**
 * Full-screen order confirmation, shown once the cart's checkout is done —
 * replaces the old "Order placed" Alert with a real success state (like
 * Swiggy/Zomato/Amazon): a checkmark, a summary of what was placed, and clear
 * next steps, instead of a popup dumping the user straight into the order list.
 */
export default function OrderSuccessScreen() {
  // Loosely typed so navigating to a nested tab screen (Bookings/Home) type-checks.
  const navigation = useNavigation<{ replace: (r: string, p?: object) => void }>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.ORDER_SUCCESS>>();
  const { placed, failedNames = [], currency } = params;
  const insets = useSafeAreaInsets();

  // A gentle staggered reveal — badge pops in first, then the copy, the
  // order summary, and the actions each settle in just after the last.
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

  const single = placed.length === 1 ? placed[0] : null;

  const goToOrders = () => navigation.replace(ROUTES.TABS, { screen: ROUTES.BOOKINGS });
  const goHome = () => navigation.replace(ROUTES.TABS, { screen: ROUTES.HOME });

  const primaryAction = single
    ? () => navigation.replace(ROUTES.ORDER_DETAILS, { orderId: single.orderId })
    : goToOrders;

  // Hardware/gesture back from here should exit to Home, not pop back into
  // the checkout flow that led up to this success state.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.replace(ROUTES.TABS, { screen: ROUTES.HOME });
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  const failedCount = failedNames.length;
  const total = placed.length + failedCount;
  const title =
    failedCount > 0
      ? `${placed.length} of ${total} orders placed`
      : placed.length > 1
        ? `${placed.length} orders placed!`
        : 'Order placed!';
  const subtitle =
    failedCount > 0
      ? `You can track ${placed.length === 1 ? 'it' : 'them'} from Bookings & Orders.`
      : single
        ? `${single.providerName} is getting your order ready. We’ll notify you when it’s packed.`
        : 'Each store is getting its order ready. Track them from Bookings & Orders.';
  // Full layout (summary + next steps + pickup) when exactly one order went through cleanly.
  const detailed = !!single && failedCount === 0;

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
          <Celebration size={detailed ? 96 : 76} />
        </Animated.View>

        <Animated.View style={rise(titleAnim)}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View style={[styles.stack, rise(cardAnim)]}>
          {!detailed && <Text style={styles.sectionLabel}>Placed</Text>}
          {placed.map((p) => (
            <PlacedOrderCard key={p.orderId} placed={p} currency={currency} detailed={detailed} />
          ))}

          {detailed && <NextSteps />}
          {detailed && single && <PickupCard orderId={single.orderId} />}

          {failedCount > 0 && <Text style={styles.sectionLabel}>Not placed</Text>}
          {failedNames.map((name) => (
            <View key={name} style={styles.failCard}>
              <TriangleAlert size={26} color="#EA580C" strokeWidth={1.9} />
              <View style={styles.failBody}>
                <Text style={styles.failTitle}>Payment not completed for {name}</Text>
                <Text style={styles.failText}>
                  This order wasn’t placed. Your cart items for {name} are still saved, so you can
                  try again.
                </Text>
                <TouchableOpacity
                  style={styles.failBtn}
                  onPress={() => navigation.replace(ROUTES.CART)}
                  accessibilityRole="button"
                >
                  <ShoppingCart size={18} color="#C2410C" strokeWidth={2} />
                  <Text style={styles.failBtnText}>Go to cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
          onPress={primaryAction}
          accessibilityRole="button"
        >
          {single ? (
            <Package size={20} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <FileText size={20} color="#FFFFFF" strokeWidth={2} />
          )}
          <Text style={styles.primaryBtnText}>
            {single ? 'Track your order' : 'View my orders'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
          onPress={goHome}
          accessibilityRole="button"
        >
          <ShoppingCart size={20} color={LINK} strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Continue shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
