import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Color } from '@/utils/Theme';

import { styles } from './styles';

/** A centered spinner for a screen's initial, blocking load — distinct from
 * RefreshControl, which covers a list's already-rendered pull-to-refresh. */
export function LoadingView() {
  return (
    <View style={styles.root}>
      <ActivityIndicator color={Color.primary} size="large" />
    </View>
  );
}
