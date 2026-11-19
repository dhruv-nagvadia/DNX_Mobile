import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  Headphones,
  Info,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  RefreshCw,
  ShieldCheck,
  // ShoppingBag, // SERVICES-ONLY: unused while orders hidden — uncomment to restore
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { NotificationBellButton } from '@/components/NotificationBellButton';
import { Color } from '@/utils/Theme';
import { AppConfig } from '@/utils/Constants';
import { INK, LINK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';

import { useProfileScreen } from './useProfileScreen';
import { EditProfileSheet, ChangePasswordSheet, DeleteAccountSheet } from './ProfileSheets';
import { PROFILE_CARD_GRADIENT, styles } from './styles';

type IconType = typeof Bell;

const CHEVRON = '#94A3B8';
// const MINT: PillColors = { bg: '#DCF5E7', fg: '#15803D' }; // SERVICES-ONLY: unused while orders hidden — uncomment to restore

interface RowProps {
  icon: IconType;
  tone: PillColors;
  title: string;
  subtitle?: string;
  onPress: () => void;
  first?: boolean;
  trailing?: React.ReactNode;
}

/** One hairline-separated list row: pastel icon tile, title, grey subtitle, chevron. */
function Row({ icon: Icon, tone, title, subtitle, onPress, first, trailing }: RowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !first && styles.rowBorder]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    >
      <View style={[styles.rowIcon, { backgroundColor: tone.bg }]}>
        <Icon size={20} color={tone.fg} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
      <ChevronRight size={20} color={CHEVRON} />
    </TouchableOpacity>
  );
}

interface StatProps {
  icon: IconType;
  tone: PillColors;
  value: number;
  label: string;
  onPress: () => void;
}

function Stat({ icon: Icon, tone, value, label, onPress }: StatProps) {
  return (
    <TouchableOpacity
      style={styles.stat}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}, open my ${label.toLowerCase()}`}
    >
      <View style={[styles.statIcon, { backgroundColor: tone.bg }]}>
        <Icon size={19} color={tone.fg} />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statValue} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.statLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/** Profile tab — mockup "DNX Profile and Edit Profile Screens.png" (left frame). */
export default function ProfileScreen() {
  const p = useProfileScreen();
  const insets = useSafeAreaInsets();
  const initial = (p.fullName || '?').charAt(0).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Profile
          </Text>
          <NotificationBellButton color={INK} style={styles.bellBtn} />
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <GradientBackground colors={PROFILE_CARD_GRADIENT} />
          <View style={styles.avatar} accessibilityLabel={`Avatar, ${initial}`}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {p.fullName || 'Your account'}
              </Text>
              <TouchableOpacity
                style={styles.editPill}
                activeOpacity={0.8}
                onPress={p.openEdit}
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
              >
                <Pencil size={14} color={LINK} />
                <Text style={styles.editPillText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
            {!!p.email && (
              <Text style={styles.contactText} numberOfLines={1}>
                {p.email}
              </Text>
            )}
            {!!p.phoneDisplay && <Text style={styles.contactText}>{p.phoneDisplay}</Text>}
            {!!p.locationLine && (
              <View style={styles.locationChip}>
                <MapPin size={13} color={INK} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {p.locationLine}
                </Text>
              </View>
            )}
            {!!p.customerSince && (
              <Text style={styles.sinceText}>Customer since {p.customerSince}</Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Stat
            icon={CalendarDays}
            tone={PILL.blue}
            value={p.stats.bookings}
            label="Bookings"
            onPress={p.goToBookings}
          />
          {/* SERVICES-ONLY: orders hidden for launch — uncomment to restore */}
          {/*
          <Stat
            icon={ShoppingBag}
            tone={MINT}
            value={p.stats.orders}
            label="Orders"
            onPress={p.goToOrders}
          />
          */}
          <Stat
            icon={Bell}
            tone={PILL.lavender}
            value={p.stats.reminders}
            label="Reminders"
            onPress={p.goToReminders}
          />
        </View>

        {/* Activity */}
        <Text style={styles.sectionLabel}>Activity</Text>
        <View style={styles.section}>
          <Row
            first
            icon={CalendarDays}
            tone={PILL.blue}
            title="My bookings"
            subtitle="Upcoming, past and cancelled"
            onPress={p.goToBookings}
          />
          {/* SERVICES-ONLY: orders hidden for launch — uncomment to restore */}
          {/*
          <Row
            icon={ShoppingBag}
            tone={MINT}
            title="My orders"
            subtitle="Track pickups and reorder"
            onPress={p.goToOrders}
          />
          */}
          <Row
            icon={Bell}
            tone={PILL.lavender}
            title="Reminders"
            subtitle="Renewals and follow-ups"
            onPress={p.goToReminders}
            trailing={
              p.remindersDueToday > 0 ? (
                <View style={styles.duePill}>
                  <Text style={styles.duePillText}>{p.remindersDueToday} due today</Text>
                </View>
              ) : undefined
            }
          />
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.section}>
          <Row
            first
            icon={MapPin}
            tone={PILL.orange}
            title="Saved addresses"
            subtitle={p.addressesSummary}
            onPress={p.goToAddresses}
          />
          <Row
            icon={Lock}
            tone={PILL.lavender}
            title="Change password"
            subtitle="Update your password"
            onPress={p.openPasswordChange}
          />
          <Row
            icon={Bell}
            tone={PILL.green}
            title="Notifications"
            // SERVICES-ONLY: was "Bookings, orders and offers" — restore when orders return
            subtitle="Bookings and offers"
            onPress={p.goToNotifications}
          />
        </View>

        {/* Support & legal */}
        <Text style={styles.sectionLabel}>Support & legal</Text>
        <View style={styles.section}>
          <Row
            first
            icon={Headphones}
            tone={PILL.blue}
            title="Help & support"
            onPress={p.goToHelpSupport}
          />
          <Row icon={FileText} tone={PILL.lavender} title="Terms of service" onPress={p.goToTerms} />
          <Row icon={ShieldCheck} tone={PILL.green} title="Privacy policy" onPress={p.goToPrivacy} />
          <Row icon={RefreshCw} tone={PILL.orange} title="Refund policy" onPress={p.goToRefund} />
          <Row icon={Info} tone={PILL.grey} title="About DNX" onPress={p.goToAbout} />
        </View>

        {/* Log out */}
        <TouchableOpacity
          style={styles.logout}
          activeOpacity={0.85}
          onPress={p.logout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <LogOut size={20} color={Color.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteAccount}
          activeOpacity={0.7}
          onPress={p.openDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
        >
          <Text style={styles.deleteAccountText}>Delete account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DNX • v{AppConfig.version}</Text>
      </ScrollView>

      <EditProfileSheet p={p} />
      <ChangePasswordSheet p={p} />
      <DeleteAccountSheet p={p} />
    </View>
  );
}
