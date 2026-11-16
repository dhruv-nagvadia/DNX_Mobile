import React, { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ArrowLeft, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react-native';

import { LINK } from '@/utils/modernTheme';

import {
  AuthBanner,
  AuthField,
  AuthScreenShell,
  AuthSubmitButton,
  LINK_HIT_SLOP,
  authStyles,
} from '../shared';

import { useForgotPasswordScreen } from './useForgotPasswordScreen';

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
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const isEmailStep = step === 'email';

  return (
    <AuthScreenShell
      subtitle="Reset your password"
      showBack
      // On the code step the arrow returns to the email step, not out of the flow.
      onBack={isEmailStep ? undefined : backToEmail}
      footer={
        <View style={authStyles.switchRow}>
          <Pressable
            style={authStyles.backLink}
            onPress={isEmailStep ? goToLogin : backToEmail}
            disabled={isLoading}
            hitSlop={LINK_HIT_SLOP}
            accessibilityRole="link"
          >
            <ArrowLeft size={18} color={LINK} strokeWidth={2.4} />
            <Text style={authStyles.switchLink}>
              {isEmailStep ? 'Back to sign in' : 'Use a different email'}
            </Text>
          </Pressable>
        </View>
      }
    >
      {isEmailStep ? (
        <>
          <Text style={authStyles.heading}>Forgot password?</Text>
          <Text style={authStyles.subheading}>
            Enter your email and we'll send you a 6-digit code.
          </Text>

          {!!serverError && <AuthBanner message={serverError} />}

          <AuthField
            label="Email"
            icon={Mail}
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

          <AuthSubmitButton label="Send code" onPress={sendCode} loading={isLoading} />
        </>
      ) : (
        <>
          <Text style={authStyles.heading}>Enter your code</Text>
          <Text style={authStyles.subheading}>
            We sent a code to{' '}
            <Text style={authStyles.subheadingStrong}>{emailForm.email.trim()}</Text>
          </Text>

          {!!serverError && <AuthBanner message={serverError} />}
          {!!notice && !serverError && <AuthBanner tone="success" message={notice} />}

          <AuthField
            label="Reset code"
            icon={KeyRound}
            placeholder="6-digit code"
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            value={resetForm.otp}
            onChangeText={(v) => onResetChange('otp', v.replace(/\D/g, ''))}
            error={resetErrors.otp}
            editable={!isLoading}
          />

          <AuthField
            inputRef={passwordRef}
            label="New password"
            icon={Lock}
            password
            placeholder="At least 8 characters"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            value={resetForm.newPassword}
            onChangeText={(v) => onResetChange('newPassword', v)}
            error={resetErrors.newPassword}
            editable={!isLoading}
          />

          <AuthField
            inputRef={confirmRef}
            label="Confirm new password"
            icon={ShieldCheck}
            password
            placeholder="Re-enter your new password"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={submitReset}
            value={resetForm.confirmPassword}
            onChangeText={(v) => onResetChange('confirmPassword', v)}
            error={resetErrors.confirmPassword}
            editable={!isLoading}
          />

          <AuthSubmitButton label="Reset password" onPress={submitReset} loading={isLoading} />
        </>
      )}
    </AuthScreenShell>
  );
}
