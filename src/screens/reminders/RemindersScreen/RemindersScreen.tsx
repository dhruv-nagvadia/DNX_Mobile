import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, FileText, Car, Refrigerator, Bell, type LucideIcon } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { REMINDERS, ReminderKind } from './data';
import { styles } from './styles';

const ICON: Record<ReminderKind, LucideIcon> = {
  insurance: ShieldCheck,
  passport: FileText,
  vehicle: Car,
  appliance: Refrigerator,
};

/** Reminders tab — upcoming renewals and expiries. */
export default function RemindersScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>We&apos;ll nudge you before anything expires.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {REMINDERS.map((r) => {
          const Icon = ICON[r.kind] ?? Bell;
          return (
            <View key={r.id} style={styles.card}>
              <View style={styles.icon}>
                <Icon size={22} color={Color.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardSub}>{r.subtitle}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.cta}>Renew</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
