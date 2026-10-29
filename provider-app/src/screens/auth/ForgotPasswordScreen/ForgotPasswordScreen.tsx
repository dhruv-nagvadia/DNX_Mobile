import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/AlertBanner';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AuthHero } from '@/components/AuthHero';
import { Color, Spacing } from '@/utils/Theme';

import { useForgotPasswordScreen } from './useForgotPasswordScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useForgotPasswordScreen. */
export default function ForgotPasswordScreen() {
  const {
    step,
    form,
    errors,
    serverError,
    successMessage,
    isLoading,
    onChange,
    onSubmit,
    goToLogin,
  } = useForgotPasswordScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AuthHero promise="Forgot your" accentTail="password?" compact showBack onBack={goToLogin} />

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
              <Text style={styles.heading}>
                {step === 'request' ? 'Reset your password' : 'Enter the code'}
              </Text>
              <Text style={styles.subheading}>
                {step === 'request'
                  ? "We'll send a reset code to your email."
                  : 'Enter the code we emailed you, then choose a new password.'}
              </Text>

              {!!serverError && <AlertBanner message={serverError} />}
              {!!successMessage && !serverError && (
                <AlertBanner tone="success" message={successMessage} />
              )}

              <AppInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={form.email}
                onChangeText={(v) => onChange('email', v)}
                error={errors.email}
                editable={!isLoading && step === 'request'}
              />

              {step === 'reset' && (
                <>
                  <AppInput
                    label="Reset code"
                    placeholder="6-digit code"
                    keyboardType="number-pad"
                    value={form.otp}
                    onChangeText={(v) => onChange('otp', v)}
                    error={errors.otp}
                    editable={!isLoading}
                  />
                  <AppInput
                    label="New password"
                    placeholder="At least 8 characters"
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                    value={form.newPassword}
                    onChangeText={(v) => onChange('newPassword', v)}
                    error={errors.newPassword}
                    editable={!isLoading}
                  />
                </>
              )}

              <AppButton
                style={styles.submit}
                title={step === 'request' ? 'Send reset code' : 'Reset password'}
                onPress={onSubmit}
                loading={isLoading}
              />

              <View style={styles.switchRow}>
                <TouchableOpacity
                  onPress={goToLogin}
                  disabled={isLoading}
                  hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                  accessibilityRole="link"
                >
                  <Text style={styles.switchLink}>Back to sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
