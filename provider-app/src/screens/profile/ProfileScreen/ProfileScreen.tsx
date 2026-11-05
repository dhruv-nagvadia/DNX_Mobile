import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  CircleHelp,
  Coins,
  Command,
  Lock,
  LogOut,
  Package,
  Pencil,
  Star,
  Store,
  Tag,
  User,
  Users,
} from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { AppConfig } from '@/utils/Constants';
import { INK, PILL, TINT } from '@/utils/modernTheme';

import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';

/** Navy → royal-blue hero card, as in "DNX Provider Profile Dashboard.png". */
const PROFILE_HERO_GRADIENT = ['#0A1A4F', '#0F2E7A', '#1A44B0'];
/** Translucent white pill on the navy hero ("Since Aug 2026"). */
const HERO_GLASS_PILL = { bg: 'rgba(255, 255, 255, 0.18)', fg: Color.white };

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'DN'
  );
}

/** Round icon-box colours for menu rows. */
const MENU_TONES = {
  blue: { bg: '#E3ECFD', fg: '#1D4ED8' },
  green: { bg: '#DDF5E6', fg: '#15803D' },
  orange: { bg: '#FDEBD8', fg: '#EA580C' },
  lavender: { bg: '#EDE9FE', fg: '#6D28D9' },
  red: { bg: '#FDE2E2', fg: Color.error },
};

function StatTile({
  tint,
  icon,
  label,
  value,
  star,
  onPress,
}: {
  tint: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactElement;
  label: string;
  value: string;
  star?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tile, { borderColor: tint.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <GradientBackground colors={tint.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>
        {React.cloneElement(icon, { size: 24, color: tint.icon })}
      </View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.tileValueRow}>
          {star && <Star size={18} color="#F5B301" fill="#F5B301" />}
          <Text style={styles.tileValue}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  first,
  tone,
  trailing,
  danger,
}: {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
  first?: boolean;
  tone: keyof typeof MENU_TONES;
  trailing?: React.ReactNode;
  danger?: boolean;
}) {
  const { bg, fg } = MENU_TONES[tone];
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} accessibilityRole="button">
      <View style={[styles.menuIcon, { backgroundColor: bg }]}>
        {React.cloneElement(icon, { size: 18, color: fg })}
      </View>
      <View style={[styles.menuBody, !first && styles.menuBodyDivided]}>
        <Text style={[styles.menuItemText, danger && styles.menuItemTextDanger]} numberOfLines={1}>
          {label}
        </Text>
        {trailing}
        <ChevronRight size={20} color={INK} />
      </View>
    </TouchableOpacity>
  );
}

function MenuCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const {
    currentUser,
    stats,
    memberSince,
    unreadCount,
    reviewsNeedingReply,
    editing,
    form,
    onChange,
    error,
    saving,
    startEdit,
    cancelEdit,
    save,
    changeAvatar,
    uploadingAvatar,
    avatarError,
    changingPasswordModal,
    passwordForm,
    passwordError,
    changingPassword,
    openPasswordModal,
    closePasswordModal,
    onPasswordChange,
    submitPasswordChange,
    logout,
    deleteModal,
    deletePassword,
    deleteError,
    deletingAccount,
    openDeleteModal,
    closeDeleteModal,
    onDeletePasswordChange,
    submitDeleteAccount,
    goToBusinesses,
    goToEarnings,
    goToOffers,
    goToReviews,
    goToNotifications,
    goToSupport,
  } = useProfileScreen();
  const insets = useSafeAreaInsets();

  const contactLine = [currentUser?.email, currentUser?.phone].filter(Boolean).join('  •  ');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Hero card */}
        <View style={styles.hero}>
          <GradientBackground
            colors={PROFILE_HERO_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <TouchableOpacity style={styles.editBtn} onPress={startEdit} accessibilityRole="button">
            <Pencil size={14} color={Color.white} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={changeAvatar}
            disabled={uploadingAvatar}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            {currentUser?.avatarUrl ? (
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initialsOf(currentUser?.fullName ?? 'DNX')}</Text>
              </View>
            )}
            <View style={styles.avatarCameraBadge}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={Color.white} />
              ) : (
                <Camera size={12} color={Color.white} />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName} numberOfLines={1}>
              {currentUser?.fullName}
            </Text>
            {!!contactLine && (
              <Text style={styles.heroContact} numberOfLines={2}>
                {contactLine}
              </Text>
            )}
            <View style={styles.heroPills}>
              <Pill
                label="Provider"
                colors={PILL.lavender}
                icon={<Users size={13} color={PILL.lavender.fg} />}
              />
              {!!memberSince && (
                <Pill
                  label={`Since ${memberSince}`}
                  colors={HERO_GLASS_PILL}
                  icon={<Calendar size={13} color={Color.white} />}
                />
              )}
            </View>
            {!!avatarError && <Text style={styles.avatarErrorText}>{avatarError}</Text>}
          </View>
        </View>

        {/* 2×2 stat tiles */}
        <View style={styles.tiles}>
          <StatTile
            tint={TINT.blue}
            icon={<Store />}
            label="Businesses"
            value={String(stats.businessCount)}
            onPress={goToBusinesses}
          />
          <StatTile
            tint={TINT.lavender}
            icon={<Command />}
            label="Services"
            value={String(stats.services)}
          />
          <StatTile
            tint={TINT.peach}
            icon={<Package />}
            label="Products"
            value={String(stats.products)}
          />
          <StatTile
            tint={TINT.mint}
            icon={<Star />}
            label="Avg rating"
            value={stats.avgRating ? stats.avgRating.toFixed(1) : '—'}
            star={!!stats.avgRating}
            onPress={goToReviews}
          />
        </View>

        <MenuCard title="Business">
          <MenuRow
            first
            icon={<Store />}
            label="My businesses"
            tone="blue"
            onPress={goToBusinesses}
            trailing={
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{stats.businessCount}</Text>
              </View>
            }
          />
          <MenuRow
            icon={<Coins />}
            label="Earnings & payouts"
            tone="green"
            onPress={goToEarnings}
          />
          <MenuRow icon={<Tag />} label="Offers" tone="orange" onPress={goToOffers} />
          <MenuRow
            icon={<Star />}
            label="Reviews"
            tone="lavender"
            onPress={goToReviews}
            trailing={
              reviewsNeedingReply > 0 ? (
                <Pill
                  label={`${reviewsNeedingReply} need reply`}
                  colors={PILL.orange}
                  style={styles.trailingPill}
                />
              ) : undefined
            }
          />
        </MenuCard>

        <MenuCard title="Account">
          <MenuRow first icon={<User />} label="Edit profile" tone="blue" onPress={startEdit} />
          <MenuRow
            icon={<Lock />}
            label="Change password"
            tone="lavender"
            onPress={openPasswordModal}
          />
          <MenuRow
            icon={<Bell />}
            label="Notifications"
            tone="green"
            onPress={goToNotifications}
            trailing={
              unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              ) : undefined
            }
          />
        </MenuCard>

        <MenuCard title="Help">
          <MenuRow
            first
            icon={<CircleHelp />}
            label="Help & support"
            tone="blue"
            onPress={goToSupport}
          />
        </MenuCard>

        <View style={styles.logoutCard}>
          <MenuRow first danger icon={<LogOut />} label="Log out" tone="red" onPress={logout} />
        </View>

        <TouchableOpacity
          style={styles.deleteLink}
          onPress={openDeleteModal}
          accessibilityRole="button"
        >
          <Text style={styles.deleteLinkText}>Delete account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DNX Provider • v{AppConfig.version}</Text>
      </ScrollView>

      {/* Edit profile */}
      <Modal visible={editing} transparent animationType="fade" onRequestClose={cancelEdit}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={cancelEdit}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit profile</Text>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <AppInput
              label="Full name"
              dense
              value={form.fullName}
              onChangeText={(v) => onChange('fullName', v)}
            />
            <AppInput
              label="Email"
              dense
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
            />
            <AppInput
              label="Phone"
              dense
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => onChange('phone', v)}
            />
            <View style={styles.modalActions}>
              <AppButton
                style={styles.modalButton}
                title="Cancel"
                variant="secondary"
                onPress={cancelEdit}
              />
              <AppButton
                style={[styles.modalButton, styles.primaryButton]}
                title="Save"
                loading={saving}
                onPress={save}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Change password */}
      <Modal
        visible={changingPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closePasswordModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Change password</Text>
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            <AppInput
              label="Current password"
              dense
              secureTextEntry
              value={passwordForm.currentPassword}
              onChangeText={(v) => onPasswordChange('currentPassword', v)}
            />
            <AppInput
              label="New password"
              dense
              secureTextEntry
              value={passwordForm.newPassword}
              onChangeText={(v) => onPasswordChange('newPassword', v)}
            />
            <AppInput
              label="Confirm new password"
              dense
              secureTextEntry
              value={passwordForm.confirmPassword}
              onChangeText={(v) => onPasswordChange('confirmPassword', v)}
            />
            <View style={styles.modalActions}>
              <AppButton
                style={styles.modalButton}
                title="Cancel"
                variant="secondary"
                onPress={closePasswordModal}
              />
              <AppButton
                style={[styles.modalButton, styles.primaryButton]}
                title="Update"
                loading={changingPassword}
                onPress={submitPasswordChange}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Delete account */}
      <Modal
        visible={deleteModal}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeDeleteModal}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Delete account</Text>
            <Text style={styles.modalBody}>
              This deactivates your provider account. You'll be signed out and won't be able to sign
              in or manage your businesses again. Enter your password to confirm.
            </Text>
            <AppInput
              label="Password"
              dense
              secureTextEntry
              value={deletePassword}
              onChangeText={onDeletePasswordChange}
              error={deleteError ?? undefined}
            />
            <View style={styles.modalActions}>
              <AppButton
                style={styles.modalButton}
                title="Cancel"
                variant="secondary"
                onPress={closeDeleteModal}
              />
              <AppButton
                style={[styles.modalButton, styles.dangerButton]}
                title="Delete account"
                loading={deletingAccount}
                onPress={submitDeleteAccount}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
