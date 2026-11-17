import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Apple,
  ArrowRight,
  Banknote,
  CalendarClock,
  ChevronRight,
  CreditCard,
  Egg,
  Image as ImageIcon,
  Minus,
  PartyPopper,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  TriangleAlert,
} from 'lucide-react-native';

import { PaymentMethodModal } from '@/components/PaymentMethodModal';
import { RemoteImage } from '@/components/RemoteImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { formatAmount, priceLabel, amountPrice, formatMoney, baseIncrement } from '@/utils/units';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeFromCart, clearProviderItems, setCartQty } from '@/redux/slices/cartSlice';
import type { CartItem } from '@/redux/slices/cartSlice';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { OrderPaymentMethod } from '@/redux/api/order/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { StoreHeader, StoreOfferRow } from './CartParts';
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
      const g = map.get(it.providerId) ?? {
        providerId: it.providerId,
        providerName: it.providerName,
        items: [],
        subtotal: 0,
      };
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
    navigation.navigate(ROUTES.PRODUCT_DETAILS, {
      providerId: it.providerId,
      productId: it.productId,
    });

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

  const itemsTotal = groups.reduce((sum, g) => sum + g.subtotal, 0);
  const itemCount = items.filter((i) => i.quantity > 0).length;
  const storeWord = groups.length === 1 ? 'store' : 'stores';

  const goShopping = () =>
    // Back to the Home tab inside the tab navigator.
    navigation.dispatch(
      CommonActions.navigate({ name: ROUTES.TABS, params: { screen: ROUTES.HOME } }),
    );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Your cart" subtitle="0 items" />
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCard}>
            {/* Icon composition — no bundled illustration image. */}
            <View style={styles.emptyArt}>
              <View style={styles.emptyBlob} />
              <View style={styles.emptyBag}>
                <ShoppingBag size={72} color="#1D4ED8" strokeWidth={1.4} />
              </View>
              <View style={[styles.emptyBadge, styles.emptyBadgeLeft]}>
                <Apple size={22} color="#DC2626" strokeWidth={1.8} />
              </View>
              <View style={[styles.emptyBadge, styles.emptyBadgeRight]}>
                <Egg size={22} color="#C2410C" strokeWidth={1.8} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Add products from a store to place a pickup order.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={goShopping}
              activeOpacity={0.9}
              accessibilityRole="button"
            >
              <Text style={styles.emptyBtnText}>Browse stores</Text>
            </TouchableOpacity>
            <View style={styles.emptyNote}>
              <Store size={22} color="#1D4ED8" strokeWidth={1.8} />
              <View style={styles.emptyNoteSep} />
              <Text style={styles.emptyNoteText}>
                Pickup orders are packed by each store separately.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const payOptions = [
    { key: 'online', label: 'Pay online (UPI, cards)', Icon: CreditCard, off: false },
    {
      key: 'partial',
      label: `Pay ${depositPercent}% now, rest at pickup`,
      Icon: CalendarClock,
      off: partialDisabled,
    },
    { key: 'cash', label: 'Cash at pickup', Icon: Banknote, off: codDisabled },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Your cart"
        subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'} from ${groups.length} ${storeWord}`}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoStrip}>
          <ShoppingBag size={20} color="#1D4ED8" strokeWidth={1.9} />
          <Text style={styles.infoText}>
            {groups.length > 1
              ? 'Each store packs its own order. You pay once and pick up from each store.'
              : 'The store packs your order — pick it up when it’s ready.'}
          </Text>
        </View>

        {groups.map((g) => {
          const coupon = applied[g.providerId];
          const lines = g.items.map((it) => ({
            productId: it.productId,
            lineTotalMinor: amountPrice(it.quantity, it.priceQty, it.priceMinor),
          }));
          return (
            <View key={g.providerId} style={styles.shopCard}>
              <StoreHeader
                providerId={g.providerId}
                providerName={g.providerName}
                onOpen={() => openStore(g.providerId, g.providerName)}
                onClear={() => {
                  dispatch(clearProviderItems(g.providerId));
                  clearCoupon(g.providerId);
                }}
              />

              {g.items.map((it) => {
                const inc = baseIncrement(it.measure);
                const belowMin = it.quantity < it.stepQty;
                const atMax = !it.unlimitedStock && it.quantity + inc > it.stockQty;
                return (
                  <View key={it.productId} style={styles.itemRow}>
                    <TouchableOpacity
                      style={styles.thumb}
                      activeOpacity={0.8}
                      onPress={() => openProduct(it)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${it.name}`}
                    >
                      <RemoteImage
                        uris={[it.imageUrl]}
                        style={styles.fill}
                        resizeMode="cover"
                        fallback={<ImageIcon size={22} color="#94A3B8" strokeWidth={1.5} />}
                      />
                    </TouchableOpacity>
                    <View style={styles.itemMain}>
                      <View style={styles.itemTop}>
                        <TouchableOpacity
                          style={styles.itemNameTap}
                          activeOpacity={0.7}
                          onPress={() => openProduct(it)}
                          accessibilityRole="button"
                        >
                          <Text style={styles.itemName} numberOfLines={1}>
                            {it.name}
                          </Text>
                          <Text style={styles.itemUnit}>
                            {priceLabel(it.priceMinor, it.priceQty, it.measure, it.currency)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(removeFromCart(it.productId));
                            clearCoupon(it.providerId);
                          }}
                          hitSlop={10}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${it.name}`}
                        >
                          <Trash2 size={18} color="#64748B" strokeWidth={1.8} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.itemBottom}>
                        <View style={styles.stepper}>
                          <TouchableOpacity
                            style={styles.stepBtn}
                            onPress={() => setQty(it, it.quantity - inc)}
                            hitSlop={6}
                            accessibilityLabel="Decrease"
                          >
                            <Minus size={15} color="#FFFFFF" strokeWidth={2.8} />
                          </TouchableOpacity>
                          <Text style={styles.qty}>{formatAmount(it.quantity, it.measure)}</Text>
                          <TouchableOpacity
                            style={[styles.stepBtn, atMax && styles.disabled]}
                            disabled={atMax}
                            onPress={() => setQty(it, it.quantity + inc)}
                            hitSlop={6}
                            accessibilityLabel="Increase"
                          >
                            <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.lineTotal}>
                          {formatMoney(
                            amountPrice(it.quantity, it.priceQty, it.priceMinor),
                            it.currency,
                          )}
                        </Text>
                      </View>
                      {belowMin && (
                        <View style={styles.warnRow}>
                          <TriangleAlert size={14} color="#EA580C" strokeWidth={2} />
                          <Text style={styles.warnText}>
                            Minimum order is {formatAmount(it.stepQty, it.measure)} — add a little
                            more.
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}

              <StoreOfferRow
                providerId={g.providerId}
                subtotalMinor={g.subtotal}
                items={lines}
                currency={currency}
              />

              <View style={styles.totals}>
                <View style={styles.totalLine}>
                  <Text style={styles.subLabel}>Subtotal</Text>
                  <Text style={styles.subValue}>{formatMoney(g.subtotal, currency)}</Text>
                </View>
                {coupon && (
                  <View style={styles.totalLine}>
                    <Text style={styles.discLabel}>Discount ({coupon.code})</Text>
                    <Text style={styles.discLabel}>
                      −{formatMoney(coupon.discountMinor, currency)}
                    </Text>
                  </View>
                )}
                <View style={styles.totalLine}>
                  <Text style={styles.storeTotalLabel}>Store total</Text>
                  <Text style={styles.storeTotalValue}>
                    {formatMoney(g.subtotal - (coupon?.discountMinor ?? 0), currency)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* ── Bill summary ───────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill summary</Text>
          <View style={styles.totalLine}>
            <Text style={styles.billLabel}>Items total</Text>
            <Text style={styles.billValue}>{formatMoney(itemsTotal, currency)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.totalLine}>
              <Text style={styles.discLabel}>Store discounts</Text>
              <Text style={styles.discLabel}>−{formatMoney(totalDiscount, currency)}</Text>
            </View>
          )}
          <View style={styles.dashed}>
            {Array.from({ length: 48 }, (_, i) => (
              <View key={i} style={styles.dash} />
            ))}
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.toPayLabel}>To pay</Text>
            <Text style={styles.toPayValue}>{formatMoney(grandTotal, currency)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.savePill}>
              <PartyPopper size={18} color="#15803D" strokeWidth={1.9} />
              <Text style={styles.saveText}>
                You’re saving {formatMoney(totalDiscount, currency)} on this order
              </Text>
            </View>
          )}
        </View>

        {/* ── How you can pay (opens the payment sheet) ──────────────────── */}
        <View style={styles.card}>
          <Text style={styles.payTitle}>How you can pay</Text>
          {payOptions.map(({ key, label, Icon, off }, i) => (
            <TouchableOpacity
              key={key}
              style={[styles.payRow, i > 0 && styles.payRowDivider]}
              onPress={() => setPayOpen(true)}
              disabled={hasBelowMin}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ disabled: hasBelowMin || off }}
            >
              <Icon size={22} color={off ? '#94A3B8' : '#0F1E4A'} strokeWidth={1.7} />
              <Text style={[styles.payLabel, off && styles.payLabelOff]}>{label}</Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          ))}
          {partialDisabled && (
            <View style={styles.warnRow}>
              <TriangleAlert size={14} color="#EA580C" strokeWidth={2} />
              <Text style={styles.warnText}>
                Partial payment isn’t available for{' '}
                {partialBlockedItems.map((x) => x.name).join(', ')}.
              </Text>
            </View>
          )}
          {codDisabled && (
            <View style={styles.warnRow}>
              <TriangleAlert size={14} color="#EA580C" strokeWidth={2} />
              <Text style={styles.warnText}>
                Cash at pickup isn’t available for {codBlockedItems.map((x) => x.name).join(', ')}.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Checkout bar → payment sheet ─────────────────────────────────── */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={styles.barInfo}>
          <Text style={styles.barLabel}>
            Total ({groups.length} {storeWord})
          </Text>
          <Text style={styles.barTotal}>{formatMoney(grandTotal, currency)}</Text>
          {totalDiscount > 0 && (
            <Text style={styles.barSaved}>Saved {formatMoney(totalDiscount, currency)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.payBtn, hasBelowMin && styles.payBtnDisabled]}
          activeOpacity={0.9}
          disabled={hasBelowMin}
          onPress={() => setPayOpen(true)}
          accessibilityRole="button"
        >
          <Text style={styles.payBtnText}>{hasBelowMin ? 'Below minimum' : 'Proceed to pay'}</Text>
          {!hasBelowMin && <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.4} />}
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
