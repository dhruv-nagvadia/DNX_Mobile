import React, { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Lock, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react-native';

import { PasswordStrength } from '@/components/PasswordStrength';

import {
  AuthBanner,
  AuthField,
  AuthScreenShell,
  AuthSubmitButton,
  AuthSwitchRow,
  authStyles,
} from '../shared';

import { useRegisterScreen } from './useRegisterScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useRegisterScreen. */
export default function RegisterScreen() {
  const {
    form,
    errors,
    serverError,
    accountExists,
    isLoading,
    pincodeLocation,
    resolvingPincode,
    onChange,
    onBlur,
    onSubmit,
    goToLogin,
    goToTerms,
    goToPrivacy,
  } = useRegisterScreen();

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const pincodeRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const pincodeHelper = resolvingPincode
    ? 'Looking up your city…'
    : pincodeLocation.city
      ? `${pincodeLocation.city}, ${pincodeLocation.state}`
      : undefined;

  return (
    <AuthScreenShell
      subtitle="Create your free account"
      showBack
      footer={
        <AuthSwitchRow
          prompt="Already have an account?"
          linkText="Sign in"
          onPress={goToLogin}
          disabled={isLoading}
        />
      }
    >
      <Text style={authStyles.heading}>Create your account</Text>
      <Text style={authStyles.subheading}>One account for every booking and order</Text>

      {!!serverError && <AuthBanner message={serverError} />}

      {/* An existing email is not a dead end — offer the way forward. */}
      {accountExists && (
        <Pressable style={styles.existingAction} onPress={goToLogin} accessibilityRole="button">
          <Text style={styles.existingActionText}>Sign in to that account instead</Text>
        </Pressable>
      )}

      <AuthField
        label="Full name"
        icon={User}
        placeholder="e.g. Priya Sharma"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        value={form.fullName}
        onChangeText={(v) => onChange('fullName', v)}
        onBlur={() => onBlur('fullName')}
        error={errors.fullName}
        editable={!isLoading}
      />

      <AuthField
        inputRef={emailRef}
        label="Email"
        icon={Mail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
        value={form.email}
        onChangeText={(v) => onChange('email', v)}
        onBlur={() => onBlur('email')}
        error={errors.email}
        editable={!isLoading}
      />

      <AuthField
        inputRef={phoneRef}
        label="Phone"
        icon={Phone}
        prefix="+91"
        placeholder="9876543210"
        keyboardType="number-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        maxLength={10}
        returnKeyType="next"
        onSubmitEditing={() => pincodeRef.current?.focus()}
        value={form.phone}
        onChangeText={(v) => onChange('phone', v)}
        onBlur={() => onBlur('phone')}
        error={errors.phone}
        editable={!isLoading}
      />

      <AuthField
        inputRef={pincodeRef}
        label="PIN code"
        icon={MapPin}
        placeholder="380001"
        keyboardType="number-pad"
        maxLength={6}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        value={form.pincode}
        onChangeText={(v) => onChange('pincode', v)}
        onBlur={() => onBlur('pincode')}
        error={errors.pincode}
        helper={pincodeHelper}
        editable={!isLoading}
      />

      <AuthField
        inputRef={passwordRef}
        label="Password"
        icon={Lock}
        password
        placeholder="At least 8 characters"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password-new"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
        value={form.password}
        onChangeText={(v) => onChange('password', v)}
        onBlur={() => onBlur('password')}
        error={errors.password}
        editable={!isLoading}
      />
      {form.password.length > 0 && (
        <View style={styles.strength}>
          <PasswordStrength value={form.password} />
        </View>
      )}

      <AuthField
        inputRef={confirmRef}
        label="Confirm password"
        icon={ShieldCheck}
        password
        placeholder="Re-enter your password"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password-new"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        value={form.confirmPassword}
        onChangeText={(v) => onChange('confirmPassword', v)}
        onBlur={() => onBlur('confirmPassword')}
        error={errors.confirmPassword}
        editable={!isLoading}
      />

      <AuthSubmitButton label="Create account" onPress={onSubmit} loading={isLoading} />

      <Text style={authStyles.consentText}>
        By creating an account, you agree to our{' '}
        <Text style={authStyles.legalLink} onPress={goToTerms}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text style={authStyles.legalLink} onPress={goToPrivacy}>
          Privacy Policy
        </Text>
        .
      </Text>
    </AuthScreenShell>
  );
}
