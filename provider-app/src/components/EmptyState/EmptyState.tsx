import React from 'react';
import { Text, View } from 'react-native';

import { EmptyStateProps } from './types';
import { styles } from './styles';

/** Mirrors the customer app's empty-list convention: a 48px outline icon
 * above a title and body, no card wrapper. Pass a lucide icon element sized
 * 48 with `color={Color.placeholder}` and `strokeWidth={1.4}`. */
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <View style={styles.center}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {!!body && <Text style={styles.body}>{body}</Text>}
      {action}
    </View>
  );
}
