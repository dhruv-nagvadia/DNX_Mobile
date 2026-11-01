import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Mail, MessageCircle, Phone } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { SUPPORT, supportLinks } from '@/utils/support';

import { styles } from './styles';

/** Ports `frontend/src/pages/provider/SupportPage/SupportPage.tsx` — direct,
 * always-visible ways to reach DNX support. */
export default function SupportScreen() {
  return (
    <View style={styles.root}>
      <AppHeader title="Support" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Something wrong on a job, a payment issue, or anything else — reach us directly.
        </Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.option} onPress={() => Linking.openURL(supportLinks.call)}>
            <View style={[styles.icon, styles.iconCall]}>
              <Phone size={20} color={Color.success} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>Call us</Text>
              <Text style={styles.optionValue}>{SUPPORT.phoneDisplay}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => Linking.openURL(supportLinks.whatsapp)}>
            <View style={[styles.icon, styles.iconWhatsapp]}>
              <MessageCircle size={20} color={Color.success} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>WhatsApp us</Text>
              <Text style={styles.optionValue}>{SUPPORT.phoneDisplay}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => Linking.openURL(supportLinks.email)}>
            <View style={[styles.icon, styles.iconEmail]}>
              <Mail size={20} color={Color.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>Email us</Text>
              <Text style={styles.optionValue}>{SUPPORT.email}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
