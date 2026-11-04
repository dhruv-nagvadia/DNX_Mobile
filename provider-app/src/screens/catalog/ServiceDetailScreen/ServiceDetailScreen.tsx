import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Coins,
  CreditCard,
  House,
  Pencil,
  Percent,
  Plus,
  SearchX,
  Tag,
  Trash2,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { BookingStatus } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { serviceIcon } from '@/utils/serviceIcon';
import { CouponStatus } from '@/screens/catalog/CouponsScreen/useCouponsScreen';

import { formatDuration, useServiceDetailScreen } from './useServiceDetailScreen';
import { BRAND_BLUE, HERO_ICON, ICON_LAVENDER, MUTED, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const ABOUT_LINES = 3;

const BOOKING_PILL: Partial<Record<BookingStatus, { label: string; colors: PillColors }>> = {
  PENDING: { label: 'New request', colors: PILL.lavender },
  CONFIRMED: { label: 'Confirmed', colors: PILL.blue },
  IN_PROGRESS: { label: 'In progress', colors: PILL.teal },
};

const OFFER_PILL: Record<CouponStatus, { label: string; colors: PillColors }> = {
  active: { label: 'Active', colors: PILL.green },
  off: { label: 'Off', colors: PILL.grey },
  expired: { label: 'Expired', colors: PILL.red },
  usedUp: { label: 'Used up', colors: PILL.orange },
};

type Tint = (typeof TINT)[keyof typeof TINT];

function StatTile({
  theme,
  icon,
  label,
  value,
  muted,
}: {
  theme: Tint;
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      {icon}
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.tileValue, muted && styles.tileValueMuted]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
    </View>
  );
}

function AboutCard({ text }: { text: string }) {
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Re-measure when the description changes (e.g. after an edit).
  useEffect(() => {
    setLineCount(null);
    setExpanded(false);
  }, [text]);

  // First render is unclamped so we can count the lines, then clamp to 3.
  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (lineCount === null) {
      setLineCount(e.nativeEvent.lines.length);
    }
  };
  const canExpand = lineCount !== null && lineCount > ABOUT_LINES;

  return (
    <View style={[styles.card, styles.about]}>
      <Text style={styles.cardTitle}>About this service</Text>
      <Text
        style={styles.aboutText}
        numberOfLines={lineCount === null || expanded ? undefined : ABOUT_LINES}
        onTextLayout={onTextLayout}
      >
        {text}
      </Text>
      {canExpand && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)} hitSlop={HIT_SLOP} accessibilityRole="button">
          <Text style={styles.more}>{expanded ? 'Show less' : 'Show more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SettingRow({
  icon,
  title,
  sub,
  on,
  divider,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  on: boolean;
  divider?: boolean;
}) {
  return (
    <View style={[styles.setting, divider && styles.rowDivider]}>
      {icon}
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSub}>{sub}</Text>
      </View>
      {on ? (
        <CircleCheck size={28} color={PILL.green.fg} strokeWidth={1.8} />
      ) : (
        <CircleX size={28} color={Color.placeholder} strokeWidth={1.8} />
      )}
    </View>
  );
}

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const {
    service,
    businessName,
    notFound,
    refreshing,
    refresh,
    performance,
    upcoming,
    offers,
    homeVisit,
    partialAllowed,
    partialDetail,
    deleting,
    toggleActive,
    remove,
    goBack,
    editService,
    viewAllBookings,
    openBooking,
    openOffer,
    createOffer,
  } = useServiceDetailScreen();

  const confirmDelete = () => {
    if (!service) {
      return;
    }
    Alert.alert('Delete service?', `"${service.name}" will no longer be bookable.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: remove },
    ]);
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={goBack}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        Service Details
      </Text>
      {service && (
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={editService}
            accessibilityRole="button"
            accessibilityLabel="Edit service"
          >
            <Pencil size={22} color={BRAND_BLUE} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={confirmDelete}
            disabled={deleting}
            accessibilityRole="button"
            accessibilityLabel="Delete service"
          >
            <Trash2 size={22} color={PILL.red.fg} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!service) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
        {header}
        {!notFound ? (
          <View style={styles.center}>
            <ActivityIndicator color={BRAND_BLUE} />
          </View>
        ) : (
          <View style={styles.center}>
            <SearchX size={48} color={Color.placeholder} strokeWidth={1.4} />
            <Text style={styles.notFoundTitle}>Service not found</Text>
            <Text style={styles.notFoundBody}>It may have been deleted.</Text>
            <TouchableOpacity style={styles.notFoundBtn} onPress={goBack} accessibilityRole="button">
              <Text style={styles.primaryText}>Go back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const active = service.isActive !== false;
  const Icon = serviceIcon(service.name);
  const description = service.description?.trim();
  const money = (minor: number) => formatMoney(minor, service.currency);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      {header}

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* ── Hero ── */}
        <View style={[styles.card, styles.hero]}>
          <View style={styles.heroIcon}>
            <Icon size={HERO_ICON / 2} color={ICON_LAVENDER} strokeWidth={1.6} />
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.heroTop}>
              <Text style={styles.heroName} numberOfLines={2}>
                {service.name}
              </Text>
              <Switch
                value={active}
                onValueChange={toggleActive}
                trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
                thumbColor={Color.white}
                ios_backgroundColor={SWITCH_OFF}
                style={styles.switch}
                accessibilityLabel="Service active"
              />
            </View>
            {!!businessName && (
              <Text style={styles.heroBusiness} numberOfLines={1}>
                {businessName}
              </Text>
            )}
            <View style={styles.pills}>
              <Pill
                label={active ? 'Active' : 'Inactive'}
                colors={active ? PILL.green : PILL.grey}
                icon={<View style={active ? styles.dotGreen : styles.dotGrey} />}
              />
              {service.travelRequired && (
                <Pill
                  label="Home visit"
                  colors={PILL.blue}
                  icon={<House size={14} color={PILL.blue.fg} strokeWidth={2} />}
                />
              )}
              {partialAllowed && (
                <Pill
                  label="Partial pay"
                  colors={PILL.grey}
                  icon={<CreditCard size={14} color={INK} strokeWidth={1.8} />}
                />
              )}
            </View>
          </View>
        </View>

        {/* ── Price / duration / home visit ── */}
        <View style={styles.tiles}>
          <StatTile
            theme={TINT.blue}
            icon={<Tag size={26} color={TINT.blue.icon} strokeWidth={1.8} />}
            label="Price"
            value={money(service.priceMinor)}
          />
          <StatTile
            theme={TINT.lavender}
            icon={<Clock size={26} color={TINT.lavender.icon} strokeWidth={1.8} />}
            label="Duration"
            value={formatDuration(service.durationMin)}
          />
          {homeVisit && (
            <StatTile
              theme={TINT.peach}
              icon={<House size={26} color={TINT.peach.icon} strokeWidth={1.8} />}
              label="Home visit"
              value={homeVisit.short}
            />
          )}
        </View>

        {/* ── About ── */}
        {!!description && <AboutCard text={description} />}

        {/* ── Performance ── */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Performance</Text>
            <Text style={styles.cardHint}>All time</Text>
          </View>
          <View style={styles.tiles}>
            <StatTile
              theme={TINT.blue}
              icon={<CalendarDays size={24} color={TINT.blue.icon} strokeWidth={1.8} />}
              label="Bookings"
              value={performance.count.toLocaleString('en-IN')}
            />
            <StatTile
              theme={TINT.lavender}
              icon={<Coins size={24} color={TINT.lavender.icon} strokeWidth={1.8} />}
              label="Revenue"
              value={money(performance.revenueMinor)}
            />
            <StatTile
              theme={TINT.mint}
              icon={<ChartNoAxesColumnIncreasing size={24} color={TINT.mint.icon} strokeWidth={1.8} />}
              label="Last booked"
              value={performance.lastBooked}
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.dotGreen} />
              <Text style={styles.legendText}>{`Completed ${performance.completed.toLocaleString('en-IN')}`}</Text>
            </View>
            <Text style={styles.legendSep}>•</Text>
            <View style={styles.legendItem}>
              <View style={styles.dotOrange} />
              <Text style={styles.legendText}>{`Cancelled ${performance.cancelled.toLocaleString('en-IN')}`}</Text>
            </View>
            <Text style={styles.legendSep}>•</Text>
            <View style={styles.legendItem}>
              <View style={styles.dotRed} />
              <Text style={styles.legendText}>{`No-show ${performance.noShow.toLocaleString('en-IN')}`}</Text>
            </View>
          </View>
        </View>

        {/* ── Upcoming ── */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>{`Upcoming (${upcoming.total})`}</Text>
            <TouchableOpacity
              style={styles.link}
              onPress={viewAllBookings}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>View all</Text>
              <ChevronRight size={18} color={BRAND_BLUE} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
          {upcoming.items.length === 0 ? (
            <Text style={styles.empty}>No upcoming bookings.</Text>
          ) : (
            <View>
              {upcoming.items.map((b, i) => {
                const pill = BOOKING_PILL[b.status];
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={[styles.row, i > 0 && styles.rowDivider]}
                    onPress={() => openBooking(b.id)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <View style={styles.timeBox}>
                      <Text style={styles.timeText} numberOfLines={1}>
                        {b.day}
                      </Text>
                      <Text style={styles.timeText} numberOfLines={1}>
                        {b.time}
                      </Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.customer} numberOfLines={1}>
                        {b.customer}
                      </Text>
                      <View style={styles.payRow}>
                        <CreditCard size={16} color={MUTED} strokeWidth={1.8} />
                        <Text style={styles.payText} numberOfLines={1}>
                          {b.payment}
                        </Text>
                      </View>
                    </View>
                    {pill && <Pill label={pill.label} colors={pill.colors} style={styles.rowPill} />}
                    <ChevronRight size={20} color={INK} strokeWidth={2} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Offers ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Offers on this service</Text>
          {offers.length === 0 ? (
            <View style={styles.emptyOffers}>
              <Text style={styles.empty}>No offers yet</Text>
              <TouchableOpacity style={styles.createBtn} onPress={createOffer} accessibilityRole="button">
                <Plus size={16} color={BRAND_BLUE} strokeWidth={2.4} />
                <Text style={styles.createText}>Create offer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            offers.map((o) => {
              const pill = OFFER_PILL[o.status];
              return (
                <TouchableOpacity
                  key={o.id}
                  style={styles.offer}
                  onPress={() => openOffer(o.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <View style={styles.offerIcon}>
                    <Percent size={22} color={ICON_LAVENDER} strokeWidth={2.2} />
                  </View>
                  <View style={styles.offerBody}>
                    <View style={styles.codeChip}>
                      <Text style={styles.codeText} numberOfLines={1}>
                        {o.code}
                      </Text>
                    </View>
                    <Text style={styles.offerValue}>{`•  ${o.value}  •`}</Text>
                    <Pill label={pill.label} colors={pill.colors} />
                  </View>
                  <ChevronRight size={20} color={INK} strokeWidth={2} />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── Payment settings ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment settings</Text>
          <View>
            <SettingRow
              icon={<CreditCard size={28} color={INK} strokeWidth={1.6} />}
              title="Partial payment allowed"
              sub={partialDetail}
              on={partialAllowed}
            />
            <SettingRow
              divider
              icon={<House size={28} color={INK} strokeWidth={1.6} />}
              title="Home visit"
              sub={homeVisit ? homeVisit.detail : 'Not offered.'}
              on={!!homeVisit}
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={editService} accessibilityRole="button">
          <Pencil size={22} color={Color.white} strokeWidth={2} />
          <Text style={styles.primaryText}>Edit Service</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
