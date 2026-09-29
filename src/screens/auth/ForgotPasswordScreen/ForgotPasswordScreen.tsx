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

import { useForgotPasswordScreen } from './useForgotPasswordScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useForgotPasswordScreen. */
export default function ForgotPasswordScreen() {
  const {
    step,
    emailForm,
    emailErrors,
    resetForm,
    resetErrors,
    serverError,
    notice,
    isLoading,
    onEmailChange,
    onResetChange,
    sendCode,
    submitReset,
    backToEmail,
    goToLogin,
  } = useForgotPasswordScreen();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AuthHero promise="Forgot your password?" accentTail="Let's get you back in." compact />

        <View style={styles.sheet}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + Spacing.xl }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'email' ? (
              <View style={styles.formSection}>
                <Text style={styles.heading}>Reset password</Text>
                <Text style={styles.subheading}>
                  Enter the email on your account and we'll send you a 6-digit code.
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
                  returnKeyType="send"
                  onSubmitEditing={sendCode}
                  value={emailForm.email}
                  onChangeText={onEmailChange}
                  error={emailErrors.email}
                  editable={!isLoading}
                />

                <AppButton style={styles.submit} title="Send code" onPress={sendCode} loading={isLoading} />

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
            ) : (
              <View style={styles.formSection}>
                <Text style={styles.heading}>Enter your code</Text>
                <Text style={styles.subheading}>
                  We sent a 6-digit code to {emailForm.email}. Enter it below with your new password.
                </Text>

                {!!notice && <AlertBanner tone="success" message={notice} />}
                {!!serverError && <AlertBanner message={serverError} />}

                <AppInput
                  label="6-digit code"
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  value={resetForm.otp}
                  onChangeText={(v) => onResetChange('otp', v.replace(/\D/g, ''))}
                  error={resetErrors.otp}
                  editable={!isLoading}
                />

                <AppInput
                  inputRef={passwordRef}
                  label="New password"
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  value={resetForm.newPassword}
                  onChangeText={(v) => onResetChange('newPassword', v)}
                  error={resetErrors.newPassword}
                  editable={!isLoading}
                />

                <AppInput
                  inputRef={confirmRef}
                  label="Confirm new password"
                  placeholder="Re-enter your new password"
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={submitReset}
                  value={resetForm.confirmPassword}
                  onChangeText={(v) => onResetChange('confirmPassword', v)}
                  error={resetErrors.confirmPassword}
                  editable={!isLoading}
                />

                <AppButton
                  style={styles.submit}
                  title="Reset password"
                  onPress={submitReset}
                  loading={isLoading}
                />

                <View style={styles.switchRow}>
                  <TouchableOpacity
                    onPress={backToEmail}
                    disabled={isLoading}
                    hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                    accessibilityRole="link"
                  >
                    <Text style={styles.switchLink}>Use a different email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
