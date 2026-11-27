import React from 'react';
import {
  RefreshControl,
  ScrollView,
  SectionList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  LucideIcon,
  PackageMinus,
  ShoppingBag,
  Star,
  Wallet,
  XCircle,
} from 'lucide-react-native';

import { INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';
import { AppNotification } from '@/redux/api/notification/types';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useNotificationsScreen } from './useNotificationsScreen';
import { NotificationCategory, NotificationSection, categoryOf, isCancelled, timeAgo } from './helpers';
import { EMPTY_TINT, ICON_COLORS, iconBoxStyles, styles } from './styles';

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const SKELETON_ROWS = [0, 1, 2, 3, 4];

const ICON: Record<NotificationCategory, LucideIcon> = {
  booking: CalendarDays,
  order: ShoppingBag,
  review: Star,
  payment: Wallet,
  stock: PackageMinus,
  cancelled: XCircle,
  generic: Bell,
};

function visualCategory(n: AppNotification): NotificationCategory {
  return isCancelled(n) ? 'cancelled' : categoryOf(n);
}

export default function NotificationsScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    hasAny,
    sections,
    filters,
    filter,
    setFilter,
    unreadCount,
    isLoading,
    refreshing,
    refresh,
    markingAll,
    markAllRead,
    onPressNotification,
    goBack,
  } = useNotificationsScreen();
  const insets = useSafeAreaInsets();

  let subtitle = '';
  if (!isLoading) {
    subtitle = unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up";
  }

  const renderItem = ({ item: n }: { item: AppNotification }) => {
    const cat = visualCategory(n);
    const Icon = ICON[cat];
    return (
      <TouchableOpacity
        style={[styles.card, !n.isRead && styles.cardUnread]}
        activeOpacity={0.8}
        onPress={() => onPressNotification(n)}
        accessibilityRole="button"
        accessibilityLabel={`${n.isRead ? '' : 'Unread. '}${n.title}`}
      >
        <View style={[styles.iconBox, iconBoxStyles[cat]]}>
          <Icon size={ModernSize.icon} color={ICON_COLORS[cat].fg} />
        </View>
        <View style={styles.main}>
          <View style={styles.topRow}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {n.title}
            </Text>
            <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>
            {n.body}
          </Text>
        </View>
        {!n.isRead && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: NotificationSection }) => (
    <Text style={styles.sectionLabel}>{section.title}</Text>
  );

  const emptyTitle = hasAny ? 'Nothing here' : 'No notifications yet';
  const emptyBody = hasAny
    ? 'No notifications match this filter.'
    : 'Updates about your bookings and orders will show up here.';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={INK} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Notifications
          </Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllRead}
            disabled={markingAll}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
          >
            <Text style={[styles.markAll, markingAll && styles.markAllDisabled]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasAny && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(f.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {isLoading ? (
        <View style={styles.listContent}>
          {SKELETON_ROWS.map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.skelCircle} />
              <View style={styles.main}>
                <View style={styles.skelLineLong} />
                <View style={styles.skelLineShort} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(n) => n.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={withBottomInset(styles.listContent)}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <Bell size={32} color={EMPTY_TINT.fg} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>{emptyTitle}</Text>
              <Text style={styles.emptyBody}>{emptyBody}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
