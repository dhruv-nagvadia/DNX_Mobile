import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Store, Plus, Minus, Trash2, ShoppingCart, Check } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { formatAmount, unitPriceLabel, amountPrice, formatMoney, baseIncrement } from '@/utils/units';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartQty, removeFromCart, clearProviderItems } from '@/redux/slices/cartSlice';
import type { CartItem } from '@/redux/slices/cartSlice';
import { useCreateOrderMutation } from '@/redux/api/order/orderApi';
import { providerApi } from '@/redux/api/provider/providerApi';
import { OrderPaymentMethod } from '@/redux/api/order/types';
import { ROUTES } from '@/navigation/routes';

import { styles } from './styles';

interface ShopGroup {
  providerId: string;
  providerName: string;
  items: CartItem[];
  subtotal: number;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void }>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const [createOrder] = useCreateOrderMutation();

  const [method, setMethod] = useState<OrderPaymentMethod>('ONLINE');
  const [placing, setPlacing] = useState(false);

  // Group the cart by shop — each shop is its own pickup order.
  const groups = useMemo<ShopGroup[]>(() => {
    const map = new Map<string, ShopGroup>();
    for (const it of items) {
      const g =
        map.get(it.providerId) ??
        { providerId: it.providerId, providerName: it.providerName, items: [], subtotal: 0 };
      g.items.push(it);
      g.subtotal += amountPrice(it.quantity, it.priceQty, it.priceMinor);
      map.set(it.providerId, g);
    }
    return Array.from(map.values());
  }, [items]);

  const grandTotal = groups.reduce((s, g) => s + g.subtotal, 0);
  // Any item below the store's required minimum blocks checkout.
  const hasBelowMin = items.some((i) => i.quantity < i.stepQty);

  const setQty = (it: CartItem, quantity: number) => {
    dispatch(
      setCartQty({
        item: {
          productId: it.productId,
          providerId: it.providerId,
          providerName: it.providerName,
          name: it.name,
          measure: it.measure,
          priceMinor: it.priceMinor,
          priceQty: it.priceQty,
          currency: it.currency,
          stockQty: it.stockQty,
          stepQty: it.stepQty,
        },
        quantity: Math.max(0, Math.min(quantity, it.stockQty)),
      }),
    );
  };

  const placeAll = async () => {
    setPlacing(true);
    const failed: string[] = [];
    for (const g of groups) {
      try {
        await createOrder({
          providerId: g.providerId,
          paymentMethod: method,
          items: g.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }).unwrap();
        dispatch(clearProviderItems(g.providerId));
        // Stock changed — refresh this store (and the lists) so it isn't stale.
        dispatch(
          providerApi.util.invalidateTags([{ type: 'Provider', id: g.providerId }, 'Providers']),
        );
      } catch {
        failed.push(g.providerName);
      }
    }
    setPlacing(false);

    if (failed.length === 0) {
      Alert.alert(
        'Order placed',
        `${groups.length} order${groups.length > 1 ? 's' : ''} placed. Track ${
          groups.length > 1 ? 'them' : 'it'
        } under the Bookings tab.`,
        [{ text: 'Done', onPress: () => navigation.navigate(ROUTES.TABS, { screen: ROUTES.BOOKINGS }) }],
      );
    } else {
      Alert.alert('Some orders couldn’t be placed', `Please review: ${failed.join(', ')}.`);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="Your cart" />
        <View style={styles.center}>
          <ShoppingCart size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add products from a store to place a pickup order.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Your cart" />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 140 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.note}>Each store is a separate pickup order.</Text>

        {groups.map((g) => (
          <View key={g.providerId} style={styles.shopCard}>
            <View style={styles.shopHead}>
              <View style={styles.shopIcon}>
                <Store size={16} color={Color.primaryDark} />
              </View>
              <Text style={styles.shopName} numberOfLines={1}>
                {g.providerName}
              </Text>
              <TouchableOpacity onPress={() => dispatch(clearProviderItems(g.providerId))}>
                <Text style={styles.clearShop}>Clear</Text>
              </TouchableOpacity>
            </View>

            {g.items.map((it) => {
              const inc = baseIncrement(it.measure);
              const belowMin = it.quantity < it.stepQty;
              return (
                <View key={it.productId} style={styles.itemRow}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {it.name}
                    </Text>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => dispatch(removeFromCart(it.productId))}>
                      <Trash2 size={15} color={Color.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemBottom}>
                    <View style={styles.stepper}>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(it, it.quantity - inc)}>
                        <Minus size={15} color={Color.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qty}>{formatAmount(it.quantity, it.measure)}</Text>
                      <TouchableOpacity
                        style={[styles.stepBtn, it.quantity + inc > it.stockQty && styles.disabled]}
                        disabled={it.quantity + inc > it.stockQty}
                        onPress={() => setQty(it, it.quantity + inc)}
                      >
                        <Plus size={15} color={Color.primary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemUnit} numberOfLines={1}>
                      {unitPriceLabel(it.priceMinor, it.priceQty, it.measure, it.currency)}
                    </Text>
                    <Text style={styles.lineTotal}>
                      {formatMoney(amountPrice(it.quantity, it.priceQty, it.priceMinor), it.currency)}
                    </Text>
                  </View>

                  {belowMin && (
                    <Text style={styles.minMsg}>
                      Minimum order is {formatAmount(it.stepQty, it.measure)} — add a little more.
                    </Text>
                  )}
                </View>
              );
            })}

            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formatMoney(g.subtotal)}</Text>
            </View>
          </View>
        ))}

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Payment</Text>
        {(['ONLINE', 'CASH'] as OrderPaymentMethod[]).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.payOption, method === m && styles.payOptionActive]}
            activeOpacity={0.85}
            onPress={() => setMethod(m)}
          >
            <View style={styles.payText}>
              <Text style={styles.payTitle}>{m === 'ONLINE' ? 'Pay online now' : 'Pay cash at pickup'}</Text>
              <Text style={styles.paySub}>
                {m === 'ONLINE' ? 'Pay upfront and collect your order' : 'Reserve now, pay when you collect'}
              </Text>
            </View>
            {method === m && <Check size={18} color={Color.primary} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Place orders */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.barLabel}>Total ({groups.length} shop{groups.length > 1 ? 's' : ''})</Text>
          <Text style={styles.barTotal}>{formatMoney(grandTotal)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, (placing || hasBelowMin) && styles.disabled]}
          activeOpacity={0.9}
          disabled={placing || hasBelowMin}
          onPress={placeAll}
        >
          {placing ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <Text style={styles.placeText}>
              {hasBelowMin
                ? 'Below minimum'
                : `Place ${groups.length} order${groups.length > 1 ? 's' : ''}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
