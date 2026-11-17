import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BadgeCheck,
  CalendarDays,
  Check,
  CircleX,
  Clock,
  CreditCard,
  Image as ImageIcon,
  MapPin,
  Navigation,
  NotebookPen,
  PackageCheck,
  PackageX,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  UserX,
} from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { Order, OrderItem, OrderStatus } from '@/redux/api/order/types';
import { Provider, Review } from '@/redux/api/provider/types';
import { ORDER_STATUS_LABEL } from '@/utils/orderStatus';
import { formatHour, isOpenNow, nextOpening } from '@/utils/openNow';
import { CARD_BORDER, INK, LINK, PILL } from '@/utils/modernTheme';
import { Color } from '@/utils/Theme';
import { amountPrice, formatAmount, formatMoney } from '@/utils/units';

import { AMBER, MUTED, styles } from './styles';

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "17 Nov, 6:42 PM" — built by hand so it doesn't depend on Hermes' Intl. */
export function formatPlaced(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${h12}:${String(d.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** "#A1B2C3" — same short ref as the Bookings & Orders list. */
export function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

/** "500 g × ₹40/kg", "6 pcs × ₹6/pc", "250 g × ₹120/250 g". */
function unitLine(it: OrderItem, currency: string): string {
  const per = formatAmount(it.priceQty, it.measure).replace(/^1 /, '');
  return `${formatAmount(it.quantity, it.measure)} × ${formatMoney(it.priceMinor, currency)}/${per}`;
}

export function StarsRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.stars} accessible accessibilityLabel={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} color={AMBER} fill={n <= value ? AMBER : 'transparent'} />
      ))}
    </View>
  );
}

// ── Status hero ────────────────────────────────────────────────────────────

const heroTint = StyleSheet.create({
  amber: { backgroundColor: '#FFF9EE', borderColor: '#F7E6C8' },
  blue: { backgroundColor: '#EEF4FF', borderColor: '#D5E2FA' },
  green: { backgroundColor: '#EEFBF4', borderColor: '#CDEBDB' },
  grey: { backgroundColor: '#F1F3F7', borderColor: CARD_BORDER },
  red: { backgroundColor: '#FFF3F3', borderColor: '#F8D4D4' },
});

const DONE_PILL = { bg: '#64748B', fg: Color.white };

interface HeroTheme {
  tint: keyof typeof heroTint;
  pill: { bg: string; fg: string };
  title: string;
  icon: (color: string) => ReactNode;
  pillIcon: (color: string) => ReactNode;
  /** Tracker steps completed (0 = hide the tracker). */
  done: number;
}

function heroTheme(status: OrderStatus): HeroTheme {
  switch (status) {
    case 'CONFIRMED':
      return {
        tint: 'blue',
        pill: PILL.blue,
        title: 'Store is preparing your order',
        icon: (c) => <ShoppingBag size={34} color={c} />,
        pillIcon: (c) => <ShoppingBag size={13} color={c} />,
        done: 2,
      };
    case 'READY':
      return {
        tint: 'green',
        pill: PILL.green,
        title: 'Your order is packed!',
        icon: (c) => <PackageCheck size={34} color={c} />,
        pillIcon: (c) => <ShoppingBag size={13} color={c} />,
        done: 3,
      };
    case 'COMPLETED':
      return {
        tint: 'grey',
        pill: DONE_PILL,
        title: 'Picked up',
        icon: (c) => <PackageCheck size={34} color={c} />,
        pillIcon: (c) => <Check size={13} color={c} strokeWidth={3} />,
        done: 4,
      };
    case 'CANCELLED':
      return {
        tint: 'red',
        pill: PILL.red,
        title: 'Order cancelled',
        icon: (c) => <PackageX size={34} color={c} />,
        pillIcon: (c) => <CircleX size={13} color={c} />,
        done: 0,
      };
    case 'NO_SHOW':
      return {
        tint: 'red',
        pill: PILL.red,
        title: 'Order not collected',
        icon: (c) => <UserX size={34} color={c} />,
        pillIcon: (c) => <UserX size={13} color={c} />,
        done: 0,
      };
    default: // PENDING
      return {
        tint: 'amber',
        pill: PILL.yellow,
        title: 'Order placed',
        icon: (c) => <Clock size={34} color={c} />,
        pillIcon: (c) => <Clock size={13} color={c} />,
        done: 1,
      };
  }
}

function heroSubtitle(order: Order): string {
  const store = order.provider.businessName;
  switch (order.status) {
    case 'PENDING':
      return `Waiting for ${store} to confirm your order.`;
    case 'CONFIRMED':
      return "We'll let you know when it's ready for pickup.";
    case 'READY':
      return 'Head to the store and collect it at the counter.';
    case 'COMPLETED':
      return `Thanks for shopping with ${store}.`;
    case 'CANCELLED':
      return order.cancelReason ? 'Cancelled by the store.' : 'This order was cancelled.';
    default:
      return 'This order was not picked up from the store.';
  }
}

const STEPS = ['Placed', 'Confirmed', 'Ready', 'Picked up'];

export function StatusHero({ order }: { order: Order }) {
  const t = heroTheme(order.status);
  const label = ORDER_STATUS_LABEL[order.status];
  return (
    <View style={[styles.hero, heroTint[t.tint]]}>
      <View style={styles.heroTop}>
        <View style={styles.heroText}>
          <View
            style={[styles.heroPill, { backgroundColor: t.pill.bg }]}
            accessible
            accessibilityLabel={`Status: ${label}`}
          >
            {t.pillIcon(t.pill.fg)}
            <Text style={[styles.heroPillText, { color: t.pill.fg }]}>{label}</Text>
          </View>
          <Text style={styles.heroTitle} accessibilityRole="header">
            {t.title}
          </Text>
          <Text style={styles.heroSub}>{heroSubtitle(order)}</Text>
        </View>
        <View style={styles.heroIcon}>{t.icon(t.pill.fg === Color.white ? MUTED : t.pill.fg)}</View>
      </View>

      {t.done > 0 && (
        <View
          style={styles.tracker}
          accessible
          accessibilityLabel={`Progress: ${STEPS.slice(0, t.done).join(', ')} done`}
        >
          {STEPS.map((s, i) => {
            const done = i < t.done;
            return (
              <View key={s} style={styles.step}>
                <View style={styles.stepDotRow}>
                  <View
                    style={[
                      styles.stepLine,
                      i === 0 ? styles.stepLineHidden : i < t.done && styles.stepLineDone,
                    ]}
                  />
                  <View style={[styles.stepDot, done && styles.stepDotDone]}>
                    {done && <Check size={13} color={Color.white} strokeWidth={3} />}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      i === STEPS.length - 1
                        ? styles.stepLineHidden
                        : i + 1 < t.done && styles.stepLineDone,
                    ]}
                  />
                </View>
                <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{s}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── Notice (no-show / store's note) ───────────────────────────────────────

export function Notice({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.notice}>
      <View style={styles.noticeBody}>
        <Text style={styles.noticeTitle}>{title}</Text>
        <Text style={styles.noticeText}>{text}</Text>
      </View>
    </View>
  );
}

// ── Store card ─────────────────────────────────────────────────────────────

function OutlineButton({
  label,
  icon,
  onPress,
  disabled,
  a11y,
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  a11y: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.outlineBtn, disabled && styles.outlineBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled: !!disabled }}
    >
      {icon}
      <Text style={styles.outlineBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const openTint = StyleSheet.create({
  open: { backgroundColor: PILL.green.bg },
  closed: { backgroundColor: PILL.grey.bg },
  openDot: { backgroundColor: '#16A34A' },
  closedDot: { backgroundColor: MUTED },
  openText: { color: PILL.green.fg },
  closedText: { color: MUTED },
});

interface StoreCardProps {
  order: Order;
  store?: Provider;
  address: string;
  onCall: () => void;
  onDirections: () => void;
  onViewStore: () => void;
}

export function StoreCard({ order, store, address, onCall, onDirections, onViewStore }: StoreCardProps) {
  const name = store?.businessName ?? order.provider.businessName;
  const images = store?.images?.length ? store.images : order.provider.images ?? [];
  const phone = store?.phone ?? order.provider.phone;
  const open = isOpenNow(store?.businessHours);
  const today = store?.businessHours.find((h) => h.dayOfWeek === new Date().getDay());
  const openLabel =
    open === true && today
      ? `Open till ${formatHour(today.closeTime)}`
      : open === false
        ? nextOpening(store?.businessHours) ?? 'Closed today'
        : null;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.storeRow}
        onPress={onViewStore}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${name}. View store`}
      >
        <View style={styles.storePhoto}>
          <RemoteImage
            uris={images}
            style={styles.fill}
            resizeMode="cover"
            fallback={<Store size={28} color={MUTED} />}
          />
        </View>
        <View style={styles.storeInfo}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {name}
            </Text>
            {store?.isVerified && (
              <BadgeCheck size={18} color={Color.white} fill={LINK} accessibilityLabel="Verified" />
            )}
          </View>
          {!!address && (
            <View style={styles.storeLine}>
              <MapPin size={14} color={INK} />
              <Text style={styles.storeAddress} numberOfLines={1}>
                {address}
              </Text>
            </View>
          )}
          {openLabel && (
            <View style={[styles.openPill, open ? openTint.open : openTint.closed]}>
              <View style={[styles.openDot, open ? openTint.openDot : openTint.closedDot]} />
              <Text style={[styles.openText, open ? openTint.openText : openTint.closedText]}>
                {open ? openLabel : `Closed • ${openLabel}`}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.storeActions}>
        <OutlineButton
          label="Call"
          a11y={`Call ${name}`}
          icon={<Phone size={15} color={LINK} />}
          onPress={onCall}
          disabled={!phone}
        />
        <OutlineButton
          label="Directions"
          a11y={`Directions to ${name}`}
          icon={<MapPin size={15} color={LINK} />}
          onPress={onDirections}
        />
        <OutlineButton
          label="View store"
          a11y={`View ${name}`}
          icon={<CalendarDays size={15} color={LINK} />}
          onPress={onViewStore}
        />
      </View>
    </View>
  );
}

// ── Items ──────────────────────────────────────────────────────────────────

interface ItemsCardProps {
  order: Order;
  /** Completed orders show a Rate button / the given stars per product. */
  showRating: boolean;
  productRatings: Map<string, number>;
  onRate: (productId: string, name: string) => void;
  onOpenProduct: (productId?: string | null) => void;
}

export function ItemsCard({ order, showRating, productRatings, onRate, onOpenProduct }: ItemsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Items ({order.items.length})
      </Text>
      {order.items.map((it, idx) => {
        const rated = it.productId ? productRatings.get(it.productId) : undefined;
        const total = formatMoney(amountPrice(it.quantity, it.priceQty, it.priceMinor), order.currency);
        return (
          <TouchableOpacity
            key={it.id}
            style={[styles.itemRow, idx > 0 && styles.itemDivider]}
            activeOpacity={it.productId ? 0.7 : 1}
            disabled={!it.productId}
            onPress={() => onOpenProduct(it.productId)}
            accessibilityRole={it.productId ? 'button' : undefined}
            accessibilityLabel={`${it.name}, ${unitLine(it, order.currency)}, ${total}`}
          >
            <View style={styles.itemThumb}>
              <RemoteImage
                uris={[it.product?.imageUrl]}
                style={styles.fill}
                resizeMode="cover"
                fallback={<ImageIcon size={20} color={MUTED} />}
              />
            </View>
            <View style={styles.itemMain}>
              <Text style={styles.itemName} numberOfLines={1}>
                {it.name}
              </Text>
              <Text style={styles.itemMeta} numberOfLines={1}>
                {unitLine(it, order.currency)}
              </Text>
            </View>
            {showRating && it.productId ? (
              <View style={styles.itemRight}>
                {rated ? (
                  <StarsRow value={rated} size={13} />
                ) : (
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => onRate(it.productId as string, it.name)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate ${it.name}`}
                  >
                    <Text style={styles.rateBtnText}>Rate</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.itemPrice}>{total}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Bill ───────────────────────────────────────────────────────────────────

function BillRow({ label, value, valueStyle }: { label: ReactNode; value: string; valueStyle?: object }) {
  return (
    <View style={styles.billRow}>
      {typeof label === 'string' ? <Text style={styles.billLabel}>{label}</Text> : label}
      <Text style={[styles.billValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const METHOD_LABEL: Record<Order['paymentMethod'], string> = {
  ONLINE: 'Paid online',
  PARTIAL: 'Partial pay',
  CASH: 'Cash at pickup',
};

interface BillCardProps {
  order: Order;
  pay: { text: string; color: string };
  due: number;
  canPay: boolean;
  paying: boolean;
  onPay: () => void;
}

export function BillCard({ order, pay, due, canPay, paying, onPay }: BillCardProps) {
  const cur = order.currency;
  const itemsTotal = order.items.reduce(
    (s, i) => s + amountPrice(i.quantity, i.priceQty, i.priceMinor),
    0,
  );
  const discount = order.discountMinor ?? 0;
  const refunded = order.refundedMinor ?? 0;
  // CASH / PARTIAL balances are settled at the counter; an unpaid ONLINE
  // order's balance is just "due" (paid here with the Pay button).
  const dueLabel = order.paymentMethod === 'ONLINE' ? 'Amount due' : 'Pay at pickup';

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Bill details
      </Text>
      <BillRow label="Items total" value={formatMoney(itemsTotal, cur)} />
      {discount > 0 && (
        <BillRow
          label={
            <View style={styles.billLabelRow}>
              <Text style={styles.billLabel}>Coupon</Text>
              {!!order.couponCode && (
                <View style={styles.couponPill}>
                  <Text style={styles.couponText}>{order.couponCode}</Text>
                </View>
              )}
            </View>
          }
          value={`−${formatMoney(discount, cur)}`}
          valueStyle={styles.green}
        />
      )}
      <View style={styles.dashed} />
      <View style={styles.billRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatMoney(order.amountMinor, cur)}</Text>
      </View>

      {order.paymentStatus === 'REFUNDED' ? (
        <BillRow
          label="Refunded"
          value={formatMoney(order.amountPaidMinor, cur)}
          valueStyle={{ color: pay.color }}
        />
      ) : refunded > 0 ? (
        <>
          <BillRow label="Refunded" value={formatMoney(refunded, cur)} valueStyle={{ color: pay.color }} />
          <BillRow label="Not refunded" value={formatMoney(order.amountPaidMinor - refunded, cur)} />
        </>
      ) : (
        <>
          <BillRow
            label={order.paymentMethod === 'CASH' ? 'Paid' : 'Paid online'}
            value={formatMoney(order.amountPaidMinor, cur)}
            valueStyle={order.amountPaidMinor > 0 ? styles.green : undefined}
          />
          {due > 0 && (
            <View style={[styles.billRow, styles.dueRow]}>
              <Text style={styles.dueText}>{dueLabel}</Text>
              <Text style={styles.dueText}>{formatMoney(due, cur)}</Text>
            </View>
          )}
        </>
      )}

      <View style={styles.billFoot}>
        <View style={styles.methodChip}>
          <CreditCard size={15} color={INK} />
          <Text style={styles.methodText}>{METHOD_LABEL[order.paymentMethod]}</Text>
        </View>
        <Text style={[styles.payStatus, { color: pay.color }]}>{pay.text}</Text>
      </View>

      {canPay && (
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.85}
          onPress={onPay}
          disabled={paying}
          accessibilityRole="button"
          accessibilityLabel={`Pay ${formatMoney(due, cur)}`}
          accessibilityState={{ busy: paying, disabled: paying }}
        >
          {paying ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <>
              <CreditCard size={16} color={Color.white} />
              <Text style={styles.payBtnText}>Pay {formatMoney(due, cur)}</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Note ───────────────────────────────────────────────────────────────────

export function NoteCard({ note }: { note: string }) {
  return (
    <View style={[styles.card, styles.noteRow]}>
      <NotebookPen size={22} color={INK} />
      <View style={styles.noteBody}>
        <Text style={styles.noteTitle}>Note for the store</Text>
        <Text style={styles.noteText}>{note}</Text>
      </View>
    </View>
  );
}

// ── Rate this store ───────────────────────────────────────────────────────

const RATING_WORD = ['Tap to rate', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

interface RateStoreCardProps {
  businessName: string;
  /** The left review (order.review), or null while not yet rated. */
  review: { rating: number } | null | undefined;
  /** Full review from the store's reviews list (comment + store reply). */
  reviewDetail?: Review;
  /** Comment just submitted here — shown until the reviews list catches up. */
  submittedComment?: string;
  rating: number;
  onRating: (n: number) => void;
  comment: string;
  onComment: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function RateStoreCard({
  businessName,
  review,
  reviewDetail,
  submittedComment,
  rating,
  onRating,
  comment,
  onComment,
  onSubmit,
  submitting,
}: RateStoreCardProps) {
  if (review) {
    const text = reviewDetail?.comment ?? submittedComment;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Your rating
        </Text>
        <View style={styles.rateStarsLeft}>
          <StarsRow value={review.rating} size={24} />
        </View>
        {!!text && <Text style={styles.reviewComment}>{text}</Text>}
        {!!reviewDetail?.providerReply && (
          <View style={styles.reply}>
            <Text style={styles.replyTitle}>Reply from {businessName}</Text>
            <Text style={styles.replyText}>{reviewDetail.providerReply}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Rate this store
      </Text>
      <View style={styles.rateStars} accessibilityRole="adjustable" accessibilityLabel="Store rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => onRating(n)}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
            accessibilityState={{ selected: n <= rating }}
          >
            <Star
              size={32}
              color={n <= rating ? AMBER : '#94A3B8'}
              fill={n <= rating ? AMBER : 'transparent'}
              strokeWidth={1.6}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.tapHint}>{RATING_WORD[rating] ?? RATING_WORD[0]}</Text>
      {rating > 0 && (
        <>
          <TextInput
            style={styles.commentInput}
            placeholder="Share a few words (optional)"
            placeholderTextColor={Color.placeholder}
            value={comment}
            onChangeText={onComment}
            multiline
            maxLength={1000}
            accessibilityLabel="Review comment (optional)"
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={onSubmit}
            disabled={submitting}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Submit review"
            accessibilityState={{ busy: submitting, disabled: submitting }}
          >
            {submitting ? (
              <ActivityIndicator color={Color.white} />
            ) : (
              <Text style={styles.submitText}>Submit review</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ── Sticky bottom bar ─────────────────────────────────────────────────────

interface BottomBarProps {
  status: OrderStatus;
  bottomInset: number;
  canCancel: boolean;
  cancelling: boolean;
  onCancel: () => void;
  onDirections: () => void;
  onReorder: () => void;
  onViewStore: () => void;
}

export function BottomBar({
  status,
  bottomInset,
  canCancel,
  cancelling,
  onCancel,
  onDirections,
  onReorder,
  onViewStore,
}: BottomBarProps) {
  const pad = { paddingBottom: Math.max(bottomInset, 12) + 4 };
  const closed = status === 'CANCELLED' || status === 'NO_SHOW';

  return (
    <View style={[styles.bar, pad]}>
      {status === 'COMPLETED' ? (
        <TouchableOpacity
          style={[styles.barBtn, styles.barPrimary]}
          onPress={onReorder}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Reorder these items"
        >
          <ShoppingCart size={20} color={Color.white} />
          <Text style={styles.barPrimaryText}>Reorder</Text>
        </TouchableOpacity>
      ) : closed ? (
        <TouchableOpacity
          style={[styles.barBtn, styles.barPrimary]}
          onPress={onViewStore}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="View store"
        >
          <Store size={19} color={Color.white} />
          <Text style={styles.barPrimaryText}>View store</Text>
        </TouchableOpacity>
      ) : (
        <>
          {canCancel && (
            <TouchableOpacity
              style={[styles.barBtn, styles.barDanger]}
              onPress={onCancel}
              disabled={cancelling}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Cancel order"
              accessibilityState={{ busy: cancelling, disabled: cancelling }}
            >
              {cancelling ? (
                <ActivityIndicator color={PILL.red.fg} />
              ) : (
                <>
                  <CircleX size={18} color={PILL.red.fg} />
                  <Text style={styles.barDangerText}>Cancel order</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.barBtn, styles.barPrimary]}
            onPress={onDirections}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Directions to store"
          >
            <Navigation size={18} color={Color.white} />
            <Text style={styles.barPrimaryText} numberOfLines={1}>
              Directions to store
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
