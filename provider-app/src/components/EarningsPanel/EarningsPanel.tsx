import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

import { TrendChart } from '@/components/TrendChart';
import { Color } from '@/utils/Theme';

import { useEarningsPanel } from './useEarningsPanel';
import { EarningsPanelProps, EarningsPeriod } from './types';
import { styles } from './styles';

const PERIODS: { id: EarningsPeriod; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

const formatMajor = (v: number, currency: string) =>
  `${currency === 'INR' ? '₹' : currency + ' '}${v.toLocaleString('en-IN')}`;

const compact = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : String(Math.round(v)));

/** Per-business earnings on the Business Detail screen (mockup: Week/Month/
 * Year segment, date range, big total, "+12% vs. previous month" pill, area
 * chart). The section title ("Earnings") is rendered by the screen. */
export function EarningsPanel({ businessId, isStore }: EarningsPanelProps) {
  const { period, setPeriod, points, total, trendPct, currency, rangeLabel, compareLabel } =
    useEarningsPanel(businessId, isStore);
  const up = (trendPct ?? 0) >= 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.segment}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.segmentBtn, period === p.id && styles.segmentBtnActive]}
            onPress={() => setPeriod(p.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: period === p.id }}
          >
            <Text style={[styles.segmentText, period === p.id && styles.segmentTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.range}>{rangeLabel}</Text>
      <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit>
        {formatMajor(total, currency)}
      </Text>
      {trendPct !== null && (
        <View style={styles.trendRow}>
          <View style={[styles.trendPill, up ? styles.trendPillUp : styles.trendPillDown]}>
            {up ? <ArrowUp size={14} color={Color.success} /> : <ArrowDown size={14} color={Color.error} />}
            <Text style={[styles.trendText, up ? styles.trendTextUp : styles.trendTextDown]}>
              {up ? '+' : ''}
              {trendPct.toFixed(0)}%
            </Text>
          </View>
          <Text style={styles.trendLabel}>{compareLabel}</Text>
        </View>
      )}

      <View style={styles.chart}>
        <TrendChart data={points} height={160} highlightLast formatAxis={compact} />
      </View>
    </View>
  );
}
