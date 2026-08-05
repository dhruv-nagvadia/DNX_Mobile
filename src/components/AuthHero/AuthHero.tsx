import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Color, Duration } from '@/utils/Theme';

import { Glow } from './Glow';
import { AuthHeroProps } from './types';
import { styles } from './styles';

/**
 * Dark "ink" hero shared by the auth screens.
 *
 * It is deliberately FIXED — it never scrolls. The white sheet below it owns
 * the only scroll view, so the brand stays put while the form moves. This also
 * owns the top safe-area inset.
 */
export function AuthHero({ promise, accentTail, compact = false }: AuthHeroProps) {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!active) {
        return;
      }

      if (enabled) {
        // Land on the final frame instead of animating to it.
        entrance.setValue(1);
        return;
      }
      Animated.timing(entrance, {
        toValue: 1,
        duration: Duration.slow,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      active = false;
    };
  }, [entrance]);

  const animatedStyle = {
    opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  };

  return (
    <View
      style={[
        styles.hero,
        compact && styles.heroCompact,
        { paddingTop: insets.top + (compact ? 14 : 20) },
      ]}
    >
      {/* Decorative aurora — two offset glows behind the content. */}
      <Glow size={360} color={Color.accent} top={-150} left={-120} opacity={0.5} />
      <Glow size={300} color={Color.accent2} top={-90} right={-110} opacity={0.45} />

      <Animated.View style={animatedStyle}>
        <View style={styles.logoRow}>
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <Text style={styles.wordmark}>DNX</Text>
        </View>

        <Text style={[styles.promise, compact && styles.promiseCompact]}>
          {promise} <Text style={styles.promiseAccent}>{accentTail}</Text>
        </Text>
      </Animated.View>
    </View>
  );
}
