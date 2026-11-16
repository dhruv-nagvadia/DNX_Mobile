import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { CircleCheck, Info, LucideIcon, TriangleAlert } from 'lucide-react-native';

import { SheetButton } from '@/components/BottomSheet';
import { PILL, PillColors } from '@/utils/modernTheme';

import { ConfirmDialogProps, ConfirmTone } from './types';
import { styles } from './styles';

const TONES: Record<ConfirmTone, { colors: PillColors; icon: LucideIcon }> = {
  danger: { colors: PILL.red, icon: TriangleAlert },
  warning: { colors: PILL.orange, icon: TriangleAlert },
  info: { colors: PILL.blue, icon: Info },
  success: { colors: PILL.green, icon: CircleCheck },
};

/**
 * Themed replacement for the native `Alert.alert` — a centred white card
 * over a dim backdrop with a pastel tone icon, title, message and a
 * Cancel / primary button row. Fades + scales in; backdrop tap and Android
 * back cancel. Usually shown through `useConfirm()` rather than directly.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  tone = 'info',
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  inline = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, progress]);

  const backdropMotion = useMemo(() => ({ opacity: progress }), [progress]);
  const cardMotion = useMemo(
    () => ({
      opacity: progress,
      transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
    }),
    [progress],
  );

  const { colors, icon: toneIcon } = TONES[tone];
  const Icon = icon ?? toneIcon;
  const iconCircle = useMemo(() => ({ backgroundColor: colors.bg }), [colors.bg]);

  const dismiss = () => {
    if (!loading) {
      onCancel();
    }
  };

  if (inline && !mounted) {
    return null;
  }

  const body = (
    <View style={[styles.root, inline && styles.inlineRoot]}>
      <Animated.View style={[styles.backdrop, backdropMotion]}>
        <Pressable style={styles.backdropPress} onPress={dismiss} accessibilityLabel="Cancel" />
      </Animated.View>

      <Animated.View style={[styles.card, cardMotion]} accessibilityRole="alert">
        <View style={[styles.iconCircle, iconCircle]}>
          <Icon size={24} color={colors.fg} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {!!message && <Text style={styles.message}>{message}</Text>}

        <View style={styles.actions}>
          {cancelText !== null && (
            <SheetButton title={cancelText} variant="secondary" onPress={dismiss} disabled={loading} />
          )}
          <SheetButton
            title={confirmText}
            variant={tone === 'danger' && cancelText !== null ? 'danger' : 'primary'}
            loading={loading}
            onPress={onConfirm}
          />
        </View>
      </Animated.View>
    </View>
  );

  if (inline) {
    return body;
  }

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={dismiss}>
      {body}
    </Modal>
  );
}
