import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useGetUnreadCountQuery } from '@/redux/api/notification/notificationApi';
import { ROUTES } from '@/navigation/routes';
import { Color, FontWeight } from '@/utils/Theme';

// Refresh the unread badge while the app is open.
const POLL_MS = 30_000;

interface Props {
  /** Icon colour — defaults to the primary text colour (light headers). */
  color?: string;
  /** Optional container style (e.g. a header pill). */
  style?: StyleProp<ViewStyle>;
}

/** Header bell with a live unread-count badge; opens the notifications screen. */
export function NotificationBellButton({ color = Color.textPrimary, style }: Props) {
  const navigation = useNavigation<{ navigate: (r: string) => void }>();
  const { data: unread = 0 } = useGetUnreadCountQuery(undefined, { pollingInterval: POLL_MS });

  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
    >
      <Bell size={20} color={color} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 2 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Color.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: Color.white, fontSize: 10, fontWeight: FontWeight.bold },
});
