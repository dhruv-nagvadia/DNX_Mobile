import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AlertBanner } from '@/components/AlertBanner';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

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

const LEGAL_LINKS = [
  { route: ROUTES.PROVIDER_TERMS, label: 'Provider Terms' },
  { route: ROUTES.TERMS, label: 'Terms' },
  { route: ROUTES.PRIVACY, label: 'Privacy' },
] as const;

/**
 * Links to the in-app legal pages. With `agreement` (sign-up), a line above
 * says that creating an account means accepting them.
 */
export function AuthLegalRow({ agreement = false }: { agreement?: boolean }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View>
      {agreement && (
        <Text style={styles.legalAgree}>By creating an account, you agree to the DNX</Text>
      )}
      <View style={[styles.legalRow, agreement && styles.legalRowAgree]}>
        {LEGAL_LINKS.map((l, i) => (
          <React.Fragment key={l.route}>
            {i > 0 && <Text style={styles.legalDot}>·</Text>}
            <Pressable
              onPress={() => navigation.navigate(l.route)}
              hitSlop={LINK_HIT_SLOP}
              accessibilityRole="link"
            >
              <Text style={[styles.legalText, styles.legalLink]}>{l.label}</Text>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
