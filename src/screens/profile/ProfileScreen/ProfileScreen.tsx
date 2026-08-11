import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  CalendarDays,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Pencil,
  UserRound,
} from 'lucide-react-native';

import { Glow } from '@/components/AuthHero/Glow';
import { Color } from '@/utils/Theme';

import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';

/** Profile tab — identity, stats, quick links, edit + logout. */
export default function ProfileScreen() {
  const p = useProfileScreen();
  const insets = useSafeAreaInsets();
  const initial = (p.fullName || '?').charAt(0).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content');
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ink hero */}
        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <Glow size={340} color={Color.accent} top={-150} left={-110} opacity={0.5} />
          <Glow size={280} color={Color.accent2} top={-80} right={-100} opacity={0.45} />

          <TouchableOpacity
            style={[styles.editBtn, { top: insets.top + 8 }]}
            activeOpacity={0.8}
            onPress={p.openEdit}
          >
            <Pencil size={16} color={Color.onDark} />
          </TouchableOpacity>

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.name}>{p.fullName || 'Your account'}</Text>
            {!!p.email && <Text style={styles.email}>{p.email}</Text>}
            <View style={styles.rolePill}>
              <UserRound size={13} color={Color.onDark} />
              <Text style={styles.rolePillText}>Customer</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{p.stats.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statValue}>{p.stats.reminders}</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statValue}>{p.stats.reviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Activity */}
        <Text style={styles.sectionLabel}>Activity</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={p.goToBookings}>
            <View style={styles.rowIcon}>
              <CalendarDays size={19} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>My bookings</Text>
            <Text style={styles.rowValue}>{p.stats.bookings}</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={p.goToReminders}
          >
            <View style={styles.rowIcon}>
              <Bell size={19} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>Reminders</Text>
            <Text style={styles.rowValue}>{p.stats.reminders}</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={p.openEdit}>
            <View style={styles.rowIcon}>
              <Pencil size={18} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>Edit profile</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => {}}>
            <View style={styles.rowIcon}>
              <HelpCircle size={19} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>Help & support</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowBorder]} activeOpacity={0.8} onPress={() => {}}>
            <View style={styles.rowIcon}>
              <Info size={19} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>About DNX</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} activeOpacity={0.85} onPress={p.logout}>
          <LogOut size={18} color={Color.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DNX · v0.1.0</Text>
      </ScrollView>

      {/* Edit profile modal */}
      <Modal visible={p.editOpen} transparent animationType="fade" onRequestClose={p.closeEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit profile</Text>

            <View>
              <Text style={styles.inputLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                value={p.form.fullName}
                onChangeText={(v) => p.onField('fullName', v)}
                placeholder="Your name"
                placeholderTextColor={Color.placeholder}
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={p.form.email}
                onChangeText={(v) => p.onField('email', v)}
                placeholder="you@example.com"
                placeholderTextColor={Color.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {!!p.error && <Text style={styles.errorText}>{p.error}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                activeOpacity={0.85}
                onPress={p.closeEdit}
                disabled={p.saving}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                activeOpacity={0.85}
                onPress={p.saveEdit}
                disabled={p.saving}
              >
                {p.saving ? (
                  <ActivityIndicator color={Color.white} />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
