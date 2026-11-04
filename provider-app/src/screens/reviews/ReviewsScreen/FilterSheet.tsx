import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';

import { Color, Spacing } from '@/utils/Theme';

import { styles } from './styles';
import { ReviewSort, ReviewTypeFilter } from './types';

const SORTS: { key: ReviewSort; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'highest', label: 'Highest' },
  { key: 'lowest', label: 'Lowest' },
];

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {selected && <Check size={14} color={Color.white} strokeWidth={2.6} />}
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  sort: ReviewSort;
  onSort: (s: ReviewSort) => void;
  type: ReviewTypeFilter;
  onType: (t: ReviewTypeFilter) => void;
  showProducts: boolean;
}

export function FilterSheet({ visible, onClose, sort, onSort, type, onType, showProducts }: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const types: { key: ReviewTypeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'business', label: 'Business' },
    ...(showProducts ? [{ key: 'product' as const, label: 'Products' }] : []),
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters">
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Sort & filter</Text>

          <Text style={styles.sheetLabel}>Sort</Text>
          <View style={styles.sheetOptions}>
            {SORTS.map((s) => (
              <Option key={s.key} label={s.label} selected={sort === s.key} onPress={() => onSort(s.key)} />
            ))}
          </View>

          <Text style={styles.sheetLabel}>Type</Text>
          <View style={styles.sheetOptions}>
            {types.map((t) => (
              <Option key={t.key} label={t.label} selected={type === t.key} onPress={() => onType(t.key)} />
            ))}
          </View>

          <TouchableOpacity style={styles.sheetDone} onPress={onClose} accessibilityRole="button">
            <Text style={styles.postText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
