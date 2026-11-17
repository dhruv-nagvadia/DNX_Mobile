import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react-native';

import { PasswordStrength } from '@/components/PasswordStrength';
import { Color } from '@/utils/Theme';

import { useProfileScreen } from './useProfileScreen';
import { sheetStyles as s } from './sheetStyles';

type ProfileState = ReturnType<typeof useProfileScreen>;

const ICON = '#64748B';
const ICON_SIZE = 18;

// ── Building blocks ─────────────────────────────────────────────────────────

interface SheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  busy: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/** Dimmed backdrop + white 24px-radius sheet with grab handle, title, × and a sticky footer. */
function BottomSheet({ visible, title, onClose, busy, children, footer }: SheetProps) {
  const insets = useSafeAreaInsets();
  const close = busy ? undefined : onClose;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.overlay}>
          <TouchableOpacity
            style={s.backdrop}
            activeOpacity={1}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
          <View style={s.sheet}>
            <View style={s.handle} />
            <View style={s.header}>
              <Text style={s.title} accessibilityRole="header">
                {title}
              </Text>
              <TouchableOpacity
                style={s.closeBtn}
                activeOpacity={0.8}
                onPress={close}
                disabled={busy}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={20} color="#0F1E4A" />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={s.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
            <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
              {footer}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
}

/** Labelled 48px input with a leading icon. */
function Field({ label, icon, ...input }: FieldProps) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputWrap}>
        {icon}
        <TextInput
          style={s.input}
          placeholderTextColor={Color.placeholder}
          accessibilityLabel={label}
          {...input}
        />
      </View>
    </View>
  );
}

interface FooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
  confirmLabel: string;
  danger?: boolean;
}

/** Outlined Cancel + solid primary (or red) action, with a spinner while busy. */
function SheetFooter({ onCancel, onConfirm, busy, confirmLabel, danger }: FooterProps) {
  return (
    <>
      <TouchableOpacity
        style={[s.btn, s.btnGhost]}
        activeOpacity={0.85}
        onPress={onCancel}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
      >
        <Text style={s.btnGhostText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          s.btn,
          s.btnPrimaryWide,
          danger ? s.btnDanger : s.btnPrimary,
          busy && s.btnDisabled,
        ]}
        activeOpacity={0.85}
        onPress={onConfirm}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={confirmLabel}
        accessibilityState={{ disabled: busy, busy }}
      >
        {busy ? (
          <ActivityIndicator color={Color.white} />
        ) : (
          <Text style={s.btnPrimaryText}>{confirmLabel}</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

// ── Sheets ──────────────────────────────────────────────────────────────────

export function EditProfileSheet({ p }: { p: ProfileState }) {
  const initial = (p.form.fullName || p.fullName || '?').charAt(0).toUpperCase();

  return (
    <BottomSheet
      visible={p.editOpen}
      title="Edit profile"
      onClose={p.closeEdit}
      busy={p.saving}
      footer={
        <SheetFooter
          onCancel={p.closeEdit}
          onConfirm={p.saveEdit}
          busy={p.saving}
          confirmLabel="Save changes"
        />
      }
    >
      <View style={s.avatar} accessibilityLabel={`Avatar, ${initial}`}>
        <Text style={s.avatarText}>{initial}</Text>
      </View>

      <Field
        label="Full name"
        icon={<UserRound size={ICON_SIZE} color={ICON} />}
        value={p.form.fullName}
        onChangeText={(v) => p.onField('fullName', v)}
        placeholder="Your name"
        autoCapitalize="words"
        textContentType="name"
      />
      <Field
        label="Email"
        icon={<Mail size={ICON_SIZE} color={ICON} />}
        value={p.form.email}
        onChangeText={(v) => p.onField('email', v)}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />

      <View style={s.field}>
        <Text style={s.label}>Phone</Text>
        <View style={s.phoneRow}>
          {/* Only Indian numbers are supported, so the code is fixed. */}
          <View style={s.prefix} accessibilityLabel="Country code plus 91">
            <Phone size={ICON_SIZE} color={ICON} />
            <Text style={s.prefixText}>+91</Text>
          </View>
          <View style={[s.inputWrap, s.phoneInputWrap]}>
            <TextInput
              style={s.input}
              value={p.form.phone}
              onChangeText={(v) => p.onField('phone', v)}
              placeholder="9876543210"
              placeholderTextColor={Color.placeholder}
              keyboardType="number-pad"
              maxLength={10}
              textContentType="telephoneNumber"
              accessibilityLabel="Phone number"
            />
          </View>
        </View>
      </View>

      <View style={s.field}>
        <Field
          label="PIN code"
          icon={<MapPin size={ICON_SIZE} color={ICON} />}
          value={p.form.pincode}
          onChangeText={(v) => p.onField('pincode', v)}
          placeholder="380001"
          keyboardType="number-pad"
          maxLength={6}
          textContentType="postalCode"
        />
        {p.resolvingPincode ? (
          <Text style={s.hint}>Looking up your city…</Text>
        ) : (
          !!p.pincodeLocation.city && (
            <View style={s.successRow}>
              <Check size={15} color={Color.success} strokeWidth={2.6} />
              <Text style={s.successText}>
                {[p.pincodeLocation.city, p.pincodeLocation.state].filter(Boolean).join(', ')}
              </Text>
            </View>
          )
        )}
      </View>

      {!!p.error && (
        <Text style={s.errorText} accessibilityLiveRegion="polite">
          {p.error}
        </Text>
      )}
    </BottomSheet>
  );
}

export function ChangePasswordSheet({ p }: { p: ProfileState }) {
  return (
    <BottomSheet
      visible={p.pwOpen}
      title="Change password"
      onClose={p.closePasswordChange}
      busy={p.changingPassword}
      footer={
        <SheetFooter
          onCancel={p.closePasswordChange}
          onConfirm={p.savePasswordChange}
          busy={p.changingPassword}
          confirmLabel="Update password"
        />
      }
    >
      <Field
        label="Current password"
        icon={<Lock size={ICON_SIZE} color={ICON} />}
        value={p.pwForm.currentPassword}
        onChangeText={(v) => p.onPwField('currentPassword', v)}
        placeholder="Current password"
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={s.field}>
        <Field
          label="New password"
          icon={<KeyRound size={ICON_SIZE} color={ICON} />}
          value={p.pwForm.newPassword}
          onChangeText={(v) => p.onPwField('newPassword', v)}
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
        />
        <PasswordStrength value={p.pwForm.newPassword} />
      </View>
      <Field
        label="Confirm new password"
        icon={<KeyRound size={ICON_SIZE} color={ICON} />}
        value={p.pwForm.confirmPassword}
        onChangeText={(v) => p.onPwField('confirmPassword', v)}
        placeholder="Re-enter new password"
        secureTextEntry
        autoCapitalize="none"
      />

      {!!p.pwError && (
        <Text style={s.errorText} accessibilityLiveRegion="polite">
          {p.pwError}
        </Text>
      )}
    </BottomSheet>
  );
}

export function DeleteAccountSheet({ p }: { p: ProfileState }) {
  return (
    <BottomSheet
      visible={p.deleteOpen}
      title="Delete account?"
      onClose={p.closeDelete}
      busy={p.deleting}
      footer={
        <SheetFooter
          onCancel={p.closeDelete}
          onConfirm={p.confirmDelete}
          busy={p.deleting}
          confirmLabel="Delete account"
          danger
        />
      }
    >
      <View style={s.warningBox}>
        <TriangleAlert size={18} color="#DC2626" style={s.warningIcon} />
        <Text style={s.warningText}>
          This can't be undone. Your profile details will be removed and you'll be signed out —
          enter your password to confirm.
        </Text>
      </View>

      <Field
        label="Password"
        icon={<Lock size={ICON_SIZE} color={ICON} />}
        value={p.deleteForm.password}
        onChangeText={p.onDeleteField}
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
      />

      {!!p.deleteError && (
        <Text style={s.errorText} accessibilityLiveRegion="polite">
          {p.deleteError}
        </Text>
      )}
    </BottomSheet>
  );
}
