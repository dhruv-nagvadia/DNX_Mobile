import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Command, ShoppingBag, Store } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Business } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { PILL } from '@/utils/modernTheme';

import { styles } from './styles';

const SLIDE_FROM = 600;

interface ChooseBusinessSheetProps {
  visible: boolean;
  businesses: Business[];
  /** Pre-selected business (e.g. the one filtered on the list). */
  initialId?: string;
  onClose: () => void;
  onContinue: (businessId: string) => void;
}

function TypePill({ type }: { type: Business['type'] }) {
  if (type === 'SERVICE') {
    return (
      <Pill
        label="Service"
        colors={PILL.lavender}
        style={styles.typePill}
        icon={<Command size={15} color={PILL.lavender.fg} strokeWidth={2} />}
      />
    );
  }
  if (type === 'STORE') {
    return (
      <Pill
        label="Store"
        colors={PILL.blue}
        style={styles.typePill}
        icon={<ShoppingBag size={15} color={PILL.blue.fg} strokeWidth={2} />}
      />
    );
  }
  return null;
}

/** "Create offer — Step 1 of 2 • Choose business". Step 2 is the coupon form. */
export function ChooseBusinessSheet({ visible, businesses, initialId, onClose, onContinue }: ChooseBusinessSheetProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | undefined>(initialId);
  const translateY = useRef(new Animated.Value(SLIDE_FROM)).current;

  useEffect(() => {
    if (visible) {
      setSelected(initialId);
      translateY.setValue(SLIDE_FROM);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, initialId, translateY]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.sm, transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Create offer</Text>
          <Text style={styles.sheetSubtitle}>Step 1 of 2 • Choose business</Text>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetList}>
            {businesses.map((b) => {
              const isSelected = selected === b.id;
              const photo = b.images?.[0];
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.bizRow, isSelected && styles.bizRowSelected]}
                  onPress={() => setSelected(b.id)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={b.businessName}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.bizPhoto} />
                  ) : (
                    <View style={styles.bizPhotoFallback}>
                      <Store size={28} color={Color.placeholder} strokeWidth={1.6} />
                    </View>
                  )}
                  <View style={styles.bizText}>
                    <Text style={styles.bizName} numberOfLines={1}>
                      {b.businessName}
                    </Text>
                    <TypePill type={b.type} />
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
            disabled={!selected}
            onPress={() => {
              if (selected) {
                onContinue(selected);
              }
            }}
            accessibilityRole="button"
            accessibilityState={{ disabled: !selected }}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} accessibilityRole="button">
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
