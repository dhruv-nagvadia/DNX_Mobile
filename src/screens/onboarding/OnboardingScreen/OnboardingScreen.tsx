import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { Glow } from '@/components/AuthHero';
import { Color, Spacing } from '@/utils/Theme';

import { SlideVisual } from './SlideVisual';
import { useOnboardingScreen } from './useOnboardingScreen';
import { styles } from './styles';

/** JSX only — paging logic comes from useOnboardingScreen. */
export default function OnboardingScreen() {
  const { width, scrollRef, index, isLast, slides, next, finish, onMomentumScrollEnd } =
    useOnboardingScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />

      {/* Same aurora as the auth hero, so onboarding and sign-in feel like one app. */}
      <Glow size={420} color={Color.accent} top={-190} left={-150} opacity={0.45} />
      <Glow size={340} color={Color.accent2} top={-110} right={-130} opacity={0.4} />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.logoRow}>
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <Text style={styles.wordmark}>DNX</Text>
        </View>

        {!isLast && (
          <TouchableOpacity
            onPress={finish}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
          >
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.pager}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <View style={styles.visual}>
              <SlideVisual kind={slide.key} />
            </View>

            <View style={styles.copy}>
              <Text style={styles.title}>
                {slide.title} <Text style={styles.titleAccent}>{slide.accentTail}</Text>
              </Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <View style={styles.dots} accessibilityRole="tablist">
          {slides.map((slide, i) => (
            <View key={slide.key} style={[styles.dotBase, i === index && styles.dotActive]} />
          ))}
        </View>

        <AppButton
          variant="accent"
          title={isLast ? 'Get started' : 'Next'}
          onPress={next}
          style={styles.cta}
        />
      </View>
    </View>
  );
}
