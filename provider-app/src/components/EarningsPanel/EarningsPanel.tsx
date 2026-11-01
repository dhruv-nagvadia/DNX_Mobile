import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

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

/** Ports `frontend/src/components/EarningsPanel/EarningsPanel.tsx` — a
 * per-business earnings trend chart shown on the business detail screen
 * (same placement as the web dashboard, not the top-level Earnings tab). */
export function EarningsPanel({ businessId, isStore }: EarningsPanelProps) {
  const { period, setPeriod, points, total, trendPct, currency } = useEarningsPanel(businessId, isStore);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings trend</Text>
        <View style={styles.segment}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.segmentBtn, period === p.id && styles.segmentBtnActive]}
              onPress={() => setPeriod(p.id)}
            >
              <Text style={[styles.segmentText, period === p.id && styles.segmentTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.headline}>
        <Text style={styles.headlineValue} numberOfLines={1}>
          {formatMajor(total, currency)}
        </Text>
        {trendPct !== null && (
          <View style={[styles.trendBadge, trendPct >= 0 ? styles.trendUp : styles.trendDown]}>
            {trendPct >= 0 ? (
              <TrendingUp size={12} color={Color.success} />
            ) : (
              <TrendingDown size={12} color={Color.error} />
            )}
            <Text style={[styles.trendText, trendPct >= 0 ? styles.trendTextUp : styles.trendTextDown]}>
              {trendPct >= 0 ? '+' : ''}
              {trendPct.toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      <TrendChart data={points} height={160} highlightLast formatAxis={compact} />
    </View>
  );
}
