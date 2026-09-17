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
  ScrollText,
  UserRound,
  KeyRound,
} from 'lucide-react-native';

import { Glow } from '@/components/AuthHero/Glow';
import { GradientBackground } from '@/components/GradientBackground';
import { PasswordStrength } from '@/components/PasswordStrength';
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
          <GradientBackground />
          <Glow size={340} color={Color.heroBlue1} top={-150} left={-110} opacity={0.5} />
          <Glow size={290} color={Color.heroBlue2} top={-80} right={-100} opacity={0.44} />

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
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={p.openPasswordChange}
          >
            <View style={styles.rowIcon}>
              <KeyRound size={18} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>Change password</Text>
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
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={p.goToDebugLogs}
          >
            <View style={styles.rowIcon}>
              <ScrollText size={19} color={Color.primary} />
            </View>
            <Text style={styles.rowLabel}>Debug logs</Text>
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
            <View>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={p.form.phone}
                onChangeText={(v) => p.onField('phone', v)}
                placeholder="9876543210"
                placeholderTextColor={Color.placeholder}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>PIN code</Text>
              <TextInput
                style={styles.input}
                value={p.form.pincode}
                onChangeText={(v) => p.onField('pincode', v)}
                placeholder="380001"
                placeholderTextColor={Color.placeholder}
                keyboardType="number-pad"
                maxLength={6}
              />
              {p.resolvingPincode ? (
                <Text style={styles.inputHint}>Looking up your city…</Text>
              ) : (
                !!p.pincodeLocation.city && (
                  <Text style={styles.inputHint}>
                    {p.pincodeLocation.city}, {p.pincodeLocation.state}
                  </Text>
                )
              )}
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

      {/* Change password modal */}
      <Modal visible={p.pwOpen} transparent animationType="fade" onRequestClose={p.closePasswordChange}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change password</Text>

            <View>
              <Text style={styles.inputLabel}>Current password</Text>
              <TextInput
                style={styles.input}
                value={p.pwForm.currentPassword}
                onChangeText={(v) => p.onPwField('currentPassword', v)}
                placeholder="Current password"
                placeholderTextColor={Color.placeholder}
                secureTextEntry
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>New password</Text>
              <TextInput
                style={styles.input}
                value={p.pwForm.newPassword}
                onChangeText={(v) => p.onPwField('newPassword', v)}
                placeholder="At least 8 characters"
                placeholderTextColor={Color.placeholder}
                secureTextEntry
              />
              <PasswordStrength value={p.pwForm.newPassword} />
            </View>
            <View>
              <Text style={styles.inputLabel}>Confirm new password</Text>
              <TextInput
                style={styles.input}
                value={p.pwForm.confirmPassword}
                onChangeText={(v) => p.onPwField('confirmPassword', v)}
                placeholder="Re-enter new password"
                placeholderTextColor={Color.placeholder}
                secureTextEntry
              />
            </View>

            {!!p.pwError && <Text style={styles.errorText}>{p.pwError}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                activeOpacity={0.85}
                onPress={p.closePasswordChange}
                disabled={p.changingPassword}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                activeOpacity={0.85}
                onPress={p.savePasswordChange}
                disabled={p.changingPassword}
              >
                {p.changingPassword ? (
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
