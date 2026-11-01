import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { Color } from '@/utils/Theme';

import { AppHeaderProps } from './types';
import { styles } from './styles';

/**
 * The standard chrome for every screen — a solid navy header mirroring the
 * web dashboard's branded sidebar/top bar (same `Color.primary` navy, same
 * "D" mark), so the provider app reads as the same product as the web
 * dashboard rather than borrowing the customer app's plain white headers.
 * Tab roots show the brand mark (`logo`); pushed screens show a back button.
 */
export function AppHeader({ title, subtitle, onBack, showBack, logo = false, right }: AppHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleBack = onBack ?? (() => navigation.goBack());
  const canShowBack = showBack ?? !logo;

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]} pointerEvents="box-none">
      <StatusBar barStyle="light-content" backgroundColor={Color.primary} />

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
          <ChevronLeft size={24} color={Color.white} />
        </TouchableOpacity>
      ) : null}

      {!!title && (
        <View style={styles.titleGroup}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
