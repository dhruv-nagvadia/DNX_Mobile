import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { AlertBanner } from '@/components/AlertBanner';

import { authStyles as styles } from './styles';

export const LINK_HIT_SLOP = { top: 10, bottom: 10, left: 8, right: 8 };

interface AuthSubmitButtonProps {
  label: string;
  onPress: () => void;
  loading: boolean;
}

/** Full-width blue submit button with a spinner while loading. */
export function AuthSubmitButton({ label, onPress, loading }: AuthSubmitButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [
        styles.submit,
        pressed && styles.submitPressed,
        loading && styles.submitLoading,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.submitText}>{label}</Text>
      )}
    </Pressable>
  );
}

interface AuthBannerProps {
  message: string;
  tone?: 'error' | 'success';
}

/** AlertBanner spaced for the auth card. */
export function AuthBanner({ message, tone }: AuthBannerProps) {
  return (
    <View style={styles.banner}>
      <AlertBanner message={message} tone={tone} />
    </View>
  );
}

interface AuthSwitchRowProps {
  prompt: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

/** "New provider? Create an account" style row under the card. */
export function AuthSwitchRow({ prompt, linkText, onPress, disabled }: AuthSwitchRowProps) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{prompt} </Text>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={LINK_HIT_SLOP}
        accessibilityRole="link"
      >
        <Text style={styles.switchLink}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

interface AuthLegalRowProps {
  onTerms: () => void;
  onPrivacy: () => void;
}

/** Tappable Terms · Privacy links under the card. */
export function AuthLegalRow({ onTerms, onPrivacy }: AuthLegalRowProps) {
  return (
    <View style={styles.legalRow}>
      <Pressable onPress={onTerms} hitSlop={LINK_HIT_SLOP} accessibilityRole="link">
        <Text style={styles.legalText}>Terms</Text>
      </Pressable>
      <Text style={styles.legalDot}>·</Text>
      <Pressable onPress={onPrivacy} hitSlop={LINK_HIT_SLOP} accessibilityRole="link">
        <Text style={styles.legalText}>Privacy</Text>
      </Pressable>
    </View>
  );
}
