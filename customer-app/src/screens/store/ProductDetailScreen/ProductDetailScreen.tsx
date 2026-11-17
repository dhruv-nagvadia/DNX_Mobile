import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  Image as ImageIcon,
  Package,
  Scale,
  Share as ShareIcon,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
  TicketPercent,
} from 'lucide-react-native';

import { ProductAmountControl } from '@/components/ProductAmountControl';
import { RemoteImage } from '@/components/RemoteImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StoreItemCard } from '@/components/StoreItemCard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartQty } from '@/redux/slices/cartSlice';
import {
  useGetProviderByIdQuery,
  useGetProductReviewsQuery,
} from '@/redux/api/provider/providerApi';
import type { Product, Provider, Review } from '@/redux/api/provider/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { INK, LINK, ModernSize, PAGE_BG } from '@/utils/modernTheme';
import {
  amountPrice,
  baseIncrement,
  formatAmount,
  formatMoney,
  incrementFor,
  amountUnits,
} from '@/utils/units';

import { styles } from './styles';

const AMBER = '#F59E0B';
/** Quick-pick amounts per measure, in base units (g, ml, pieces). */
const QUICK: Record<Product['measure'], number[]> = {
  weight: [250, 500, 1000, 2000],
  volume: [250, 500, 1000, 2000],
  count: [1, 2, 6, 12],
};
const REVIEWS_PREVIEW = 2;
const SOLD_BY: Record<Product['measure'], string> = {
  weight: 'weight',
  volume: 'volume',
  count: 'piece',
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          color={AMBER}
          fill={i <= Math.round(value) ? AMBER : 'transparent'}
        />
      ))}
    </View>
  );
}

function ago(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0
    ? 'Today'
    : d === 1
      ? 'Yesterday'
      : d < 30
        ? `${d} days ago`
        : `${Math.floor(d / 30)} mo ago`;
}

const AVATAR = [
  { bg: '#F2ECFF', fg: '#6D28D9' },
  { bg: '#E7F6EE', fg: '#15803D' },
  { bg: '#EAF1FF', fg: '#1D4ED8' },
];

function ReviewRow({ review, index }: { review: Review; index: number }) {
  const tint = AVATAR[index % AVATAR.length];
  return (
    <View style={[styles.reviewRow, index > 0 && styles.reviewDivider]}>
      <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
        <Text style={[styles.avatarText, { color: tint.fg }]}>
          {review.user.fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewHead}>
          <View>
            <Text style={styles.reviewName}>{review.user.fullName}</Text>
            <Text style={styles.reviewAgo}>{ago(review.createdAt)}</Text>
          </View>
          <Stars value={review.rating} size={13} />
        </View>
        {!!review.comment && <Text style={styles.reviewText}>{review.comment}</Text>}
        {!!review.providerReply && (
          <View style={styles.reply}>
            <Text style={styles.replyTitle}>Reply from the store</Text>
            <Text style={styles.replyText}>{review.providerReply}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Product page — mockup "designs/customer/mobile/Tomato Product Pages_ Add or
 * View Cart.png": photo card, store chip, price + savings, coupon, amount
 * picker (unit switch, quick picks, Add / stepper), details, reviews, more from
 * the store, and a sticky Add to cart / View cart bar.
 */
export default function ProductDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.PRODUCT_DETAILS>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  // Must match the exact query args used elsewhere (StoreDetailScreen,
  // ProviderProductsScreen) so they all share ONE RTK Query cache entry.
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const { data: provider, isLoading } = useGetProviderByIdQuery({
    id: params.providerId,
    postalCode,
  });
  const { data: reviews = [] } = useGetProductReviewsQuery(params.productId);
  const product = provider?.products?.find((p) => p.id === params.productId);
  const cartItems = useAppSelector((s) => s.cart.items);
  const qty = cartItems.find((i) => i.productId === params.productId)?.quantity ?? 0;
  const cartCount = cartItems.filter((i) => i.quantity > 0).length;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copiedTimer.current) {
        clearTimeout(copiedTimer.current);
      }
    },
    [],
  );

  // Copies the coupon code and shows "Copied" for a moment.
  const copyCode = (code: string) => {
    // Loaded on tap, not at import: the clipboard is a native module, and an
    // app binary built before it was added would otherwise crash on launch.
    try {
      const Clipboard = require('@react-native-clipboard/clipboard').default;
      Clipboard.setString(code);
    } catch {
      Alert.alert(`Code ${code}`, 'Copy isn’t available in this build — enter the code at checkout.');
      return;
    }
    setCopied(true);
    if (copiedTimer.current) {
      clearTimeout(copiedTimer.current);
    }
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const more = useMemo(() => {
    if (!product || !provider) {
      return [];
    }
    const others = (provider.products ?? []).filter((p) => p.id !== product.id);
    const same = others.filter((p) => p.section && p.section === product.section);
    return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 8);
  }, [product, provider]);

  const breakdown = useMemo(() => {
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: Math.round((reviews.filter((r) => Math.round(r.rating) === star).length / total) * 100),
    }));
  }, [reviews]);

  if (isLoading && !provider) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Product" />
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      </View>
    );
  }
  if (!product || !provider) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Product" />
        <View style={styles.center}>
          <Text style={styles.notFound}>This product is no longer available.</Text>
        </View>
      </View>
    );
  }

  const out = !product.unlimitedStock && product.stockQty <= 0;
  const step = baseIncrement(product.measure);
  // "Low" = fewer than 10 add-steps left.
  const low = !product.unlimitedStock && !out && product.stockQty < step * 10;
  const finalPrice = product.coupon ? product.coupon.finalPriceMinor : product.priceMinor;
  const discountPct =
    product.coupon && product.priceMinor > 0
      ? Math.round((product.coupon.discountMinor / product.priceMinor) * 100)
      : 0;
  const pack = formatAmount(product.priceQty, product.measure);
  const quick = QUICK[product.measure].filter(
    (a) => a >= product.stepQty && (product.unlimitedStock || a <= product.stockQty),
  );
  const hasMin = product.stepQty > step;
  const units = amountUnits(product.measure);
  const stepLabel = formatAmount(incrementFor(product.measure, units[0]), product.measure);

  const setAmount = (amount: number) =>
    dispatch(
      setCartQty({
        item: cartItemFor(product, provider),
        quantity: product.unlimitedStock ? amount : Math.min(amount, product.stockQty),
      }),
    );
  const addDefault = () => setAmount(Math.max(qty + step, product.stepQty));

  const onShare = () =>
    Share.share({
      message: `${product.name} — ${formatMoney(finalPrice, product.currency)} / ${pack} at ${provider.businessName} on DNX.`,
    }).catch(() => undefined);

  const shownReviews = showAllReviews ? reviews : reviews.slice(0, REVIEWS_PREVIEW);
  const moreW = Math.floor((width - ModernSize.gutter * 2) * 0.46);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Photo card ─────────────────────────────────────────────────── */}
        <View style={[styles.imageCard, { marginTop: insets.top + 6 }]}>
          <RemoteImage
            uris={[product.imageUrl]}
            style={styles.image}
            resizeMode="contain"
            fallback={
              <View style={styles.noImage}>
                <ImageIcon size={42} color="#94A3B8" strokeWidth={1.4} />
                <Text style={styles.noImageText}>No image</Text>
              </View>
            }
          />
          <TouchableOpacity
            style={[styles.roundBtn, styles.roundLeft]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={INK} strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roundBtn, styles.roundRight]}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share"
          >
            <ShareIcon size={20} color={INK} strokeWidth={2} />
          </TouchableOpacity>
          {out ? (
            <View style={[styles.offBadge, styles.outBadge]}>
              <Text style={styles.outBadgeText}>Out of stock</Text>
            </View>
          ) : discountPct > 0 ? (
            <View style={styles.offBadge}>
              <Text style={styles.offBadgeText}>{discountPct}% OFF</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          {/* ── Identity ─────────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.storeChip}
            onPress={() =>
              navigation.navigate(ROUTES.PROVIDER_DETAILS, {
                providerId: provider.id,
                name: provider.businessName,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Open ${provider.businessName}`}
          >
            <View style={styles.storeAvatar}>
              <RemoteImage
                uris={[provider.images[0], provider.category.imageUrl]}
                style={styles.fill}
                resizeMode="cover"
                fallback={<Store size={14} color={LINK} />}
              />
            </View>
            <Text style={styles.storeName} numberOfLines={1}>
              {provider.businessName}
            </Text>
            <ChevronRight size={16} color={INK} strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.name}>{product.name}</Text>
          {!!(product.section || product.productType?.name) && (
            <View style={styles.iconLine}>
              <Tag size={15} color="#64748B" strokeWidth={1.9} />
              <Text style={styles.metaText}>{product.section || product.productType?.name}</Text>
            </View>
          )}
          {(product.ratingCount ?? 0) > 0 && (
            <View style={styles.iconLine}>
              <Star size={15} color={AMBER} fill={AMBER} />
              <Text style={styles.ratingText}>{(product.ratingAvg ?? 0).toFixed(1)}</Text>
              <Text style={styles.metaText}>
                ({product.ratingCount} review{product.ratingCount === 1 ? '' : 's'})
              </Text>
            </View>
          )}

          {/* ── Price ────────────────────────────────────────────────────── */}
          <View style={styles.priceRow}>
            <View>
              <View style={styles.priceLine}>
                <Text style={styles.price}>{formatMoney(finalPrice, product.currency)}</Text>
                {!!product.coupon && (
                  <Text style={styles.strike}>
                    {formatMoney(product.priceMinor, product.currency)}
                  </Text>
                )}
              </View>
              <Text style={styles.metaText}>per {pack}</Text>
            </View>
            <View style={[styles.stockPill, low && styles.stockLow, out && styles.stockOut]}>
              <View
                style={[styles.stockDot, low && styles.stockDotLow, out && styles.stockDotOut]}
              />
              <Text
                style={[styles.stockText, low && styles.stockTextLow, out && styles.stockTextOut]}
              >
                {out
                  ? 'Out of stock'
                  : low
                    ? `Only ${formatAmount(product.stockQty, product.measure)} left`
                    : 'In stock'}
              </Text>
            </View>
          </View>
          {!!product.coupon && (
            <View style={styles.savePill}>
              <Text style={styles.saveText}>
                You save {formatMoney(product.coupon.discountMinor, product.currency)}
              </Text>
            </View>
          )}

          {/* ── Coupon ───────────────────────────────────────────────────── */}
          {!!product.coupon && (
            <View style={styles.coupon}>
              <TicketPercent size={30} color="#EA580C" strokeWidth={1.6} />
              <View style={styles.couponBody}>
                <Text style={styles.couponTitle}>
                  Use code <Text selectable>{product.coupon.code}</Text>
                </Text>
                <Text style={styles.couponLine}>
                  Get it for {formatMoney(product.coupon.finalPriceMinor, product.currency)} /{' '}
                  {pack}
                </Text>
                <Text style={styles.couponHint}>Enter this code at checkout</Text>
              </View>
              <TouchableOpacity
                style={[styles.copyBtn, copied && styles.copyBtnDone]}
                onPress={() => copyCode(product.coupon!.code)}
                accessibilityRole="button"
                accessibilityLabel={copied ? 'Code copied' : `Copy code ${product.coupon.code}`}
              >
                {copied ? (
                  <Check size={15} color="#15803D" strokeWidth={2.6} />
                ) : (
                  <Copy size={15} color={LINK} strokeWidth={2} />
                )}
                <Text style={[styles.copyText, copied && styles.copyTextDone]}>
                  {copied ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Choose amount ────────────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Choose amount</Text>
            {quick.length > 0 && !out && (
              <View style={styles.quickRow}>
                {quick.map((a) => {
                  const active = qty === a;
                  return (
                    <TouchableOpacity
                      key={a}
                      style={[styles.quick, active && styles.quickActive]}
                      onPress={() => setAmount(a)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.quickText, active && styles.quickTextActive]}>
                        {formatAmount(a, product.measure)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <Text style={styles.helper}>
              {hasMin ? `Min ${formatAmount(product.stepQty, product.measure)} • ` : ''}Adds in
              steps of {stepLabel}
            </Text>
            <ProductAmountControl
              product={product}
              providerId={provider.id}
              providerName={provider.businessName}
              depositPercent={provider.depositPercent ?? 20}
              codEnabled={product.codEnabled}
              partialPayEnabled={product.partialPayEnabled}
            />
          </View>

          {/* ── About ────────────────────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About this product</Text>
            <Text style={styles.description}>
              {product.description || 'No description added for this product.'}
            </Text>
            <View style={styles.spec}>
              <Package size={16} color={INK} strokeWidth={1.8} />
              <Text style={styles.specText}>Pack size: {pack}</Text>
            </View>
            <View style={styles.spec}>
              <Scale size={16} color={INK} strokeWidth={1.8} />
              <Text style={styles.specText}>Sold by: {SOLD_BY[product.measure]}</Text>
            </View>
            {!!product.section && (
              <View style={styles.spec}>
                <ShoppingBag size={16} color={INK} strokeWidth={1.8} />
                <Text style={styles.specText}>Store section: {product.section}</Text>
              </View>
            )}
          </View>

          {/* ── Reviews ──────────────────────────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Reviews</Text>
              {reviews.length > REVIEWS_PREVIEW && (
                <TouchableOpacity onPress={() => setShowAllReviews((v) => !v)} hitSlop={8}>
                  <Text style={styles.link}>
                    {showAllReviews ? 'Show less' : `View all (${reviews.length})`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {reviews.length === 0 ? (
              <Text style={styles.metaText}>No reviews yet. Be the first after you buy it.</Text>
            ) : (
              <>
                <View style={styles.summary}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryAvg}>{(product.ratingAvg ?? 0).toFixed(1)}</Text>
                    <Stars value={product.ratingAvg ?? 0} size={16} />
                    <Text style={styles.metaSmall}>
                      {product.ratingCount ?? reviews.length} review
                      {(product.ratingCount ?? 0) === 1 ? '' : 's'}
                    </Text>
                  </View>
                  <View style={styles.bars}>
                    {breakdown.map((b) => (
                      <View key={b.star} style={styles.barRow}>
                        <Text style={styles.barLabel}>{b.star} ★</Text>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { width: `${b.pct}%` }]} />
                        </View>
                        <Text style={styles.barPct}>{b.pct}%</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {shownReviews.map((r, i) => (
                  <ReviewRow key={r.id} review={r} index={i} />
                ))}
              </>
            )}
          </View>

          {/* ── More from this store ─────────────────────────────────────── */}
          {more.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>More from this store</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.bleed}
                contentContainerStyle={styles.moreRow}
              >
                {more.map((p) => (
                  <StoreItemCard
                    key={p.id}
                    product={p}
                    providerId={provider.id}
                    providerName={provider.businessName}
                    depositPercent={provider.depositPercent}
                    width={moreW}
                    onPress={() =>
                      navigation.push(ROUTES.PRODUCT_DETAILS, {
                        providerId: provider.id,
                        productId: p.id,
                      })
                    }
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky bar ──────────────────────────────────────────────────── */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={styles.barInfo}>
          <Text style={styles.barCaption}>
            {qty > 0 ? `In cart: ${formatAmount(qty, product.measure)}` : pack}
          </Text>
          <Text style={styles.barPrice}>
            {formatMoney(
              qty > 0 ? amountPrice(qty, product.priceQty, product.priceMinor) : product.priceMinor,
              product.currency,
            )}
          </Text>
        </View>
        {qty > 0 ? (
          <TouchableOpacity
            style={styles.barBtn}
            onPress={() => navigation.navigate(ROUTES.CART)}
            accessibilityRole="button"
          >
            <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.barBtnText}>View cart ({cartCount})</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.barBtn, out && styles.barBtnDisabled]}
            onPress={addDefault}
            disabled={out}
            accessibilityRole="button"
          >
            <ShoppingBag size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.barBtnText}>{out ? 'Out of stock' : 'Add to cart'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/** Cart line for this product (same shape ProductAmountControl dispatches). */
function cartItemFor(p: Product, provider: Provider) {
  return {
    productId: p.id,
    providerId: provider.id,
    providerName: provider.businessName,
    name: p.name,
    measure: p.measure,
    priceMinor: p.priceMinor,
    priceQty: p.priceQty,
    currency: p.currency,
    stockQty: p.stockQty,
    unlimitedStock: p.unlimitedStock,
    stepQty: p.stepQty,
    imageUrl: p.imageUrl,
    depositPercent: provider.depositPercent ?? 20,
    codEnabled: p.codEnabled,
    partialPayEnabled: p.partialPayEnabled,
  };
}
