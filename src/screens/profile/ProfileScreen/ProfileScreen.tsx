import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, Bell, HelpCircle, Info, ChevronRight, LogOut } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';

/** Profile tab — account details, quick links, and logout. */
export default function ProfileScreen() {
  const { fullName, email, logout, goToBookings, goToReminders } = useProfileScreen();

  const initial = (fullName || '?').charAt(0).toUpperCase();

  const rows = [
    { key: 'bookings', label: 'My bookings', icon: CalendarDays, onPress: goToBookings },
    { key: 'reminders', label: 'Reminders', icon: Bell, onPress: goToReminders },
    { key: 'help', label: 'Help & support', icon: HelpCircle, onPress: () => {} },
    { key: 'about', label: 'About DNX', icon: Info, onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{fullName || 'Your account'}</Text>
            {!!email && <Text style={styles.email}>{email}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <TouchableOpacity
                key={row.key}
                style={[styles.row, i > 0 && styles.rowBorder]}
                activeOpacity={0.8}
                onPress={row.onPress}
              >
                <View style={styles.rowIcon}>
                  <Icon size={19} color={Color.primary} />
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <ChevronRight size={20} color={Color.placeholder} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logout} activeOpacity={0.85} onPress={logout}>
          <LogOut size={18} color={Color.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DNX · v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
