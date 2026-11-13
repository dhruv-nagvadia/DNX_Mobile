import React, { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ArrowLeft, KeyRound, Lock, Mail } from 'lucide-react-native';

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
    form,
    errors,
    serverError,
    successMessage,
    isLoading,
    onChange,
    onSubmit,
    goToLogin,
  } = useForgotPasswordScreen();
  const passwordRef = useRef<TextInput>(null);

  return (
    <AuthScreenShell
      subtitle="Reset your password"
      footer={
        <View style={authStyles.switchRow}>
          <Pressable
            style={authStyles.backLink}
            onPress={goToLogin}
            disabled={isLoading}
            hitSlop={LINK_HIT_SLOP}
            accessibilityRole="link"
            accessibilityLabel="Back to sign in"
          >
            <ArrowLeft size={18} color={LINK} strokeWidth={2.4} />
            <Text style={authStyles.switchLink}>Back to sign in</Text>
          </Pressable>
        </View>
      }
    >
      {step === 'request' ? (
        <>
          <Text style={authStyles.heading}>Forgot password?</Text>
          <Text style={authStyles.subheading}>
            Enter your email and we'll send you a 6-digit code.
          </Text>

          {!!serverError && <AuthBanner message={serverError} />}

          <AuthField
            label="Email"
            icon={Mail}
            placeholder="you@business.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            value={form.email}
            onChangeText={(v) => onChange('email', v)}
            error={errors.email}
            editable={!isLoading}
          />

          <AuthSubmitButton label="Send code" onPress={onSubmit} loading={isLoading} />
        </>
      ) : (
        <>
          <Text style={authStyles.heading}>Enter your code</Text>
          <Text style={authStyles.subheading}>
            We sent a code to{' '}
            <Text style={authStyles.subheadingStrong}>{form.email.trim()}</Text>
          </Text>

          {!!serverError && <AuthBanner message={serverError} />}
          {!!successMessage && !serverError && (
            <AuthBanner tone="success" message={successMessage} />
          )}

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
            value={form.otp}
            onChangeText={(v) => onChange('otp', v)}
            error={errors.otp}
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
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            value={form.newPassword}
            onChangeText={(v) => onChange('newPassword', v)}
            error={errors.newPassword}
            editable={!isLoading}
          />

          <AuthSubmitButton label="Reset password" onPress={onSubmit} loading={isLoading} />
        </>
      )}
    </AuthScreenShell>
  );
}
