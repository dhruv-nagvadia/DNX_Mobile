import React, { useRef } from 'react';
import { Text, TextInput } from 'react-native';
import { Lock, Mail, Phone, User } from 'lucide-react-native';

import {
  AuthBanner,
  AuthField,
  AuthLegalRow,
  AuthScreenShell,
  AuthSubmitButton,
  AuthSwitchRow,
  authStyles,
} from '../shared';

import { useRegisterScreen } from './useRegisterScreen';

/** JSX only — all logic comes from useRegisterScreen. */
export default function RegisterScreen() {
  const {
    form,
    errors,
    serverError,
    isLoading,
    onChange,
    onBlur,
    onSubmit,
    goToLogin,
  } = useRegisterScreen();
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  return (
    <AuthScreenShell
      subtitle="Create your business account"
      footer={
        <>
          <AuthSwitchRow
            prompt="Already have an account?"
            linkText="Sign in"
            onPress={goToLogin}
            disabled={isLoading}
          />
          <AuthLegalRow agreement />
        </>
      }
    >
      <Text style={authStyles.heading}>Create your account</Text>
      <Text style={authStyles.subheading}>Start managing your business on DNX</Text>

      {!!serverError && <AuthBanner message={serverError} />}

      <AuthField
        label="Your name"
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
        placeholder="you@business.com"
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
        hint="Optional"
        icon={Phone}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        value={form.phone}
        onChangeText={(v) => onChange('phone', v)}
        onBlur={() => onBlur('phone')}
        error={errors.phone}
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
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        value={form.password}
        onChangeText={(v) => onChange('password', v)}
        onBlur={() => onBlur('password')}
        error={errors.password}
        editable={!isLoading}
      />

      <AuthSubmitButton label="Create account" onPress={onSubmit} loading={isLoading} />
    </AuthScreenShell>
  );
}
