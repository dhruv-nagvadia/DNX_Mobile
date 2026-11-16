import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Command, ShoppingBag, Store } from 'lucide-react-native';

import { BottomSheet, SheetButton, SheetOption } from '@/components/BottomSheet';
import { Pill } from '@/components/Pill';
import { Business } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { PILL } from '@/utils/modernTheme';

import { styles } from './styles';

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
        icon={<Command size={13} color={PILL.lavender.fg} strokeWidth={2} />}
      />
    );
  }
  if (type === 'STORE') {
    return (
      <Pill
        label="Store"
        colors={PILL.blue}
        style={styles.typePill}
        icon={<ShoppingBag size={13} color={PILL.blue.fg} strokeWidth={2} />}
      />
    );
  }
  return null;
}

/** "Create offer — Step 1 of 2 • Choose business". Step 2 is the coupon form. */
export function ChooseBusinessSheet({ visible, businesses, initialId, onClose, onContinue }: ChooseBusinessSheetProps) {
  const [selected, setSelected] = useState<string | undefined>(initialId);

  useEffect(() => {
    if (visible) {
      setSelected(initialId);
    }
  }, [visible, initialId]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Create offer"
      subtitle="Step 1 of 2 • Choose business"
      scrollable
      footer={
        <SheetButton
          title="Continue"
          disabled={!selected}
          onPress={() => {
            if (selected) {
              onContinue(selected);
            }
          }}
        />
      }
    >
      {businesses.map((b) => {
        const photo = b.images?.[0];
        return (
          <SheetOption
            key={b.id}
            role="radio"
            label={b.businessName}
            selected={selected === b.id}
            onPress={() => setSelected(b.id)}
            leading={
              photo ? (
                <Image source={{ uri: photo }} style={styles.bizPhoto} />
              ) : (
                <View style={styles.bizPhotoFallback}>
                  <Store size={20} color={Color.placeholder} strokeWidth={1.6} />
                </View>
              )
            }
            meta={<TypePill type={b.type} />}
          />
        );
      })}
    </BottomSheet>
  );
}
