import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { formatMoney } from '@/utils/money';
import { RANGE_PRESETS } from '@/utils/dateRange';
import { EarningsTransaction } from '@/redux/api/business/types';

import { useEarningsScreen } from './useEarningsScreen';
import { styles } from './styles';

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });

const PAID_VIA = (t: EarningsTransaction) => {
  if (t.onlineMinor > 0 && t.cashMinor > 0) return 'Online + cash';
  if (t.onlineMinor > 0) return 'Online';
  if (t.cashMinor > 0) return 'Cash';
  return '—';
};

export default function EarningsScreen() {
  const { preset, setPreset, businesses, businessId, setBusinessId, earnings, isLoading, refreshing, refresh } =
    useEarningsScreen();

  const commissionPct = earnings ? (earnings.defaultCommissionBps / 100).toFixed(1) : '0';
  const balance = earnings?.balance.balanceMinor ?? 0;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <Text style={styles.title}>Earnings</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
          {RANGE_PRESETS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.presetChip, preset === p.id && styles.presetChipActive]}
              onPress={() => setPreset(p.id)}
            >
              <Text style={[styles.presetText, preset === p.id && styles.presetTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {businesses.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.businessRow}>
            <TouchableOpacity
              style={[styles.presetChip, businessId === '' && styles.presetChipActive]}
              onPress={() => setBusinessId('')}
            >
              <Text style={[styles.presetText, businessId === '' && styles.presetTextActive]}>All businesses</Text>
            </TouchableOpacity>
            {businesses.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.presetChip, businessId === b.id && styles.presetChipActive]}
                onPress={() => setBusinessId(b.id)}
              >
                <Text style={[styles.presetText, businessId === b.id && styles.presetTextActive]}>
                  {b.businessName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {earnings && (
          <>
            <View style={styles.statGrid}>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{formatMoney(earnings.summary.grossMinor)}</Text>
                <Text style={styles.statLabel}>Sales</Text>
                <Text style={styles.statHint}>{earnings.summary.count} completed</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{formatMoney(earnings.summary.commissionMinor)}</Text>
                <Text style={styles.statLabel}>DNX commission</Text>
                <Text style={styles.statHint}>{commissionPct}% rate</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{formatMoney(earnings.summary.netMinor)}</Text>
                <Text style={styles.statLabel}>You earn</Text>
                <Text style={styles.statHint}>
                  {formatMoney(earnings.summary.onlineMinor)} online · {formatMoney(earnings.summary.cashMinor)} cash
                </Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statValue}>{formatMoney(earnings.upcoming.netMinor)}</Text>
                <Text style={styles.statLabel}>Coming up</Text>
                <Text style={styles.statHint}>{earnings.upcoming.count} not yet completed</Text>
              </View>
            </View>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceTitle}>Your payout from DNX</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Earned online</Text>
                <Text style={styles.balanceValue}>+{formatMoney(earnings.balance.earnedOnlineMinor)}</Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>DNX commission</Text>
                <Text style={styles.balanceValue}>-{formatMoney(earnings.balance.earnedCommissionMinor)}</Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Already paid out</Text>
                <Text style={styles.balanceValue}>-{formatMoney(earnings.balance.paidOutMinor)}</Text>
              </View>
              {earnings.balance.receivedMinor > 0 && (
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>Received from DNX</Text>
                  <Text style={styles.balanceValue}>+{formatMoney(earnings.balance.receivedMinor)}</Text>
                </View>
              )}
              <View style={styles.balanceTotalRow}>
                <Text style={styles.balanceTotalLabel}>Balance</Text>
                <Text
                  style={[
                    styles.balanceTotalLabel,
                    balance >= 0 ? styles.balanceTotalPositive : styles.balanceTotalNegative,
                  ]}
                >
                  {formatMoney(Math.abs(balance))}
                </Text>
              </View>
              <Text style={styles.balanceFooter}>
                {balance >= 0 ? 'DNX will pay you this amount.' : 'You owe DNX this amount.'}
              </Text>
            </View>

            {businesses.length > 2 && earnings.businesses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>By business</Text>
                {earnings.businesses.map((b, i) => (
                  <View key={b.id} style={[styles.row, i === 0 && styles.rowFirst]}>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle}>{b.name}</Text>
                      <Text style={styles.rowSubtitle}>
                        {(b.commissionBps / 100).toFixed(1)}% rate{b.isCustomRate ? ' · custom' : ''}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={styles.rowGross}>{formatMoney(b.grossMinor)}</Text>
                      <Text style={styles.rowEarning}>+{formatMoney(b.netMinor)} earned</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed sales</Text>
              {earnings.transactions.length === 0 ? (
                <Text style={styles.emptyText}>No completed sales in this range.</Text>
              ) : (
                earnings.transactions.map((t, i) => (
                  <View key={`${t.kind}-${t.id}`} style={[styles.row, i === 0 && styles.rowFirst]}>
                    <View style={styles.rowMain}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{t.kind === 'BOOKING' ? 'Booking' : 'Order'}</Text>
                      </View>
                      <Text style={styles.rowTitle}>{t.title}</Text>
                      <Text style={styles.rowSubtitle}>
                        {t.businessName}
                        {t.settledAt ? ` · ${dateFmt.format(new Date(t.settledAt))}` : ''} · {PAID_VIA(t)}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={styles.rowGross}>{formatMoney(t.grossMinor)}</Text>
                      <Text style={styles.rowCommission}>
                        -{formatMoney(t.commissionMinor)} ({(t.commissionBps / 100).toFixed(1)}%)
                      </Text>
                      <Text style={styles.rowEarning}>+{formatMoney(t.earningMinor)}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {earnings.payouts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settlements</Text>
                {earnings.payouts.map((p, i) => (
                  <View key={p.id} style={[styles.row, i === 0 && styles.rowFirst]}>
                    <View style={styles.rowMain}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {p.direction === 'TO_PROVIDER' ? 'Paid to you' : 'Paid to DNX'}
                        </Text>
                      </View>
                      <Text style={styles.rowSubtitle}>
                        {dateFmt.format(new Date(p.paidAt))}
                        {p.method ? ` · ${p.method}` : ''}
                        {p.reference ? ` · ${p.reference}` : ''}
                      </Text>
                      {!!p.note && <Text style={styles.rowSubtitle}>{p.note}</Text>}
                    </View>
                    <Text style={styles.rowGross}>{formatMoney(p.amountMinor)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
