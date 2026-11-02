import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { FontSize, FontWeight } from '@/utils/Theme';
import { PillColors } from '@/utils/modernTheme';

interface PillProps {
  label: string;
  colors: PillColors;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** A soft rounded status pill for the modern (mockup) screens — e.g.
 * "Confirm Request", "Active", "Only 4 left". Colours come from `PILL`. */
export function Pill({ label, colors, icon, style }: PillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }, style]}>
      {icon}
      <Text style={[styles.text, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
