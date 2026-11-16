import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { INK, ModernSize, ModernType, PAGE_BG } from '@/utils/modernTheme';

interface ScreenHeaderProps {
  title: string;
  /** Grey line under the title, e.g. "12 categories". */
  subtitle?: string;
  onBack?: () => void;
  /** Optional trailing action (icon button etc.). */
  right?: ReactNode;
}

/**
 * Light page header for redesigned screens — same as the provider app's:
 * back arrow, bold title + grey subtitle, on the page background (no bar).
 * Owns the top safe-area inset.
 */
export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack ?? (() => navigation.goBack())}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={22} color={INK} strokeWidth={2.2} />
      </TouchableOpacity>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: 8,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    color: INK,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
});
