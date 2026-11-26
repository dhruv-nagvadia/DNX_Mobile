import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CalendarDays,
  CalendarX,
  ChevronUp,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Color } from '@/utils/Theme';
import { INK, TINT } from '@/utils/modernTheme';
import { TYPE_ICON, TYPE_LABEL } from '@/utils/reminderMeta';
import { Reminder } from '@/redux/api/reminder/types';

import { useRemindersScreen } from './useRemindersScreen';
import { ReminderCard } from './ReminderCard';
import { COLORS, styles } from './styles';

type Bar = 'red' | 'blue';

const BAR_STYLE = {
  red: styles.barRed,
  blue: styles.barBlue,
};

/** Reminders tab — renewals, services and follow-ups. */
export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    total,
    overdue,
    dueToday,
    upcoming,
    history,
    stats,
    categories,
    filter,
    setFilter,
    historyExpanded,
    historyCanExpand,
    historyShown,
    toggleHistory,
    refreshing,
    onRefresh,
    onAdd,
    onOpen,
    onRespond,
    onBook,
  } = useRemindersScreen();

  const card = (r: Reminder, isHistory: boolean, index: number) => (
    <ReminderCard
      key={r.id}
      reminder={r}
      isHistory={isHistory}
      divider={index > 0}
      onOpen={onOpen}
      onRespond={onRespond}
      onBook={onBook}
    />
  );

  const sectionHeader = (label: string, count: number, bar: Bar) => (
    <View style={styles.sectionRow} accessibilityRole="header">
      <View style={[styles.bar, BAR_STYLE[bar]]} />
      <Text style={styles.sectionTitle}>
        {label} ({count})
      </Text>
    </View>
  );

  const statTile = (
    value: number,
    label: string,
    Icon: LucideIcon,
    tint: (typeof TINT)[keyof typeof TINT],
    labelStyle: StyleProp<TextStyle>,
    valueStyle?: StyleProp<TextStyle>,
  ) => (
    <View
      style={[styles.statTile, { borderColor: tint.border }]}
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <GradientBackground colors={tint.colors} />
      <View style={styles.statTop}>
        <View style={styles.statIcon}>
          <Icon size={18} color={tint.icon} />
        </View>
        <Text style={[styles.statValue, valueStyle]}>{value}</Text>
      </View>
      <Text style={[styles.statLabel, labelStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  const nothingMatches = overdue.length + dueToday.length + upcoming.length + history.length === 0;

  return (
    <View style={styles.container}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerText}>
          <Text style={styles.title} accessibilityRole="header">
            Reminders
          </Text>
          <Text style={styles.subtitle}>Renewals, services and follow-ups.</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add reminder"
        >
          <Plus size={18} color={COLORS.white} strokeWidth={2.4} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.link} />
        </View>
      ) : total === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Bell size={34} color={COLORS.link} strokeWidth={1.6} />
          </View>
          <Text style={styles.emptyTitle}>No reminders yet</Text>
          <Text style={styles.emptyText}>
            Add renewals like car insurance or bike service, and we&apos;ll keep track of them for
            you.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            activeOpacity={0.85}
            onPress={onAdd}
            accessibilityRole="button"
          >
            <Plus size={18} color={COLORS.white} strokeWidth={2.4} />
            <Text style={styles.emptyBtnText}>Add a reminder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.statsRow}>
            {statTile(
              stats.overdue,
              'Overdue',
              CalendarX,
              TINT.pink,
              styles.statLabelRed,
              styles.statValueRed,
            )}
            {statTile(stats.today, 'Due today', CalendarClock, TINT.peach, styles.statLabelAmber)}
            {statTile(stats.thisMonth, 'This month', CalendarDays, TINT.blue, styles.statLabelBlue)}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}
          >
            {(['all', ...categories] as const).map((c) => {
              const active = filter === c;
              const Icon = c === 'all' ? null : TYPE_ICON[c];
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() => setFilter(c)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Show ${c === 'all' ? 'all reminders' : TYPE_LABEL[c]}`}
                >
                  {Icon && <Icon size={16} color={active ? Color.white : INK} />}
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {c === 'all' ? 'All' : TYPE_LABEL[c]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {nothingMatches && <Text style={styles.noMatch}>No reminders in this category.</Text>}

          {overdue.length > 0 && (
            <>
              {sectionHeader('Overdue', overdue.length, 'red')}
              <View style={styles.group}>{overdue.map((r, i) => card(r, false, i))}</View>
            </>
          )}

          {dueToday.length > 0 && (
            <>
              {sectionHeader('Due today', dueToday.length, 'blue')}
              <View style={styles.group}>{dueToday.map((r, i) => card(r, false, i))}</View>
            </>
          )}

          {upcoming.length > 0 && (
            <>
              {sectionHeader('Upcoming', upcoming.length, 'blue')}
              <View style={styles.group}>{upcoming.map((r, i) => card(r, false, i))}</View>
            </>
          )}

          {history.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.sectionRow}
                activeOpacity={0.7}
                onPress={toggleHistory}
                disabled={!historyCanExpand}
                accessibilityRole="button"
                accessibilityState={{ expanded: historyExpanded, disabled: !historyCanExpand }}
                accessibilityLabel={`History, ${history.length} reminders`}
              >
                <View style={[styles.bar, BAR_STYLE.blue]} />
                <Text style={[styles.sectionTitle, styles.sectionTitleFlex]}>
                  History ({history.length})
                </Text>
                {/* Latest few always visible; this link reveals (or hides) the rest. */}
                {historyCanExpand && (
                  <View style={styles.sectionLink}>
                    <Text style={styles.sectionLinkText}>
                      {historyExpanded ? 'Show less' : `Show all ${history.length}`}
                    </Text>
                    {historyExpanded ? (
                      <ChevronUp size={16} color={COLORS.link} />
                    ) : (
                      <ArrowRight size={16} color={COLORS.link} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.group}>{historyShown.map((r, i) => card(r, true, i))}</View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
