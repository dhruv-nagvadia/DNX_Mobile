import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Store, Plus, Minus, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react-native';

import { AlertBanner } from '@/components/AlertBanner';
import { AppHeader } from '@/components/AppHeader';
import { OffersSection } from '@/components/OffersSection';
import { PaymentMethodModal } from '@/components/PaymentMethodModal';
import { Color } from '@/utils/Theme';
import { formatAmount, unitPriceLabel, amountPrice, formatMoney, baseIncrement } from '@/utils/units';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeFromCart, clearProviderItems, setCartQty } from '@/redux/slices/cartSlice';
import type { CartItem } from '@/redux/slices/cartSlice';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { OrderPaymentMethod } from '@/redux/api/order/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

interface ShopGroup {
  providerId: string;
  providerName: string;
  items: CartItem[];
  subtotal: number;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  // Coupons applied per store — set from the dedicated Coupons screen (or a
  // quick-apply chip), shared via redux so it survives navigating there and back.
  const applied = useAppSelector((s) => s.coupons.applied);

  const [payOpen, setPayOpen] = useState(false);

  // Changing a store's items invalidates any coupon preview for that store.
  const clearCoupon = (providerId: string) => dispatch(clearAppliedCoupon(providerId));

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

  const discountFor = (providerId: string) => applied[providerId]?.discountMinor ?? 0;
  const totalDiscount = groups.reduce((s, g) => s + discountFor(g.providerId), 0);
  const grandTotal = groups.reduce((s, g) => s + g.subtotal, 0) - totalDiscount;
  const hasBelowMin = items.some((i) => i.quantity < i.stepQty);
  const currency = items[0]?.currency ?? 'INR';
  const depositPercent = items[0]?.depositPercent || 20;

  // Items that don't accept Cash on Delivery — greys out the Cash option in
  // the payment sheet instead of hiding it, with a reason the customer can
  // act on (pay online, or remove these items).
  const codBlockedItems = items.filter((i) => i.codEnabled === false);
  const codDisabled = codBlockedItems.length > 0;
  const codDisabledReason = codDisabled
    ? `Cash on Delivery isn't available for ${codBlockedItems.map((i) => i.name).join(', ')} — pay online, or remove ${
        codBlockedItems.length > 1 ? 'them' : 'it'
      } from your cart.`
    : undefined;

  // Same treatment for Partial Pay — greyed out with a reason instead of
  // just silently disappearing from the payment sheet.
  const partialBlockedItems = items.filter((i) => i.partialPayEnabled === false);
  const partialDisabled = partialBlockedItems.length > 0;
  const partialDisabledReason = partialDisabled
    ? `Partial payment isn't available for ${partialBlockedItems.map((i) => i.name).join(', ')} — pay online, or remove ${
        partialBlockedItems.length > 1 ? 'them' : 'it'
      } from your cart.`
    : undefined;

  // Tap a business to see it, or a product to see its page.
  const openStore = (providerId: string, name: string) =>
    navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId, name });
  const openProduct = (it: CartItem) =>
    navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: it.providerId, productId: it.productId });

  const setQty = (it: CartItem, quantity: number) => {
    clearCoupon(it.providerId); // discount preview may no longer be valid
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
          unlimitedStock: it.unlimitedStock,
          stepQty: it.stepQty,
          imageUrl: it.imageUrl,
          depositPercent: it.depositPercent,
          codEnabled: it.codEnabled,
          partialPayEnabled: it.partialPayEnabled,
        },
        quantity: it.unlimitedStock
          ? Math.max(0, quantity)
          : Math.max(0, Math.min(quantity, it.stockQty)),
      }),
    );
  };

  // Hands off to a dedicated full-screen flow that places each store's order
  // and (for online/partial) opens Razorpay itself — see CheckoutProcessingScreen
  // for why this doesn't happen here in the modal anymore.
  const placeAll = (method: OrderPaymentMethod) => {
    setPayOpen(false);
    navigation.replace(ROUTES.CHECKOUT_PROCESSING, {
      method,
      currency,
      groups: groups.map((g) => ({
        providerId: g.providerId,
        providerName: g.providerName,
        items: g.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode: applied[g.providerId]?.code,
      })),
    });
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

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 130 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.note}>
          {groups.length > 1
            ? 'Each store gets its own pickup order, but you pay once for everything.'
            : 'Your pickup order.'}
        </Text>

        {groups.map((g) => {
          const coupon = applied[g.providerId];
          return (
          <View key={g.providerId} style={styles.shopCard}>
            <View style={styles.shopHead}>
              <TouchableOpacity
                style={styles.shopTap}
                activeOpacity={0.7}
                onPress={() => openStore(g.providerId, g.providerName)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${g.providerName}`}
              >
                <View style={styles.shopIcon}>
                  <Store size={16} color={Color.primaryDark} />
                </View>
                <Text style={styles.shopName} numberOfLines={1}>
                  {g.providerName}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(clearProviderItems(g.providerId));
                  clearCoupon(g.providerId);
                }}
              >
                <Text style={styles.clearShop}>Clear</Text>
              </TouchableOpacity>
            </View>

            {g.items.map((it) => {
              const inc = baseIncrement(it.measure);
              const belowMin = it.quantity < it.stepQty;
              return (
                <View key={it.productId} style={styles.itemRow}>
                  {/* Left: product image */}
                  <TouchableOpacity
                    style={styles.thumb}
                    activeOpacity={0.8}
                    onPress={() => openProduct(it)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${it.name}`}
                  >
                    {it.imageUrl ? (
                      <Image source={{ uri: it.imageUrl }} style={styles.thumbImg} />
                    ) : (
                      <ShoppingBag size={22} color={Color.primary} />
                    )}
                  </TouchableOpacity>

                  {/* Right: details */}
                  <View style={styles.itemMain}>
                    <View style={styles.itemTop}>
                      <TouchableOpacity
                        style={styles.itemNameTap}
                        activeOpacity={0.7}
                        onPress={() => openProduct(it)}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${it.name}`}
                      >
                        <Text style={styles.itemName} numberOfLines={2}>
                          {it.name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => {
                          dispatch(removeFromCart(it.productId));
                          clearCoupon(it.providerId);
                        }}
                      >
                        <Trash2 size={15} color={Color.error} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemUnit}>
                      {unitPriceLabel(it.priceMinor, it.priceQty, it.measure, it.currency)}
                    </Text>

                    <View style={styles.itemBottom}>
                      <View style={styles.stepper}>
                        <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(it, it.quantity - inc)}>
                          <Minus size={15} color={Color.primary} />
                        </TouchableOpacity>
                        <Text style={styles.qty}>{formatAmount(it.quantity, it.measure)}</Text>
                        <TouchableOpacity
                          style={[
                            styles.stepBtn,
                            !it.unlimitedStock && it.quantity + inc > it.stockQty && styles.disabled,
                          ]}
                          disabled={!it.unlimitedStock && it.quantity + inc > it.stockQty}
                          onPress={() => setQty(it, it.quantity + inc)}
                        >
                          <Plus size={15} color={Color.primary} />
                        </TouchableOpacity>
                      </View>
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
                </View>
              );
            })}

            {/* Offers — compact: no chip previews, just "View all coupons" until applied */}
            <OffersSection
              groups={[
                {
                  providerId: g.providerId,
                  subtotalMinor: g.subtotal,
                  items: g.items.map((it) => ({
                    productId: it.productId,
                    lineTotalMinor: amountPrice(it.quantity, it.priceQty, it.priceMinor),
                  })),
                },
              ]}
              currency={currency}
              compact
            />

            {/* Totals */}
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formatMoney(g.subtotal, currency)}</Text>
            </View>
            {coupon && (
              <>
                <View style={styles.totalLine}>
                  <Text style={styles.discountLabel}>Discount ({coupon.code})</Text>
                  <Text style={styles.discountValue}>
                    −{formatMoney(coupon.discountMinor, currency)}
                  </Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.subtotalValue}>
                    {formatMoney(g.subtotal - coupon.discountMinor, currency)}
                  </Text>
                </View>
              </>
            )}
          </View>
          );
        })}

        {codDisabled && (
          <View style={styles.codBanner}>
            <AlertBanner tone="error" message={codDisabledReason!} />
          </View>
        )}
        {partialDisabled && (
          <View style={styles.codBanner}>
            <AlertBanner tone="error" message={partialDisabledReason!} />
          </View>
        )}
      </ScrollView>

      {/* Checkout bar → opens the payment sheet, where offers can be applied */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.barLabel}>Total ({groups.length} shop{groups.length > 1 ? 's' : ''})</Text>
          <Text style={styles.barTotal}>{formatMoney(grandTotal, currency)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, hasBelowMin && styles.disabled]}
          activeOpacity={0.9}
          disabled={hasBelowMin}
          onPress={() => setPayOpen(true)}
        >
          <Text style={styles.placeText}>{hasBelowMin ? 'Below minimum' : 'Checkout'}</Text>
        </TouchableOpacity>
      </View>

      <PaymentMethodModal
        visible={payOpen}
        total={grandTotal}
        currency={currency}
        depositPercent={depositPercent}
        codDisabled={codDisabled}
        codDisabledReason={codDisabledReason}
        partialDisabled={partialDisabled}
        partialDisabledReason={partialDisabledReason}
        onSelect={(m) => placeAll(m as OrderPaymentMethod)}
        onClose={() => setPayOpen(false)}
      />
    </View>
  );
}
