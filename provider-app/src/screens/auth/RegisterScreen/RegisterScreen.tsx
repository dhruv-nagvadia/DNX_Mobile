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

import { useRegisterScreen } from './useRegisterScreen';
import { styles } from './styles';

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
  const insets = useSafeAreaInsets();
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AuthHero promise="Bring your business" accentTail="online." compact showBack onBack={goToLogin} />

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
              <Text style={styles.heading}>Create your account</Text>
              <Text style={styles.subheading}>
                Set up your DNX provider account to manage your business from your phone.
              </Text>

              {!!serverError && <AlertBanner message={serverError} />}

              <AppInput
                label="Your name"
                placeholder="e.g. Priya Sharma"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                value={form.fullName}
                onChangeText={(v) => onChange('fullName', v)}
                onBlur={() => onBlur('fullName')}
                error={errors.fullName}
                editable={!isLoading}
              />

              <AppInput
                inputRef={emailRef}
                label="Email"
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

              <AppInput
                inputRef={phoneRef}
                label="Phone"
                hint="Optional"
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={form.phone}
                onChangeText={(v) => onChange('phone', v)}
                onBlur={() => onBlur('phone')}
                error={errors.phone}
                editable={!isLoading}
              />

              <AppInput
                inputRef={passwordRef}
                label="Password"
                placeholder="At least 8 characters"
                secureTextEntry
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

              <AppButton
                style={styles.submit}
                title="Create account"
                onPress={onSubmit}
                loading={isLoading}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={goToLogin}
                  disabled={isLoading}
                  hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                  accessibilityRole="link"
                >
                  <Text style={styles.switchLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
