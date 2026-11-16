import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from './BrandMark';
import { HeroBackground } from './HeroBackground';
import { HERO_NAVY, LOGO_MARK, authStyles as styles } from './styles';

interface AuthScreenShellProps {
  /** Line under "DNX Provider" in the hero. */
  subtitle: string;
  /** Card contents (heading, fields, submit). */
  children: ReactNode;
  /** Rendered below the card (switch link, legal row …). */
  footer?: ReactNode;
}

/**
 * Common auth layout: gradient hero with logo tile + title, a white card
 * overlapping the hero's curved edge, and a footer slot underneath.
 */
export function AuthScreenShell({ subtitle, children, footer }: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={HERO_NAVY} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Hero ─────────────────────────────────────────────── */}
          <View style={[styles.hero, { paddingTop: insets.top + 28 }]}>
            <HeroBackground />

            <View style={styles.logoTile}>
              <BrandMark size={LOGO_MARK} />
            </View>
            <Text style={styles.heroTitle} accessibilityRole="header">
              DNX Provider
            </Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>

          {/* ── Card ─────────────────────────────────────────────── */}
          <View style={styles.card}>{children}</View>

          {/* ── Footer ───────────────────────────────────────────── */}
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
