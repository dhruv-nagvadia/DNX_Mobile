import React from 'react';
import { LayoutGrid, Store } from 'lucide-react-native';

import { BottomSheet, SheetOption } from '@/components/BottomSheet';
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
  const options = [{ id: '', name: 'All businesses' }, ...businesses.map((b) => ({ id: b.id, name: b.businessName }))];

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Show earnings for" scrollable>
      {options.map((o) => (
        <SheetOption
          key={o.id || 'all'}
          role="radio"
          icon={o.id ? Store : LayoutGrid}
          label={o.name}
          selected={o.id === selectedId}
          onPress={() => {
            onSelect(o.id);
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}
