import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { BrandMark } from './BrandMark';
import { HeroBackground } from './HeroBackground';
import { HERO_NAVY, LOGO_MARK, authStyles as styles } from './styles';

interface AuthScreenShellProps {
  /** Line under the hero title. */
  subtitle: string;
  /** Hero title. Defaults to "DNX". */
  title?: string;
  /** Show a back arrow in the hero (only when there's a screen to go back to). */
  showBack?: boolean;
  /** Custom back action; defaults to navigation.goBack(). */
  onBack?: () => void;
  /** Card contents (heading, fields, submit). */
  children: ReactNode;
  /** Rendered below the card (switch link, legal row …). */
  footer?: ReactNode;
}

/**
 * Common auth layout: gradient hero with logo tile + title, a white card
 * overlapping the hero's curved edge, and a footer slot underneath.
 */
export function AuthScreenShell({
  subtitle,
  title = 'DNX',
  showBack = false,
  onBack,
  children,
  footer,
}: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const canGoBack = showBack && (!!onBack || navigation.canGoBack());

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

            {canGoBack && (
              <Pressable
                style={[styles.backBtn, { top: insets.top + 12 }]}
                onPress={onBack ?? (() => navigation.goBack())}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            )}

            <View style={styles.logoTile}>
              <BrandMark size={LOGO_MARK} />
            </View>
            <Text style={styles.heroTitle} accessibilityRole="header">
              {title}
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
