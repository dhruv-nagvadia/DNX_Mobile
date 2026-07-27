import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Color } from '@/utils/Theme';

import { useLoginScreen } from './useLoginScreen';
import { styles } from './styles';

/** JSX only — all logic comes from useLoginScreen. */
export default function LoginScreen() {
  const { form, errors, isLoading, onChange, onSubmit } = useLoginScreen();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <AppText variant="title">Welcome back</AppText>
        <AppText variant="caption">Sign in to continue</AppText>
      </View>

      <View style={styles.field}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor={Color.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => onChange('email', v)}
        />
        {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.field}>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor={Color.textSecondary}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => onChange('password', v)}
        />
        {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
