import React, { Fragment } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleProp,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, ChevronRight, Clock, Coffee, Copy, Timer } from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { LoadingView } from '@/components/LoadingView';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, TINT } from '@/utils/modernTheme';

import { formatDuration, toMinutes, useBusinessHoursScreen } from './useBusinessHoursScreen';
import { DAY_LABELS, DISPLAY_ORDER, SHORT_DAY_LABELS } from './types';
import { TimePill } from './TimePill';
import { BRAND_BLUE, TIP_COLORS, TIP_ICON, TRACK, styles } from './styles';

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

interface TileProps {
  tint: (typeof TINT)[keyof typeof TINT];
  borderStyle: StyleProp<ViewStyle>;
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string | null;
}

function SummaryTile({ tint, borderStyle, icon, label, value, detail }: TileProps) {
  return (
    <View style={[styles.tile, borderStyle]}>
      <GradientBackground colors={tint.colors} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {label}
        </Text>
        <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {value}
        </Text>
        {!!detail && (
          <Text style={styles.tileDetail} numberOfLines={2}>
            {detail}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function BusinessHoursScreen() {
  const {
    isLoading,
    saving,
    businessName,
    todayDow,
    days,
    toggleDay,
    setTime,
    copyMondayToAll,
    hasBreak,
    toggleBreak,
    breakStart,
    setBreakStart,
    breakEnd,
    setBreakEnd,
    openDaysCount,
    weeklyMinutes,
    openNow,
    dirty,
    error,
    save,
    goBack,
    goToCalendar,
  } = useBusinessHoursScreen();
  const insets = useSafeAreaInsets();

  const openDaysLabel = `Open ${openDaysCount} ${openDaysCount === 1 ? 'day' : 'days'}`;
  const subtitle = businessName ? `${businessName} • ${openDaysLabel}` : openDaysLabel;

  const orderedDays = DISPLAY_ORDER.map((dow) => days.find((d) => d.dayOfWeek === dow)).filter(
    (d): d is NonNullable<typeof d> => !!d,
  );
  const saveDisabled = !dirty || saving;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
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
            Hours
          </Text>
          {!isLoading && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Summary tiles ──────────────────────────────────────────── */}
            <View style={styles.tiles}>
              <SummaryTile
                tint={TINT.mint}
                borderStyle={styles.tileMint}
                icon={<Clock size={18} color={TINT.mint.icon} strokeWidth={2} />}
                label="Open now"
                value={openNow?.label ?? 'Not set'}
                detail={openNow?.detail}
              />
              <SummaryTile
                tint={TINT.blue}
                borderStyle={styles.tileBlue}
                icon={<Calendar size={18} color={TINT.blue.icon} strokeWidth={2} />}
                label="Open days"
                value={`${openDaysCount}/7`}
              />
              <SummaryTile
                tint={TINT.lavender}
                borderStyle={styles.tileLavender}
                icon={<Timer size={18} color={TINT.lavender.icon} strokeWidth={2} />}
                label="Per week"
                value={formatDuration(weeklyMinutes)}
              />
            </View>

            {/* ── Daily break ────────────────────────────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Coffee size={26} color={INK} strokeWidth={1.9} />
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>Daily break</Text>
                  <Text style={styles.cardHint}>Applied to all open days</Text>
                </View>
                <Switch
                  value={hasBreak}
                  onValueChange={toggleBreak}
                  trackColor={TRACK}
                  thumbColor={Color.white}
                  ios_backgroundColor={TRACK.false}
                  accessibilityLabel="Daily break"
                />
              </View>
              <View style={styles.rangeRow}>
                <TimePill label="Break starts" value={breakStart} onChange={setBreakStart} disabled={!hasBreak} />
                <Text style={styles.rangeDash}>–</Text>
                <TimePill label="Break ends" value={breakEnd} onChange={setBreakEnd} disabled={!hasBreak} />
              </View>
            </View>

            {/* ── Weekly schedule ────────────────────────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Clock size={26} color={INK} strokeWidth={1.9} />
                <Text style={[styles.cardTitle, styles.flex]} numberOfLines={1}>
                  Weekly schedule
                </Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={copyMondayToAll}
                  accessibilityRole="button"
                  accessibilityLabel="Copy Monday's hours to all days"
                  activeOpacity={0.7}
                >
                  <Copy size={14} color={BRAND_BLUE} strokeWidth={2} />
                  <Text style={styles.copyText}>Copy Mon to all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scheduleList}>
                {orderedDays.map((d, i) => {
                  const isToday = d.dayOfWeek === todayDow;
                  const span = toMinutes(d.closeTime) - toMinutes(d.openTime);
                  const nextIsToday = orderedDays[i + 1]?.dayOfWeek === todayDow;
                  return (
                    <Fragment key={d.dayOfWeek}>
                      <View style={[styles.dayRow, isToday && styles.dayRowToday]}>
                        <View style={styles.dayLabel}>
                          <Text style={styles.dayName}>{SHORT_DAY_LABELS[d.dayOfWeek]}</Text>
                          {isToday && (
                            <View style={styles.todayTag}>
                              <Text style={styles.todayTagText}>Today</Text>
                            </View>
                          )}
                        </View>
                        <Switch
                          value={d.isOpen}
                          onValueChange={() => toggleDay(d.dayOfWeek)}
                          trackColor={TRACK}
                          thumbColor={Color.white}
                          ios_backgroundColor={TRACK.false}
                          accessibilityLabel={`${DAY_LABELS[d.dayOfWeek]} open`}
                          style={styles.daySwitch}
                        />
                        {d.isOpen ? (
                          <>
                            <View style={styles.dayTimes}>
                              <TimePill
                                size="compact"
                                label={`${DAY_LABELS[d.dayOfWeek]} opens`}
                                value={d.openTime}
                                onChange={(v) => setTime(d.dayOfWeek, 'openTime', v)}
                              />
                              <Text style={styles.rangeDashSmall}>–</Text>
                              <TimePill
                                size="compact"
                                label={`${DAY_LABELS[d.dayOfWeek]} closes`}
                                value={d.closeTime}
                                onChange={(v) => setTime(d.dayOfWeek, 'closeTime', v)}
                              />
                            </View>
                            <Text style={styles.duration} numberOfLines={1} adjustsFontSizeToFit>
                              {span > 0 ? formatDuration(span) : '—'}
                            </Text>
                          </>
                        ) : (
                          <View style={styles.closedBar}>
                            <Text style={styles.closedText}>Closed</Text>
                          </View>
                        )}
                      </View>
                      {i < orderedDays.length - 1 && !isToday && !nextIsToday && (
                        <View style={styles.dayDivider} />
                      )}
                    </Fragment>
                  );
                })}
              </View>
            </View>

            {/* ── Tip ────────────────────────────────────────────────────── */}
            <TouchableOpacity
              style={styles.tip}
              onPress={goToCalendar}
              accessibilityRole="button"
              accessibilityLabel="Holiday or special hours? Use Calendar to change a single date"
              activeOpacity={0.8}
            >
              <GradientBackground colors={TIP_COLORS} />
              <Calendar size={30} color={TIP_ICON} strokeWidth={1.8} />
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>Holiday or special hours?</Text>
                <View style={styles.tipLinkRow}>
                  <Text style={styles.tipLink}>Use Calendar to change a single date</Text>
                  <ChevronRight size={16} color={INK} strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* ── Sticky save bar ──────────────────────────────────────────── */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) + 4 }]}>
            <Text style={styles.footerStatus} numberOfLines={1}>
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </Text>
            <TouchableOpacity
              style={[styles.saveBtn, saveDisabled && !saving && styles.saveBtnDisabled]}
              onPress={save}
              disabled={saveDisabled}
              accessibilityRole="button"
              accessibilityLabel="Save"
              accessibilityState={{ disabled: saveDisabled, busy: saving }}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Color.white} />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
