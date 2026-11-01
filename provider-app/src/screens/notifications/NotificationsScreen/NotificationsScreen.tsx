import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Bell, CalendarClock, Package, XCircle } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';
import { AppNotification, NotificationType } from '@/redux/api/notification/types';

import { useNotificationsScreen } from './useNotificationsScreen';
import { styles } from './styles';

function iconFor(type: NotificationType) {
  if (type.endsWith('CANCELLED')) return <XCircle size={18} color={Color.error} />;
  if (type.startsWith('BOOKING')) return <CalendarClock size={18} color={Color.primary} />;
  return <Package size={18} color={Color.primary} />;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, refreshing, refresh, markingAll, markAllRead, onPressNotification } =
    useNotificationsScreen();

  const renderRow = (n: AppNotification) => (
    <TouchableOpacity
      key={n.id}
      style={[styles.row, !n.isRead && styles.rowUnread]}
      onPress={() => onPressNotification(n)}
    >
      <View style={styles.iconWrap}>{iconFor(n.type)}</View>
      <View style={styles.main}>
        <View style={styles.topRow}>
          <Text style={styles.rowTitle}>{n.title}</Text>
          {!n.isRead && <View style={styles.dot} />}
        </View>
        <Text style={styles.body}>{n.body}</Text>
        <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <AppHeader
        title="Notifications"
        right={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead} disabled={markingAll}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {notifications.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Bell size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="You're all caught up"
          />
        ) : (
          notifications.map(renderRow)
        )}
      </ScrollView>
    </View>
  );
}
