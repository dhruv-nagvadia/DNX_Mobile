import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { PAGE_BG } from '@/utils/modernTheme';

import { SlideVisual } from './SlideVisual';
import { useOnboardingScreen } from './useOnboardingScreen';
import { styles } from './styles';

const SKIP_HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

/** JSX only — paging logic comes from useOnboardingScreen. */
export default function OnboardingScreen() {
  const { width, scrollRef, index, isLast, slides, next, finish, onMomentumScrollEnd } =
    useOnboardingScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.logoRow} accessible accessibilityLabel="DNX">
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <Text style={styles.wordmark}>DNX</Text>
        </View>

        {!isLast && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={finish}
            hitSlop={SKIP_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Skip intro"
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
              <Text style={styles.title} accessibilityRole="header">
                {slide.title} <Text style={styles.titleAccent}>{slide.accentTail}</Text>
              </Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View
          style={styles.dots}
          accessible
          accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
        >
          {slides.map((slide, i) => (
            <View key={slide.key} style={[styles.dotBase, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={next}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get started' : 'Next slide'}
        >
          <Text style={styles.ctaText}>{isLast ? 'Get started' : 'Next'}</Text>
          <ArrowRight size={20} color={Color.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
