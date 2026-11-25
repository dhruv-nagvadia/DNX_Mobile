import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, Info, Tag, TicketPercent } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { discountLabel } from '@/components/CouponSheet';
import { StoreCoupon } from '@/redux/api/order/types';
import { ACTION, PILL } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { CouponRow, useCouponsScreen } from './useCouponsScreen';
import { styles, MUTED, PEACH_FG, LAVENDER_FG } from './styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function validTill(iso?: string | null): string | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return `Valid till ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function appliesTo(c: StoreCoupon, source: CouponRow['source']): string {
  if (c.scope === 'SERVICE') {
    return `On ${c.serviceName ?? 'one service'}`;
  }
  if (c.scope === 'PRODUCT') {
    return `On ${c.productName ?? 'one product'}`;
  }
  return source === 'PLATFORM' ? 'On your whole order · DNX offer' : 'On your whole order';
}

interface CouponCardProps {
  row: CouponRow;
  currency: string;
  isApplied: boolean;
  applying: boolean;
  busy: boolean;
  error: string | null;
  onApply: () => void;
  onRemove: () => void;
}

/** Ticket-style offer card: peach for the store's own codes, lavender for app-wide ones. */
function CouponCard({
  row,
  currency,
  isApplied,
  applying,
  busy,
  error,
  onApply,
  onRemove,
}: CouponCardProps) {
  const { coupon: c, source, ok, hint } = row;
  const lavender = source === 'PLATFORM';
  const conditions = [
    c.minOrderMinor > 0 ? `Min order ${formatMoney(c.minOrderMinor, currency)}` : null,
    validTill(c.expiresAt),
    appliesTo(c, source),
  ].filter(Boolean) as string[];

  const iconColor = isApplied ? PILL.green.fg : !ok ? MUTED : lavender ? LAVENDER_FG : PEACH_FG;

  return (
    <View
      style={[
        styles.card,
        lavender ? styles.cardLavender : styles.cardPeach,
        !ok && !isApplied && styles.cardDisabled,
        isApplied && styles.cardApplied,
      ]}
      accessibilityLabel={`${c.code}: ${discountLabel(c)}${!ok && hint ? `. ${hint}` : ''}`}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>
          <TicketPercent size={26} color={iconColor} strokeWidth={1.7} />
        </View>
        <View style={styles.cardBody}>
          <Text
            style={[
              styles.headline,
              lavender ? styles.headlineLavender : styles.headlinePeach,
              !ok && !isApplied && styles.textDisabled,
              isApplied && styles.headlineApplied,
            ]}
          >
            {discountLabel(c)}
          </Text>
          {!!c.description && <Text style={styles.desc}>{c.description}</Text>}
          {conditions.map((line) => (
            <Text key={line} style={styles.condition}>
              • {line}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.perforation} />

      <View style={styles.cardBottom}>
        <View style={[styles.codeChip, !ok && !isApplied && styles.codeChipDisabled]}>
          <Text style={[styles.codeText, !ok && !isApplied && styles.textDisabled]} selectable>
            {c.code}
          </Text>
        </View>

        {isApplied ? (
          <View style={styles.appliedActions}>
            <View style={styles.appliedPill}>
              <Check size={14} color={PILL.green.fg} strokeWidth={2.6} />
              <Text style={styles.appliedPillText}>Applied</Text>
            </View>
            <TouchableOpacity
              onPress={onRemove}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Remove coupon ${c.code}`}
            >
              <Text style={styles.removeLink}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.applyBtn, !ok && styles.applyBtnDisabled]}
            activeOpacity={0.85}
            disabled={!ok || busy}
            onPress={onApply}
            accessibilityRole="button"
            accessibilityState={{ disabled: !ok || busy }}
            accessibilityLabel={`Apply coupon ${c.code}`}
          >
            {applying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={[styles.applyBtnText, !ok && styles.applyBtnTextDisabled]}>Apply</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {!ok && !isApplied && !!hint && (
        <View style={styles.hintRow}>
          <Info size={14} color={MUTED} />
          <Text style={styles.hint}>{hint}</Text>
        </View>
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

/** Full list of a business's offers, in its own screen (opened from cart / booking summary). */
export default function CouponsScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    businessName,
    isBooking,
    subtotalMinor,
    currency,
    rows,
    isFetching,
    applied,
    applying,
    error,
    attemptedCode,
    isManualAttempt,
    manualCode,
    setManualCode,
    applyCoupon,
    applyManual,
    removeCoupon,
  } = useCouponsScreen();

  const subtitle = [
    businessName ?? (isBooking ? 'Your booking' : 'Your order'),
    `Total ${formatMoney(subtotalMinor, currency)}`,
  ].join(' • ');
  const eligibleCount = rows.filter((r) => r.ok).length;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Offers" subtitle={subtitle} />

      <ScrollView
        contentContainerStyle={withBottomInset(styles.content)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Applied strip ─────────────────────────────────────────────── */}
        {applied && (
          <View style={styles.appliedStrip}>
            <TicketPercent size={22} color={PILL.green.fg} strokeWidth={1.8} />
            <Text style={styles.appliedCode} numberOfLines={1}>
              {applied.code} applied
            </Text>
            <View style={styles.appliedSep} />
            <Text style={styles.appliedSave} numberOfLines={1}>
              You save {formatMoney(applied.discountMinor, currency)}
            </Text>
            <TouchableOpacity
              onPress={removeCoupon}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Remove coupon ${applied.code}`}
            >
              <Text style={styles.removeLink}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Have a code? ──────────────────────────────────────────────── */}
        <View style={styles.codeBox}>
          <Text style={styles.codeBoxLabel}>Have a code?</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrap}>
              <Tag size={16} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Enter coupon code"
                placeholderTextColor={MUTED}
                autoCapitalize="characters"
                autoCorrect={false}
                value={manualCode}
                onChangeText={setManualCode}
                onSubmitEditing={applyManual}
                returnKeyType="done"
                accessibilityLabel="Coupon code"
              />
            </View>
            <TouchableOpacity
              style={[styles.inputApply, !manualCode.trim() && styles.inputApplyDisabled]}
              activeOpacity={0.85}
              disabled={applying || !manualCode.trim()}
              onPress={applyManual}
              accessibilityRole="button"
              accessibilityLabel="Apply code"
            >
              {applying && isManualAttempt ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.inputApplyText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
          {!!error && isManualAttempt && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* ── Available offers ──────────────────────────────────────────── */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Available offers
          </Text>
          {rows.length > 0 && (
            <Text style={styles.sectionCount}>
              {eligibleCount} of {rows.length} usable
            </Text>
          )}
        </View>

        {isFetching && rows.length === 0 ? (
          <ActivityIndicator color={ACTION} style={styles.loading} />
        ) : rows.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <TicketPercent size={28} color={MUTED} strokeWidth={1.6} />
            </View>
            <Text style={styles.emptyTitle}>No offers right now</Text>
            <Text style={styles.emptyText}>Have a code? Enter it above.</Text>
          </View>
        ) : (
          rows.map((r) => (
            <CouponCard
              key={`${r.source}-${r.coupon.code}`}
              row={r}
              currency={currency}
              isApplied={applied?.code === r.coupon.code}
              applying={applying && attemptedCode === r.coupon.code}
              busy={applying}
              error={!applying && attemptedCode === r.coupon.code ? error : null}
              onApply={() => applyCoupon(r.coupon.code)}
              onRemove={removeCoupon}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
