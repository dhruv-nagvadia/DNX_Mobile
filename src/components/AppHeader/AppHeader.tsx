import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { Color } from '@/utils/Theme';

import { AppHeaderProps } from './types';
import { styles } from './styles';

/**
 * Plain JS header used across the app instead of the native-stack header.
 *
 * The native iOS header renders a translucent, bouncing bar — this replaces it
 * with a flat, themed header so there's no bubble/blur effect. It owns the top
 * safe-area inset.
 */
export function AppHeader({ title, onBack, variant = 'light', floating = false, right }: AppHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dark = variant === 'dark';
  const handleBack = onBack ?? (() => navigation.goBack());
  const iconColor = dark ? Color.onDark : Color.textPrimary;

  return (
    <View
      style={[
        styles.header,
        dark && styles.headerDark,
        floating && styles.headerFloating,
        { paddingTop: insets.top + 6 },
      ]}
      pointerEvents="box-none"
    >
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={dark ? Color.ink : Color.surface}
        translucent={floating}
      />

      <TouchableOpacity
        onPress={handleBack}
        style={[styles.backBtn, floating && styles.backBtnFloating]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={24} color={floating ? Color.textPrimary : iconColor} />
      </TouchableOpacity>

      {!floating && !!title && (
        <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>
          {title}
        </Text>
      )}

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
