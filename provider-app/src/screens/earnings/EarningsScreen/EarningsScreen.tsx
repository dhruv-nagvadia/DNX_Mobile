import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Percent,
  ReceiptText,
  ShoppingBag,
  Store,
  Wallet,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { formatMoney } from '@/utils/money';
import { serviceIcon } from '@/utils/serviceIcon';
import { INK, PAGE_BG, PILL, TINT } from '@/utils/modernTheme';
import { Color } from '@/utils/Theme';
import { EarningsSettlement, EarningsTransaction } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useEarningsScreen } from './useEarningsScreen';
import { BusinessSelectSheet } from './BusinessSelectSheet';
import { COMMISSION_ORANGE, EARN_BLUE, EarningsTrendChart } from './EarningsTrendChart';
import { PERIODS, paidVia, ratePct, shortDate } from './helpers';
import { Granularity } from './types';
import { BALANCE_GRADIENT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EarningsScreen'>;
type Tint = (typeof TINT)[keyof typeof TINT];

const SALES_PREVIEW = 2;
const SALES_EXPANDED = 20;
const GRANULARITIES: Granularity[] = ['D', 'W', 'M'];

function Tile({
  tint,
  icon,
  label,
  value,
  hint,
}: {
  tint: Tint;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: tint.border }]}>
      <GradientBackground colors={tint.colors} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileMain}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        {hint}
      </View>
    </View>
  );
}

function SaleRow({ t, last }: { t: EarningsTransaction; last: boolean }) {
  const isBooking = t.kind === 'BOOKING';
  const Icon = isBooking ? serviceIcon(t.title) : ShoppingBag;
  const owesCommission = t.payableMinor < 0;
  const meta = [t.businessName, t.settledAt ? shortDate(t.settledAt) : null, paidVia(t)].filter(Boolean).join('  •  ');

  return (
    <View style={[styles.listRow, !last && styles.listRowDivider]}>
      <View style={[styles.saleIcon, isBooking ? styles.saleIconBooking : styles.saleIconOrder]}>
        <Icon size={22} color={isBooking ? PILL.lavender.fg : PILL.blue.fg} />
      </View>
      <View style={styles.listMain}>
        <Text style={styles.listTitle} numberOfLines={1}>
          {t.title}
        </Text>
        <Text style={styles.listMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <View style={styles.listRight}>
        {owesCommission ? (
          <>
            <Text style={[styles.saleAmount, styles.amountNegative]}>−{formatMoney(Math.abs(t.payableMinor))}</Text>
            <Text style={styles.listMeta} numberOfLines={1}>
              commission on {formatMoney(t.cashMinor)} cash
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.saleAmount, styles.amountPositive]}>+{formatMoney(t.earningMinor)}</Text>
            <Text style={styles.listMeta}>of {formatMoney(t.grossMinor)}</Text>
          </>
        )}
      </View>
    </View>
  );
}

function PayoutRow({
  p,
  last,
  expanded,
  onToggle,
}: {
  p: EarningsSettlement;
  last: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const toYou = p.direction === 'TO_PROVIDER';
  const meta = [formatMoney(p.amountMinor), p.method, shortDate(p.paidAt)].filter(Boolean).join('  •  ');

  return (
    <TouchableOpacity
      style={[styles.payoutRow, !last && styles.listRowDivider]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.listRowInner}>
        <View style={[styles.payoutIcon, toYou ? styles.payoutIconIn : styles.payoutIconOut]}>
          {toYou ? <ArrowDown size={20} color={PILL.green.fg} /> : <ArrowUp size={20} color={COMMISSION_ORANGE} />}
        </View>
        <View style={styles.listMain}>
          <Text style={styles.listTitle}>{toYou ? 'DNX paid you' : 'You paid DNX'}</Text>
          <Text style={styles.listMeta} numberOfLines={1}>
            {meta}
          </Text>
        </View>
        {expanded ? <ChevronDown size={20} color={INK} /> : <ChevronRight size={20} color={INK} />}
      </View>
      {expanded && (
        <View style={styles.payoutDetail}>
          {!!p.reference && <Text style={styles.payoutDetailText}>Reference: {p.reference}</Text>}
          {!!p.note && <Text style={styles.payoutDetailText}>{p.note}</Text>}
          {!p.reference && !p.note && <Text style={styles.payoutDetailText}>No reference or note added.</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * Earnings — matches "DNX Earnings Dashboard UI.png": light header, period
 * chips + business select, navy payout-balance card with breakdown, four
 * pastel tiles, trend chart, online/cash split, per-business, completed sales
 * and payouts. Everything comes from `getMyEarnings` (+ a previous-period
 * call for the % change) and `getMyBusinesses` (photos).
 */
export default function EarningsScreen() {
  const {
    period,
    setPeriod,
    granularity,
    setGranularity,
    businesses,
    businessId,
    setBusinessId,
    selectedBusinessName,
    photoById,
    earnings,
    isError,
    earnTrendPct,
    trend,
    refreshing,
    refresh,
  } = useEarningsScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(true);
  const [allSales, setAllSales] = useState(false);
  const [openPayoutId, setOpenPayoutId] = useState<string | null>(null);

  const canGoBack = navigation.canGoBack();

  const renderBody = () => {
    if (!earnings) {
      if (isError) {
        return (
          <View style={[styles.card, styles.stateCard]}>
            <CircleAlert size={28} color={Color.error} />
            <Text style={styles.stateText}>Couldn't load your earnings.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={styles.stateCard}>
          <ActivityIndicator color={EARN_BLUE} />
        </View>
      );
    }

    const { summary, upcoming, balance } = earnings;
    const owesYou = balance.balanceMinor >= 0;

    const selectedBiz = earnings.businesses.find((b) => b.id === businessId);
    const commissionBps =
      summary.grossMinor > 0
        ? (summary.commissionMinor / summary.grossMinor) * 10000
        : selectedBiz?.commissionBps ?? earnings.defaultCommissionBps;

    const trendUp = (earnTrendPct ?? 0) >= 0;

    const paidTotal = summary.onlineMinor + summary.cashMinor;
    const onlinePct = paidTotal > 0 ? Math.round((summary.onlineMinor / paidTotal) * 100) : 0;
    const cashPct = paidTotal > 0 ? 100 - onlinePct : 0;

    const businessRows = businessId
      ? earnings.businesses.filter((b) => b.id === businessId)
      : earnings.businesses;

    const sales = earnings.transactions.slice(0, allSales ? SALES_EXPANDED : SALES_PREVIEW);
    const payouts = earnings.payouts;

    return (
      <>
        {/* Payout balance (all-time, all businesses) */}
        <View style={styles.balanceCard}>
          <GradientBackground colors={BALANCE_GRADIENT} />
          <View style={styles.balanceLeft}>
            <View style={[styles.balanceChip, !owesYou && styles.balanceChipOwe]}>
              <Text style={[styles.balanceChipText, !owesYou && styles.balanceChipTextOwe]}>
                {owesYou ? 'DNX owes you' : 'You owe DNX'}
              </Text>
            </View>
            <Text style={styles.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              {formatMoney(Math.abs(balance.balanceMinor))}
            </Text>
            <View style={styles.manualPill}>
              <CircleCheck size={14} color={PILL.green.fg} />
              <Text style={styles.manualPillText} numberOfLines={1} adjustsFontSizeToFit>
                {owesYou ? 'Paid out manually by DNX' : 'Settled manually with DNX'}
              </Text>
            </View>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceRight}>
            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setBreakdownOpen((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.breakdownToggleText}>See breakdown</Text>
              {breakdownOpen ? (
                <ChevronUp size={16} color={Color.onDark} />
              ) : (
                <ChevronDown size={16} color={Color.onDark} />
              )}
            </TouchableOpacity>
            {breakdownOpen && (
              <>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>
                    Collected online
                  </Text>
                  <Text style={styles.breakdownValue}>{formatMoney(balance.earnedOnlineMinor)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>
                    − Commission
                  </Text>
                  <Text style={styles.breakdownValue}>{formatMoney(balance.earnedCommissionMinor)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>
                    − Paid out
                  </Text>
                  <Text style={styles.breakdownValue}>{formatMoney(balance.paidOutMinor)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>
                    + You paid DNX
                  </Text>
                  <Text style={styles.breakdownValue}>{formatMoney(balance.receivedMinor)}</Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownTotalText}>= Balance</Text>
                  <Text style={styles.breakdownTotalText} numberOfLines={1}>
                    {owesYou ? '' : '−'}
                    {formatMoney(Math.abs(balance.balanceMinor))}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Tiles */}
        <View style={styles.tileGrid}>
          <View style={styles.tileRow}>
            <Tile
              tint={TINT.blue}
              icon={<ReceiptText size={22} color={TINT.blue.icon} />}
              label="Sales"
              value={formatMoney(summary.grossMinor)}
              hint={
                <Text style={styles.tileHint}>
                  {summary.count} sale{summary.count === 1 ? '' : 's'}
                </Text>
              }
            />
            <Tile
              tint={TINT.peach}
              icon={<Percent size={22} color={COMMISSION_ORANGE} />}
              label="Commission"
              value={formatMoney(summary.commissionMinor)}
              hint={<Text style={styles.tileHint}>{ratePct(Math.round(commissionBps))}</Text>}
            />
          </View>
          <View style={styles.tileRow}>
            <Tile
              tint={TINT.mint}
              icon={<Wallet size={22} color={TINT.mint.icon} />}
              label="You earn"
              value={formatMoney(summary.netMinor)}
              hint={
                earnTrendPct !== null ? (
                  <View style={styles.trendRow}>
                    {trendUp ? (
                      <ArrowUp size={13} color={PILL.green.fg} />
                    ) : (
                      <ArrowDown size={13} color={Color.error} />
                    )}
                    <Text style={[styles.tileTrend, !trendUp && styles.amountNegative]}>
                      {Math.abs(earnTrendPct).toFixed(0)}%
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.tileHint}>after commission</Text>
                )
              }
            />
            <Tile
              tint={TINT.lavender}
              icon={<Clock size={22} color={TINT.lavender.icon} />}
              label="Coming up"
              value={formatMoney(upcoming.netMinor)}
              hint={<Text style={styles.tileHint}>{upcoming.count} open</Text>}
            />
          </View>
        </View>

        {/* Earnings trend */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Earnings trend</Text>
            <View style={styles.segment}>
              {GRANULARITIES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.segmentItem, granularity === g && styles.segmentItemActive]}
                  onPress={() => setGranularity(g)}
                >
                  <Text style={[styles.segmentText, granularity === g && styles.segmentTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <EarningsTrendChart points={trend} />
        </View>

        {/* How you were paid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How you were paid</Text>
          <View style={styles.splitBar}>
            {paidTotal === 0 ? (
              <View style={styles.splitEmpty} />
            ) : (
              <>
                {onlinePct > 0 && (
                  <View style={[styles.splitSeg, styles.splitOnline, { flex: onlinePct }]}>
                    {onlinePct >= 10 && <Text style={styles.splitText}>{onlinePct}%</Text>}
                  </View>
                )}
                {cashPct > 0 && (
                  <View style={[styles.splitSeg, styles.splitCash, { flex: cashPct }]}>
                    {cashPct >= 10 && <Text style={styles.splitText}>{cashPct}%</Text>}
                  </View>
                )}
              </>
            )}
          </View>
          <View style={[styles.legendRow, styles.listRowDivider]}>
            <View style={[styles.legendDot, styles.dotBlue]} />
            <Text style={styles.legendRowLabel}>Online</Text>
            <Text style={styles.legendRowValue}>{formatMoney(summary.onlineMinor)}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.dotGreen]} />
            <Text style={styles.legendRowLabel}>Cash</Text>
            <Text style={styles.legendRowValue}>{formatMoney(summary.cashMinor)}</Text>
          </View>
        </View>

        {/* By business */}
        {businessRows.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>By business</Text>
            {businessRows.map((b, i) => {
              const photo = photoById.get(b.id);
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.listRow, i < businessRows.length - 1 && styles.listRowDivider]}
                  onPress={() => navigation.navigate(ROUTES.BUSINESS_DETAIL, { businessId: b.id })}
                  activeOpacity={0.7}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.bizThumb} />
                  ) : (
                    <View style={[styles.bizThumb, styles.bizThumbEmpty]}>
                      <Store size={20} color={INK} />
                    </View>
                  )}
                  <View style={styles.bizMain}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {b.name}
                    </Text>
                    <Pill
                      label={b.isCustomRate ? `Custom ${ratePct(b.commissionBps)}` : `${ratePct(b.commissionBps)} rate`}
                      colors={b.isCustomRate ? PILL.lavender : PILL.grey}
                    />
                  </View>
                  <View style={styles.listRight}>
                    <Text style={styles.bizAmount}>{formatMoney(b.netMinor)}</Text>
                    <Text style={styles.listMeta}>earned</Text>
                  </View>
                  <ChevronRight size={20} color={INK} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Completed sales */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Completed sales</Text>
            {earnings.transactions.length > SALES_PREVIEW && (
              <TouchableOpacity
                style={styles.viewAll}
                onPress={() => setAllSales((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.viewAllText}>{allSales ? 'Show less' : 'View all'}</Text>
                {allSales ? <ChevronUp size={16} color={EARN_BLUE} /> : <ChevronRight size={16} color={EARN_BLUE} />}
              </TouchableOpacity>
            )}
          </View>
          {sales.length === 0 ? (
            <Text style={styles.emptyText}>No completed sales in this period.</Text>
          ) : (
            sales.map((t, i) => <SaleRow key={`${t.kind}-${t.id}`} t={t} last={i === sales.length - 1} />)
          )}
          {allSales && earnings.transactions.length > SALES_EXPANDED && (
            <Text style={styles.footNote}>
              Showing the latest {SALES_EXPANDED} of {earnings.transactions.length}.
            </Text>
          )}
        </View>

        {/* Payouts & settlements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payouts & settlements</Text>
          {payouts.length === 0 ? (
            <Text style={styles.emptyText}>No payouts yet — DNX settles your balance manually.</Text>
          ) : (
            payouts.map((p, i) => (
              <PayoutRow
                key={p.id}
                p={p}
                last={i === payouts.length - 1}
                expanded={openPayoutId === p.id}
                onToggle={() => setOpenPayoutId((cur) => (cur === p.id ? null : p.id))}
              />
            ))
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.statusSpacer, { height: insets.top }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={24} color={INK} />
            </TouchableOpacity>
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>Earnings</Text>
            <Text style={styles.subtitle}>After DNX's commission</Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={22} color={INK} />
          </TouchableOpacity>
        </View>

        {/* Period chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={styles.chipsScroll}
        >
          {PERIODS.map((p) => {
            const active = period === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setPeriod(p.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Business select */}
        <TouchableOpacity style={styles.select} onPress={() => setSheetOpen(true)} activeOpacity={0.7}>
          <Store size={20} color={INK} />
          <Text style={styles.selectText} numberOfLines={1}>
            {selectedBusinessName ?? 'All businesses'}
          </Text>
          <ChevronDown size={20} color={INK} />
        </TouchableOpacity>

        {renderBody()}
      </ScrollView>

      <BusinessSelectSheet
        visible={sheetOpen}
        businesses={businesses}
        selectedId={businessId}
        onSelect={setBusinessId}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

