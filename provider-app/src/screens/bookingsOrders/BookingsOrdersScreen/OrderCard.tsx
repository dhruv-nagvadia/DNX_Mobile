import React from 'react';
import { ActivityIndicator, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { Check, IndianRupee, Package, Phone, User, X } from 'lucide-react-native';

import { BusinessOrder, OrderStatus } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, LINK, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { orderOutstanding, orderStatusBadge, paymentBadge } from '@/utils/status';

import { shortOrderId } from './useBookingsOrdersScreen';
import { COLLECT_GREEN, styles } from './styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };
const MAX_THUMBS = 3;

/** Status pill colours per the Orders mockup. */
const STATUS_PILL: Record<OrderStatus, PillColors> = {
  PENDING: PILL.lavender,
  CONFIRMED: PILL.blue,
  READY: PILL.green,
  COMPLETED: PILL.grey,
  CANCELLED: PILL.grey,
  NO_SHOW: PILL.grey,
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** "Today, 10:42 AM" / "Yesterday, 09:30 AM" / "Oct 29, 07:20 PM". */
function formatOrderWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
  const day =
    diffDays === 0
      ? 'Today'
      : diffDays === -1
        ? 'Yesterday'
        : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const h = d.getHours();
  return `${day}, ${pad2(h % 12 || 12)}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

/**
 * Payment pill — label/meaning from the shared `paymentBadge`, recoloured to
 * the mockup: COD grey ("COD · ₹780 due"), Paid green, Part-paid blue,
 * Refunded lavender.
 */
function orderPaymentPill(o: BusinessOrder): { label: string; colors: PillColors } {
  const badge = paymentBadge({
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    amountMinor: o.amountMinor,
    amountPaidMinor: o.amountPaidMinor,
    refundedMinor: o.refundedMinor,
    currency: o.currency,
  });
  const refunded = o.paymentStatus === 'REFUNDED' || (o.refundedMinor ?? 0) > 0;
  if (refunded) {
    return { label: badge.label, colors: PILL.lavender };
  }
  switch (o.paymentStatus) {
    case 'PAID':
      return { label: badge.label, colors: PILL.green };
    case 'PARTIAL':
      return { label: badge.label, colors: PILL.blue };
    case 'FAILED':
      return { label: badge.label, colors: PILL.red };
  }
  if (o.paymentMethod === 'CASH') {
    const due = orderOutstanding(o);
    const live = o.status !== 'CANCELLED' && o.status !== 'NO_SHOW';
    return {
      label: live && due > 0 ? `COD · ${formatMoney(due, o.currency)} due` : 'COD',
      colors: PILL.grey,
    };
  }
  return { label: badge.label, colors: PILL.yellow };
}

/** Mockup pills are a touch larger than the shared `Pill` (body-size text). */
function OrderPill({
  label,
  colors,
  shrink,
}: {
  label: string;
  colors: PillColors;
  shrink?: boolean;
}) {
  return (
    <View style={[styles.oPill, shrink && styles.oPillShrink, { backgroundColor: colors.bg }]}>
      <Text style={[styles.oPillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

type ButtonTone = 'primary' | 'danger' | 'collect';

function OrderButton({
  label,
  tone,
  Icon,
  busy,
  onPress,
}: {
  label: string;
  tone: ButtonTone;
  Icon: typeof Check;
  busy: boolean;
  onPress: () => void;
}) {
  const box =
    tone === 'primary'
      ? styles.oBtnPrimary
      : tone === 'danger'
        ? styles.oBtnDanger
        : styles.oBtnCollect;
  const text =
    tone === 'primary'
      ? styles.oBtnTextPrimary
      : tone === 'danger'
        ? styles.oBtnTextDanger
        : styles.oBtnTextCollect;
  const fg = tone === 'primary' ? Color.white : tone === 'danger' ? Color.error : COLLECT_GREEN;
  return (
    <TouchableOpacity
      style={[styles.oBtn, box, busy && styles.btnBusy]}
      disabled={busy}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {busy && tone === 'primary' ? (
        <ActivityIndicator size="small" color={Color.white} />
      ) : (
        <>
          <Icon size={20} color={fg} strokeWidth={2.2} />
          <Text style={[styles.oBtnText, text]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const NEXT_STEP: Partial<
  Record<OrderStatus, { to: OrderStatus; label: string; Icon: typeof Check }>
> = {
  PENDING: { to: 'CONFIRMED', label: 'Confirm', Icon: Check },
  CONFIRMED: { to: 'READY', label: 'Mark ready', Icon: Package },
  READY: { to: 'COMPLETED', label: 'Complete', Icon: Check },
};

export function OrderCard({
  order: o,
  showBusiness,
  busy,
  needsCollection,
  onOpen,
  onAdvance,
  onCancel,
  onCollect,
}: {
  order: BusinessOrder;
  /** Tab root (all businesses): show which business the order belongs to. */
  showBusiness: boolean;
  busy: boolean;
  needsCollection: boolean;
  onOpen: () => void;
  onAdvance: (status: OrderStatus) => void;
  onCancel: () => void;
  onCollect: () => void;
}) {
  const statusInfo = orderStatusBadge(o.status);
  const pay = orderPaymentPill(o);
  const phone = o.user.phone?.trim();

  const names = o.items
    .slice(0, 2)
    .map((i) => i.name)
    .join(', ');
  const more = o.items.length > 2 ? ` +${o.items.length - 2} more` : '';
  const itemCount = `${o.items.length} item${o.items.length === 1 ? '' : 's'}`;

  const next = NEXT_STEP[o.status];
  const canCancel = o.status === 'PENDING' || o.status === 'CONFIRMED';
  // READY pairs Complete with Collect; elsewhere Collect gets its own row.
  const collectInRow = o.status === 'READY' && needsCollection;
  const collectOwnRow = needsCollection && !collectInRow;
  const collectLabel = `Collect ${formatMoney(orderOutstanding(o), o.currency)}`;

  return (
    <View style={styles.oCard}>
      <TouchableOpacity activeOpacity={0.7} onPress={onOpen} accessibilityRole="button">
        <View style={styles.oTop}>
          <View style={styles.oTopText}>
            <Text style={styles.oId} numberOfLines={1}>
              #{shortOrderId(o.id)}
            </Text>
            <Text style={styles.oWhen} numberOfLines={1}>
              {formatOrderWhen(o.createdAt)}
            </Text>
          </View>
          <OrderPill label={statusInfo.label} colors={STATUS_PILL[o.status]} />
        </View>

        <View style={styles.oDivider} />

        <View style={styles.oRow}>
          <View style={styles.oAvatar}>
            <User size={22} color={INK} strokeWidth={1.8} />
          </View>
          <View style={styles.oRowText}>
            <Text style={styles.oName} numberOfLines={1}>
              {o.user.fullName}
            </Text>
            {!!phone && (
              <Text style={styles.oMeta} numberOfLines={1}>
                {phone}
              </Text>
            )}
            {showBusiness && (
              <Text style={styles.oBusiness} numberOfLines={1}>
                {o.provider.businessName}
              </Text>
            )}
          </View>
          {!!phone && (
            <TouchableOpacity
              style={styles.oCallBtn}
              onPress={() => Linking.openURL(`tel:${phone}`).catch(() => undefined)}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Call ${o.user.fullName}`}
            >
              <Phone size={20} color={LINK} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {o.items.length > 0 && (
          <>
            <View style={styles.oDivider} />
            <View style={styles.oRow}>
              <View style={styles.oThumbs}>
                {o.items.slice(0, MAX_THUMBS).map((item, idx) => {
                  const uri = item.product?.imageUrl;
                  return (
                    <View key={item.id} style={[styles.oThumb, idx > 0 && styles.oThumbOverlap]}>
                      {uri ? (
                        <Image source={{ uri }} style={styles.oThumbImg} />
                      ) : (
                        <Package size={20} color={Color.placeholder} strokeWidth={1.6} />
                      )}
                    </View>
                  );
                })}
              </View>
              <View style={styles.oRowText}>
                <Text style={styles.oItems} numberOfLines={1}>
                  {names}
                  {more}
                </Text>
                <Text style={styles.oMeta}>{itemCount}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.oDivider} />

        <View style={styles.oAmountRow}>
          <Text style={styles.oAmount} numberOfLines={1}>
            {formatMoney(o.amountMinor, o.currency)}
          </Text>
          <OrderPill label={pay.label} colors={pay.colors} shrink />
        </View>
      </TouchableOpacity>

      {(!!next || canCancel || needsCollection) && (
        <View style={styles.oActions}>
          {(!!next || canCancel) && (
            <View style={styles.actionsRow}>
              {next && (
                <OrderButton
                  label={next.label}
                  tone="primary"
                  Icon={next.Icon}
                  busy={busy}
                  onPress={() => onAdvance(next.to)}
                />
              )}
              {canCancel && (
                <OrderButton label="Cancel" tone="danger" Icon={X} busy={busy} onPress={onCancel} />
              )}
              {collectInRow && (
                <OrderButton
                  label={collectLabel}
                  tone="collect"
                  Icon={IndianRupee}
                  busy={busy}
                  onPress={onCollect}
                />
              )}
            </View>
          )}
          {collectOwnRow && (
            <View style={styles.actionsRow}>
              <OrderButton
                label={collectLabel}
                tone="collect"
                Icon={IndianRupee}
                busy={busy}
                onPress={onCollect}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
