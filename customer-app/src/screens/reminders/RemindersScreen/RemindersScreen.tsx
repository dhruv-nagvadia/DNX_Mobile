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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  CalendarClock,
  CalendarDays,
  CalendarX,
  ChevronDown,
  ChevronUp,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { TINT } from '@/utils/modernTheme';
import { TYPE_LABEL } from '@/utils/reminderMeta';
import { Reminder } from '@/redux/api/reminder/types';

import { useRemindersScreen } from './useRemindersScreen';
import { ReminderCard } from './ReminderCard';
import { styles, COLORS } from './styles';

type Tone = 'red' | 'amber' | 'blue' | 'grey';

const DOT_STYLE = {
  red: styles.dotRed,
  amber: styles.dotAmber,
  blue: styles.dotBlue,
  grey: styles.dotGrey,
};

/** Reminders tab — renewals, services and follow-ups. */
export default function RemindersScreen() {
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

  const card = (r: Reminder, isHistory: boolean, grouped: boolean, index: number) => (
    <ReminderCard
      key={r.id}
      reminder={r}
      isHistory={isHistory}
      grouped={grouped}
      divider={grouped && index > 0}
      onOpen={onOpen}
      onRespond={onRespond}
      onBook={onBook}
    />
  );

  const sectionHeader = (label: string, count: number, tone: Tone) => (
    <View style={styles.sectionRow} accessibilityRole="header">
      <View style={[styles.dot, DOT_STYLE[tone]]} />
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
    textStyle: StyleProp<TextStyle>,
  ) => (
    <View
      style={[styles.statTile, { borderColor: tint.border }]}
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <GradientBackground colors={tint.colors} />
      <View style={styles.statTop}>
        <Icon size={22} color={tint.icon} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={[styles.statLabel, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  const nothingMatches = overdue.length + dueToday.length + upcoming.length + history.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
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
            {statTile(stats.overdue, 'Overdue', CalendarX, TINT.pink, styles.statLabelRed)}
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
              {overdue.map((r, i) => card(r, false, false, i))}
            </>
          )}
          {dueToday.length > 0 && (
            <>
              {sectionHeader('Due today', dueToday.length, 'amber')}
              {dueToday.map((r, i) => card(r, false, false, i))}
            </>
          )}
          {upcoming.length > 0 && (
            <>
              {sectionHeader('Upcoming', upcoming.length, 'blue')}
              <View style={styles.group}>{upcoming.map((r, i) => card(r, false, true, i))}</View>
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
                <View style={[styles.dot, DOT_STYLE.grey]} />
                <Text style={[styles.sectionTitle, styles.sectionTitleFlex]}>
                  History ({history.length})
                </Text>
                {historyCanExpand &&
                  (historyExpanded ? (
                    <ChevronUp size={20} color={COLORS.ink} />
                  ) : (
                    <ChevronDown size={20} color={COLORS.ink} />
                  ))}
              </TouchableOpacity>
              {/* Latest few always visible; the chevron / "Show all" reveals the rest. */}
              <View style={styles.group}>{historyShown.map((r, i) => card(r, true, true, i))}</View>
              {historyCanExpand && (
                <TouchableOpacity
                  style={styles.showAllBtn}
                  onPress={toggleHistory}
                  accessibilityRole="button"
                >
                  <Text style={styles.showAllText}>
                    {historyExpanded ? 'Show less' : `Show all ${history.length}`}
                  </Text>
                  {historyExpanded ? (
                    <ChevronUp size={16} color={COLORS.link} />
                  ) : (
                    <ChevronDown size={16} color={COLORS.link} />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
