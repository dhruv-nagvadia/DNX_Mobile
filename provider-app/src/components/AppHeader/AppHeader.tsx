import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { INK, PAGE_BG } from '@/utils/modernTheme';

import { AppHeaderProps } from './types';
import { styles } from './styles';

/**
 * The standard chrome for every screen.
 *
 * - `variant="navy"` (default): a solid navy header mirroring the web
 *   dashboard's branded top bar. Tab roots show the "D" mark (`logo`);
 *   pushed screens show a back chevron.
 * - `variant="light"`: the mockup look used by Home and the Business Detail
 *   flow — page-coloured background, dark back arrow and dark bold title.
 */
export function AppHeader({
  title,
  subtitle,
  onBack,
  showBack,
  logo = false,
  right,
  variant = 'navy',
}: AppHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleBack = onBack ?? (() => navigation.goBack());
  const canShowBack = showBack ?? !logo;
  const light = variant === 'light';

  return (
    <View
      style={[styles.header, light && styles.headerLight, { paddingTop: insets.top + 10 }]}
      pointerEvents="box-none"
    >
      <StatusBar
        barStyle={light ? 'dark-content' : 'light-content'}
        backgroundColor={light ? PAGE_BG : Color.primary}
      />

      {logo ? (
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>D</Text>
        </View>
      ) : canShowBack ? (
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          {light ? <ArrowLeft size={24} color={INK} /> : <ChevronLeft size={24} color={Color.white} />}
        </TouchableOpacity>
      ) : null}

      {!!title && (
        <View style={styles.titleGroup}>
          <Text style={[styles.title, light && styles.titleLight]} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={[styles.subtitle, light && styles.subtitleLight]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
