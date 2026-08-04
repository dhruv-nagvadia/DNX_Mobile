import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';

import { useRegisterScreen } from './useRegisterScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useRegisterScreen. */
export default function RegisterScreen() {
  const { form, errors, serverError, isLoading, onChange, onSubmit, goToLogin } =
    useRegisterScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>DNX</Text>
            </View>
          </View>

          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subheading}>Sign up to start booking services</Text>

          <AppInput
            label="Full name"
            placeholder="Your name"
            autoCapitalize="words"
            autoComplete="name"
            value={form.fullName}
            onChangeText={(v) => onChange('fullName', v)}
            error={errors.fullName}
          />

          <AppInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={form.email}
            onChangeText={(v) => onChange('email', v)}
            error={errors.email}
          />

          <AppInput
            label="Phone"
            placeholder="9876543210"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={form.phone}
            onChangeText={(v) => onChange('phone', v)}
            error={errors.phone}
          />

          <AppInput
            label="Password"
            placeholder="Min. 8 characters"
            secureTextEntry
            autoComplete="password-new"
            value={form.password}
            onChangeText={(v) => onChange('password', v)}
            error={errors.password}
          />

          <AppInput
            label="Confirm password"
            placeholder="Re-enter password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => onChange('confirmPassword', v)}
            error={errors.confirmPassword}
          />

          {!!serverError && <Text style={styles.serverError}>{serverError}</Text>}

          <AppButton
            style={styles.submit}
            title="Create account"
            onPress={onSubmit}
            loading={isLoading}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.switchLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
