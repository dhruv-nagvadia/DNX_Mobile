import React from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Briefcase,
  Camera,
  ChevronRight,
  KeyRound,
  LifeBuoy,
  LogOut,
  Pencil,
  Wallet,
} from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Color, Spacing } from '@/utils/Theme';
import { AppConfig } from '@/utils/Constants';

import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';

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

const MENU_TONES = {
  primary: { bg: Color.primarySoft, fg: Color.primary },
  accent: { bg: Color.accentSoft, fg: Color.accent2 },
  success: { bg: Color.successSoft, fg: Color.success },
};

function MenuRow({
  icon,
  label,
  value,
  onPress,
  first,
  tone = 'primary',
}: {
  icon: React.ReactElement;
  label: string;
  value?: string;
  onPress: () => void;
  first?: boolean;
  tone?: keyof typeof MENU_TONES;
}) {
  const { bg, fg } = MENU_TONES[tone];
  return (
    <TouchableOpacity style={[styles.menuItem, first && styles.menuItemFirst]} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: bg }]}>
        {React.cloneElement(icon, { size: 16, color: fg })}
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
      {!!value && <Text style={styles.menuItemValue}>{value}</Text>}
      <ChevronRight size={18} color={Color.placeholder} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const {
    currentUser,
    stats,
    unreadCount,
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
    goToBusinesses,
    goToEarnings,
    goToNotifications,
    goToSupport,
  } = useProfileScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.primary} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.lg }]}>
          <View style={[styles.heroTopRow, { top: insets.top + Spacing.sm }]}>
            <TouchableOpacity style={styles.heroIconBtn} onPress={goToNotifications} accessibilityRole="button">
              <Bell size={18} color={Color.white} />
              {unreadCount > 0 && <View style={styles.bellDot} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroIconBtn} onPress={startEdit} accessibilityRole="button">
              <Pencil size={16} color={Color.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={changeAvatar}
            disabled={uploadingAvatar}
            accessibilityRole="button"
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
                <Camera size={13} color={Color.white} />
              )}
            </View>
          </TouchableOpacity>
          {!!avatarError && <Text style={styles.avatarErrorText}>{avatarError}</Text>}
          <Text style={styles.heroName}>{currentUser?.fullName}</Text>
          <Text style={styles.heroEmail}>{currentUser?.email}</Text>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>Provider</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.statsCard}>
            <TouchableOpacity style={styles.stat} onPress={goToBusinesses}>
              <Text style={styles.statValue}>{stats.businessCount}</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.services}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.products}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.avgRating ? stats.avgRating.toFixed(1) : '—'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>BUSINESS</Text>
            <View style={styles.menu}>
              <MenuRow first icon={<Briefcase />} label="My businesses" onPress={goToBusinesses} tone="primary" />
              <MenuRow icon={<Wallet />} label="Earnings" onPress={goToEarnings} tone="success" />
            </View>
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
            <View style={styles.menu}>
              <MenuRow first icon={<Pencil />} label="Edit profile" onPress={startEdit} tone="accent" />
              <MenuRow icon={<KeyRound />} label="Change password" onPress={openPasswordModal} tone="accent" />
            </View>
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>SUPPORT</Text>
            <View style={styles.menu}>
              <MenuRow first icon={<Bell />} label="Notifications" onPress={goToNotifications} tone="primary" />
              <MenuRow icon={<LifeBuoy />} label="Help & support" onPress={goToSupport} tone="primary" />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout} accessibilityRole="button">
            <LogOut size={16} color={Color.error} />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>DNX Provider v{AppConfig.version}</Text>
        </View>
      </ScrollView>

      <Modal visible={editing} transparent animationType="fade" onRequestClose={cancelEdit}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={cancelEdit}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <AppInput label="Full name" dense value={form.fullName} onChangeText={(v) => onChange('fullName', v)} />
            <AppInput
              label="Email"
              dense
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
            />
            <View style={styles.modalActions}>
              <AppButton style={styles.modalButton} title="Cancel" variant="secondary" onPress={cancelEdit} />
              <AppButton style={styles.modalButton} title="Save" loading={saving} onPress={save} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={changingPasswordModal} transparent animationType="fade" onRequestClose={closePasswordModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closePasswordModal}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
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
              <AppButton style={styles.modalButton} title="Cancel" variant="secondary" onPress={closePasswordModal} />
              <AppButton
                style={styles.modalButton}
                title="Update"
                loading={changingPassword}
                onPress={submitPasswordChange}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
