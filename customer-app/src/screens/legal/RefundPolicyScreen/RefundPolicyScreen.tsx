import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { REFUND_LAST_UPDATED, REFUND_POLICY_SECTIONS } from '@/utils/legalContent';

import { styles } from './styles';

/** Refund & Cancellation Policy — reachable from Profile → About. */
export default function RefundPolicyScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Refund & Cancellation" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: {REFUND_LAST_UPDATED}</Text>
        {REFUND_POLICY_SECTIONS.map((section) => (
          <View key={section.heading}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
