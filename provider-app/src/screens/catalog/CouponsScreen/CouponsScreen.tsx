import React from 'react';
import {
  Alert,
  DimensionValue,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Check,
  CircleCheck,
  CircleSlash,
  Clock,
  Command,
  Package,
  Pencil,
  Plus,
  Power,
  Search,
  ShoppingCart,
  Ticket,
  Timer,
  Trash2,
  Users,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Coupon } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';

import { CouponFilter, CouponState, CouponStatus, useCouponsScreen } from './useCouponsScreen';
import { BRAND_BLUE, META_ICON, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };
const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FILTERS: { key: CouponFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'off', label: 'Off' },
  { key: 'expired', label: 'Expired' },
  { key: 'usedUp', label: 'Used up' },
];

const STATUS_LABEL: Record<CouponStatus, string> = {
  active: 'Active',
  off: 'Off',
  expired: 'Expired',
  usedUp: 'Used up',
};

/** "Dec 31, 2026" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Big headline ("10% OFF" / "₹50 OFF") and an optional cap line ("up to ₹200"). */
function discountParts(c: Coupon): { main: string; cap?: string } {
  if (c.discountType === 'PERCENT') {
    return {
      main: `${c.discountValue}% OFF`,
      cap: c.maxDiscountMinor ? `up to ${formatMoney(c.maxDiscountMinor)}` : undefined,
    };
  }
  return { main: `${formatMoney(c.discountValue)} OFF` };
}

function scopeRow(c: Coupon): { label: string; Icon: typeof ShoppingCart } {
  if (c.scope === 'SERVICE') {
    return { label: c.service ? `On ${c.service.name} (service)` : 'On a service', Icon: Command };
  }
  if (c.scope === 'PRODUCT') {
    return { label: c.product ? `On ${c.product.name} (product)` : 'On a product', Icon: Package };
  }
  return {
    label: c.minOrderMinor > 0 ? `On orders above ${formatMoney(c.minOrderMinor)}` : 'On any order',
    Icon: ShoppingCart,
  };
}

function expiryLabel(c: Coupon, status: CouponStatus): string {
  if (!c.expiresAt) {
    return 'No expiry';
  }
  const date = formatDate(c.expiresAt);
  return status === 'expired' ? `Expired on ${date}` : `Expires ${date}`;
}

function statusPill(status: CouponStatus): { colors: PillColors; Icon: typeof Check } {
  switch (status) {
    case 'active':
      return { colors: PILL.green, Icon: Check };
    case 'expired':
      return { colors: PILL.red, Icon: CircleSlash };
    case 'usedUp':
      return { colors: PILL.orange, Icon: Users };
    default:
      return { colors: PILL.grey, Icon: Power };
  }
}

function StatusPill({ label, colors, Icon }: { label: string; colors: PillColors; Icon: typeof Check }) {
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <Icon size={16} color={colors.fg} strokeWidth={2.2} />
      <Text style={[styles.pillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function SummaryTile({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: number;
  theme: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function CouponCard({
  coupon: c,
  state,
  deleting,
  onToggle,
  onEdit,
  onDelete,
}: {
  coupon: Coupon;
  state: CouponState;
  deleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { status, expiringSoon } = state;
  const faded = status === 'expired' || status === 'usedUp';
  const { main, cap } = discountParts(c);
  const scope = scopeRow(c);
  const ScopeIcon = scope.Icon;
  const pill = statusPill(status);
  const description = c.description?.trim();
  const limit = c.usageLimit;
  const usedPct: DimensionValue =
    limit != null && limit > 0 ? `${Math.min(100, Math.round((c.usedCount / limit) * 100))}%` : '0%';

  return (
    <View style={styles.card}>
      <View style={[styles.cardBody, faded && styles.dimmed]}>
        <View style={styles.cardTop}>
          <View style={styles.discountCol}>
            <Text style={styles.discount} numberOfLines={1}>
              {main}
            </Text>
            {!!cap && <Text style={styles.cap}>{cap}</Text>}
          </View>
          <View style={styles.pills}>
            <StatusPill label={STATUS_LABEL[status]} colors={pill.colors} Icon={pill.Icon} />
            {expiringSoon && <StatusPill label="Expiring soon" colors={PILL.orange} Icon={Timer} />}
          </View>
        </View>

        <View style={styles.codeChip}>
          <Text selectable style={styles.code} numberOfLines={1}>
            {c.code}
          </Text>
        </View>

        {!!description && <Text style={styles.description}>{description}</Text>}

        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <ScopeIcon size={20} color={META_ICON} strokeWidth={1.8} />
            <Text style={styles.metaText} numberOfLines={1}>
              {scope.label}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={20} color={META_ICON} strokeWidth={1.8} />
            <Text style={styles.metaText} numberOfLines={1}>
              {expiryLabel(c, status)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Users size={20} color={META_ICON} strokeWidth={1.8} />
            {limit != null ? (
              <>
                <Text style={styles.usageText} numberOfLines={1}>
                  {c.usedCount} / {limit} used
                </Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: usedPct }]} />
                </View>
              </>
            ) : (
              <Text style={styles.metaText} numberOfLines={1}>
                {c.usedCount} used • Unlimited
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Ticket perforation: dashed rule with half-circle notches cut into both edges. */}
      <View style={styles.perforation}>
        <View style={styles.dashClip}>
          <View style={styles.dash} />
        </View>
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={[styles.notch, styles.notchRight]} />
      </View>

      <View style={styles.footer}>
        <View style={[styles.toggleRow, faded && styles.dimmed]}>
          <Switch
            value={c.isActive}
            onValueChange={onToggle}
            trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
            thumbColor={Color.white}
            ios_backgroundColor={SWITCH_OFF}
            accessibilityLabel={`${c.code} active`}
          />
          <Text style={styles.toggleLabel}>{STATUS_LABEL[status]}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onEdit}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${c.code}`}
          >
            <Pencil size={20} color={BRAND_BLUE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            disabled={deleting}
            onPress={onDelete}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${c.code}`}
          >
            <Trash2 size={20} color={PILL.red.fg} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const {
    businessName,
    coupons,
    filtered,
    states,
    counts,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing,
    refresh,
    deleting,
    toggleActive,
    remove,
    goBack,
    addCoupon,
    editCoupon,
  } = useCouponsScreen();

  const hasCoupons = coupons.length > 0;
  const countLabel = `${coupons.length} offer${coupons.length === 1 ? '' : 's'}`;

  const confirmDelete = (couponId: string, code: string) => {
    Alert.alert('Delete coupon?', `"${code}" will stop working immediately.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(couponId) },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Offers
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {businessName ? `${businessName}  •  ${countLabel}` : countLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addCoupon}
          accessibilityRole="button"
          accessibilityLabel="Create an offer"
        >
          <Plus size={28} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {!hasCoupons && !isLoading ? (
          <EmptyState
            icon={<Ticket size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No coupons yet"
            body="Create one to run a promo."
          />
        ) : (
          hasCoupons && (
            <>
              <View style={styles.search}>
                <Search size={20} color={INK} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search offers..."
                  placeholderTextColor={Color.placeholder}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chips}
              >
                {FILTERS.map((f) => {
                  const selected = filter === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => setFilter(f.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.tiles}>
                <SummaryTile
                  label="Active"
                  value={counts.active}
                  theme={TINT.mint}
                  icon={<CircleCheck size={30} color={TINT.mint.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Expiring soon"
                  value={counts.expiringSoon}
                  theme={TINT.peach}
                  icon={<Clock size={30} color={TINT.peach.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Times used"
                  value={counts.timesUsed}
                  theme={TINT.lavender}
                  icon={<Users size={30} color={TINT.lavender.icon} strokeWidth={1.8} />}
                />
              </View>

              {filtered.length === 0 ? (
                <Text style={styles.noMatch}>No offers match</Text>
              ) : (
                filtered.map((c) => {
                  const state = states.get(c.id);
                  if (!state) {
                    return null;
                  }
                  return (
                    <CouponCard
                      key={c.id}
                      coupon={c}
                      state={state}
                      deleting={deleting}
                      onToggle={() => toggleActive(c)}
                      onEdit={() => editCoupon(c.id)}
                      onDelete={() => confirmDelete(c.id, c.code)}
                    />
                  );
                })
              )}
            </>
          )
        )}
      </ScrollView>
    </View>
  );
}
