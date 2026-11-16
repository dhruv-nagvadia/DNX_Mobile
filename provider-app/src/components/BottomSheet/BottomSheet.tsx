import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';

import { Color, Spacing } from '@/utils/Theme';
import { INK, PILL } from '@/utils/modernTheme';

import { BottomSheetProps, SheetButtonProps, SheetOptionProps } from './types';
import { SHEET_BLUE, SHEET_RED, SHEET_SLIDE_FROM, styles } from './styles';

const CLOSE_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : undefined;

/**
 * The app's one standard bottom sheet: white, 24px top radius, grabber,
 * 17px title (+ optional 13px subtitle), round close button, safe-area
 * bottom padding, dim backdrop and a slide-up / fade-out animation.
 *
 * Stays mounted while it animates out, so content doesn't vanish mid-close.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  leading,
  headerRight,
  showClose = true,
  footer,
  scrollable = false,
  contentStyle,
  overlay,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, progress]);

  const backdropMotion = useMemo(() => ({ opacity: progress }), [progress]);
  const sheetMotion = useMemo(
    () => ({
      paddingBottom: insets.bottom + Spacing.md,
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [SHEET_SLIDE_FROM, 0] }) }],
    }),
    [progress, insets.bottom],
  );

  const hasHeader = !!title || !!subtitle || !!leading || !!headerRight || showClose;

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.root} behavior={KEYBOARD_BEHAVIOR}>
        <Animated.View style={[styles.backdrop, backdropMotion]}>
          <Pressable style={styles.backdropPress} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetMotion]}>
          <View style={styles.grabber} />

          {hasHeader && (
            <View style={styles.header}>
              {leading}
              <View style={styles.headerText}>
                {!!title && (
                  <Text style={styles.title} numberOfLines={2}>
                    {title}
                  </Text>
                )}
                {!!subtitle && (
                  <Text style={styles.subtitle} numberOfLines={2}>
                    {subtitle}
                  </Text>
                )}
              </View>
              {headerRight}
              {showClose && (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={CLOSE_HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <X size={18} color={INK} strokeWidth={2.2} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {scrollable ? (
            <ScrollView
              style={styles.scroll}
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.content, contentStyle]}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.content, contentStyle]}>{children}</View>
          )}

          {!!footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>

        {overlay}
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** A ≥56px option row: 40px pastel icon box, 15px label, check when selected. */
export function SheetOption({
  label,
  description,
  icon: Icon,
  tone,
  leading,
  meta,
  selected = false,
  destructive = false,
  disabled = false,
  role = 'button',
  onPress,
}: SheetOptionProps) {
  const colors = PILL[tone ?? (destructive ? 'red' : 'blue')];
  const iconColor = destructive ? SHEET_RED : colors.fg;
  // Destructive rows already sit on a red tint, so their icon box is white.
  const boxColor = useMemo(
    () => ({ backgroundColor: destructive ? Color.white : colors.bg }),
    [destructive, colors.bg],
  );

  return (
    <TouchableOpacity
      style={[
        styles.option,
        selected && styles.optionSelected,
        destructive && styles.optionDestructive,
        disabled && styles.optionDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
    >
      {leading ??
        (Icon ? (
          <View style={[styles.iconBox, boxColor]}>
            <Icon size={20} color={iconColor} strokeWidth={1.9} />
          </View>
        ) : null)}
      <View style={styles.optionText}>
        <Text
          style={[
            styles.optionLabel,
            selected && styles.optionLabelSelected,
            destructive && styles.optionLabelDestructive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {!!description && (
          <Text style={styles.optionDescription} numberOfLines={2}>
            {description}
          </Text>
        )}
        {meta}
      </View>
      {selected && <Check size={20} color={SHEET_BLUE} strokeWidth={2.4} />}
    </TouchableOpacity>
  );
}

/** 48px popup button — filled blue (primary), filled red (danger) or outlined grey (secondary). */
export function SheetButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: SheetButtonProps) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'danger' && styles.buttonDanger,
        isSecondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? INK : Color.white} />
      ) : (
        <Text style={[styles.buttonText, isSecondary && styles.buttonTextSecondary]} numberOfLines={1}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
