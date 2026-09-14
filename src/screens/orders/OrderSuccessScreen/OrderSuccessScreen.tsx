import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CheckCircle2, ShoppingBag, TriangleAlert } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/units';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.badgeWrap,
            { opacity: badgeAnim, transform: [{ scale: badgeAnim }] },
          ]}
        >
          <View style={styles.badge}>
            <CheckCircle2 size={56} color={Color.success} strokeWidth={2} />
          </View>
        </Animated.View>

        <Animated.View style={rise(titleAnim)}>
          <Text style={styles.title}>Order placed!</Text>
          <Text style={styles.subtitle}>
            {single
              ? `Your order from ${single.providerName} has been placed successfully.`
              : `${placed.length} orders placed successfully. You can track each one from Bookings & Orders.`}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.card, rise(cardAnim)]}>
          {placed.map((o, i) => (
            <View key={o.orderId} style={[styles.orderRow, i === placed.length - 1 && styles.orderRowLast]}>
              <View style={styles.orderIcon}>
                <ShoppingBag size={18} color={Color.primary} />
              </View>
              <View style={styles.orderMain}>
                <Text style={styles.orderName} numberOfLines={1}>
                  {o.providerName}
                </Text>
                <Text style={styles.orderMeta}>Placed</Text>
              </View>
              <Text style={styles.orderAmount}>{formatMoney(o.amountMinor, currency)}</Text>
            </View>
          ))}
        </Animated.View>

        {failedNames.length > 0 && (
          <Animated.View style={[styles.warningCard, rise(cardAnim)]}>
            <TriangleAlert size={18} color={Color.warning} />
            <View style={styles.warningTextWrap}>
              <Text style={styles.warningTitle}>Payment not completed</Text>
              <Text style={styles.warningText}>
                {failedNames.join(', ')} — {failedNames.length > 1 ? "weren't" : "wasn't"} placed. Your cart items for{' '}
                {failedNames.length > 1 ? 'them are' : 'it is'} still saved, so you can try again.
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.actions, rise(actionsAnim)]}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={primaryAction}>
            <Text style={styles.primaryBtnText}>{single ? 'Track your order' : 'View my orders'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={goHome}>
            <Text style={styles.secondaryBtnText}>Continue shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
