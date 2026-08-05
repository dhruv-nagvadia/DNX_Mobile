import React, { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/AlertBanner';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AuthHero } from '@/components/AuthHero';
import { Color, Spacing } from '@/utils/Theme';

import { useLoginScreen } from './useLoginScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useLoginScreen. */
export default function LoginScreen() {
  const { form, errors, serverError, isLoading, onChange, onBlur, onSubmit, goToRegister } =
    useLoginScreen();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Fixed: the hero never scrolls. */}
        <AuthHero promise="Every service in your life," accentTail="in one app." />

        {/* The sheet owns the only scroll view on this screen. */}
        <View style={styles.sheet}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: insets.bottom + Spacing.xl },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formSection}>
              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.subheading}>
                Sign in to see your bookings, reminders and receipts.
              </Text>

              {!!serverError && <AlertBanner message={serverError} />}

              <AppInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={form.email}
                onChangeText={(v) => onChange('email', v)}
                onBlur={() => onBlur('email')}
                error={errors.email}
                editable={!isLoading}
              />

              <AppInput
                inputRef={passwordRef}
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                value={form.password}
                onChangeText={(v) => onChange('password', v)}
                onBlur={() => onBlur('password')}
                error={errors.password}
                editable={!isLoading}
              />

              <AppButton
                style={styles.submit}
                title="Sign in"
                onPress={onSubmit}
                loading={isLoading}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>New to DNX? </Text>
                <TouchableOpacity
                  onPress={goToRegister}
                  disabled={isLoading}
                  hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                  accessibilityRole="link"
                >
                  <Text style={styles.switchLink}>Create an account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
