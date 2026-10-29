import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Color } from '@/utils/Theme';

import { ActionModalProps } from './types';
import { styles } from './styles';

/**
 * Bottom-sheet confirmation modal — used for a cancel reason (order/booking
 * cancel) and a plain confirm (booking payment collection), mirroring the
 * web dashboard's cancel-reason and "mark paid" confirm dialogs.
 */
export function ActionModal({
  visible,
  title,
  message,
  reasonValue,
  onReasonChange,
  reasonPlaceholder = 'Add a note (optional)',
  confirmLabel,
  confirmTone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}

          {onReasonChange && (
            <TextInput
              style={styles.input}
              value={reasonValue}
              onChangeText={onReasonChange}
              placeholder={reasonPlaceholder}
              placeholderTextColor={Color.placeholder}
              multiline
              maxLength={500}
            />
          )}

          <View style={styles.actions}>
            <AppButton
              style={styles.actionButton}
              title="Back"
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
            />
            <AppButton
              style={styles.actionButton}
              title={confirmLabel}
              variant={confirmTone === 'danger' ? 'secondary' : 'primary'}
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
