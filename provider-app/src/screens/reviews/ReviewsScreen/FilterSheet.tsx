import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { BottomSheet, SheetButton } from '@/components/BottomSheet';
import { Color } from '@/utils/Theme';

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
  const types: { key: ReviewTypeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'business', label: 'Business' },
    ...(showProducts ? [{ key: 'product' as const, label: 'Products' }] : []),
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Sort & filter"
      footer={<SheetButton title="Done" onPress={onClose} />}
    >
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
    </BottomSheet>
  );
}
