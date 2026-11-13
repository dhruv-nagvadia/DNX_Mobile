import React, { useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Check, Lock, Mail } from 'lucide-react-native';

import {
  AuthBanner,
  AuthField,
  AuthLegalRow,
  AuthScreenShell,
  AuthSubmitButton,
  AuthSwitchRow,
  LINK_HIT_SLOP,
  authStyles,
} from '../shared';

import { useLoginScreen } from './useLoginScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useLoginScreen. */
export default function LoginScreen() {
  const {
    form,
    errors,
    serverError,
    isLoading,
    keepSignedIn,
    toggleKeepSignedIn,
    onChange,
    onBlur,
    onSubmit,
    goToRegister,
    goToForgotPassword,
  } = useLoginScreen();
  const passwordRef = useRef<TextInput>(null);

  return (
    <AuthScreenShell
      subtitle="Manage your business on the go"
      footer={
        <>
          <AuthSwitchRow
            prompt="New provider?"
            linkText="Create an account"
            onPress={goToRegister}
            disabled={isLoading}
          />
          <AuthLegalRow />
        </>
      }
    >
      <Text style={authStyles.heading}>Welcome back</Text>
      <Text style={authStyles.subheading}>Sign in to continue</Text>

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
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        value={form.email}
        onChangeText={(v) => onChange('email', v)}
        onBlur={() => onBlur('email')}
        error={errors.email}
        editable={!isLoading}
      />

      <AuthField
        inputRef={passwordRef}
        label="Password"
        icon={Lock}
        password
        placeholder="Enter your password"
        autoCapitalize="none"
        autoCorrect={false}
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

      <View style={styles.optionsRow}>
        <Pressable
          style={styles.keepRow}
          onPress={toggleKeepSignedIn}
          disabled={isLoading}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: keepSignedIn, disabled: isLoading }}
        >
          <View style={[styles.checkbox, keepSignedIn && styles.checkboxOn]}>
            {keepSignedIn && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.keepText}>Keep me signed in</Text>
        </Pressable>

        <Pressable
          onPress={goToForgotPassword}
          disabled={isLoading}
          hitSlop={LINK_HIT_SLOP}
          accessibilityRole="link"
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>

      <AuthSubmitButton label="Sign in" onPress={onSubmit} loading={isLoading} />
    </AuthScreenShell>
  );
}
