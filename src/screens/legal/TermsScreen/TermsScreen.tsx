import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from '@/utils/legalContent';

import { styles } from './styles';

/** Terms of Service — reachable from Profile → About and at signup. */
export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Terms of Service" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: {LEGAL_LAST_UPDATED}</Text>
        {TERMS_SECTIONS.map((section) => (
          <View key={section.heading}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
