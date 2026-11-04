import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Store } from 'lucide-react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, LINK, ModernRadius, SOFT_FILL } from '@/utils/modernTheme';
import { Business } from '@/redux/api/business/types';

interface Props {
  visible: boolean;
  businesses: Business[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** Small bottom sheet listing "All businesses" + each business. */
export function BusinessSelectSheet({ visible, businesses, selectedId, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const options = [{ id: '', name: 'All businesses' }, ...businesses.map((b) => ({ id: b.id, name: b.businessName }))];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.md }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Show earnings for</Text>
          <ScrollView bounces={false}>
            {options.map((o) => {
              const active = o.id === selectedId;
              return (
                <TouchableOpacity
                  key={o.id || 'all'}
                  style={[styles.row, active && styles.rowActive]}
                  onPress={() => {
                    onSelect(o.id);
                    onClose();
                  }}
                >
                  <Store size={18} color={active ? LINK : INK} />
                  <Text style={[styles.rowText, active && styles.rowTextActive]} numberOfLines={1}>
                    {o.name}
                  </Text>
                  {active && <Check size={18} color={LINK} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Color.overlay,
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: CARD_BORDER,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: ModernRadius.box,
  },
  rowActive: {
    backgroundColor: SOFT_FILL,
  },
  rowText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  rowTextActive: {
    fontWeight: FontWeight.bold,
    color: LINK,
  },
});
