import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, CalendarClock, Package, XCircle } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { NotificationType } from '@/redux/api/notification/types';

import { useNotifications } from './useNotifications';
import { styles } from './styles';

function iconFor(type: NotificationType, color: string) {
  if (type === 'ORDER_CANCELLED' || type === 'BOOKING_CANCELLED') {
    return <XCircle size={20} color={color} />;
  }
  if (type === 'BOOKING_PLACED' || type === 'BOOKING_STATUS') {
    return <CalendarClock size={20} color={color} />;
  }
  return <Package size={20} color={color} />;
}

/** Short relative time ("Just now", "5m ago", "3h ago", "2d ago"). */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** Customer's in-app notifications: order & booking updates. */
export default function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, onPress, onMarkAll } = useNotifications();

  return (
    <View style={styles.container}>
      <AppHeader
        title="Notifications"
        right={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={onMarkAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.markAll}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Bell size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            Updates about your orders and bookings will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {notifications.map((n) => {
            const danger = n.type.endsWith('CANCELLED');
            const iconColor = danger ? Color.error : Color.primary;
            return (
              <TouchableOpacity
                key={n.id}
                style={[styles.card, !n.isRead && styles.cardUnread]}
                activeOpacity={0.8}
                onPress={() => onPress(n)}
              >
                <View style={[styles.icon, danger && styles.iconDanger]}>
                  {iconFor(n.type, iconColor)}
                </View>
                <View style={styles.body}>
                  <Text style={styles.title}>{n.title}</Text>
                  <Text style={styles.text}>{n.body}</Text>
                  <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
                </View>
                {!n.isRead && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
