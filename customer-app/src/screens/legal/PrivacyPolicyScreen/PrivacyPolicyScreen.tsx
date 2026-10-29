import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { LEGAL_LAST_UPDATED, PRIVACY_POLICY_SECTIONS } from '@/utils/legalContent';

import { styles } from './styles';

/** Privacy Policy — plain-language, reachable from Profile → About and at signup. */
export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: {LEGAL_LAST_UPDATED}</Text>
        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <View key={section.heading}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
