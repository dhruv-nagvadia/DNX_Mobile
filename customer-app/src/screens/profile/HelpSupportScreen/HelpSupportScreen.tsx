import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { SUPPORT, supportLinks } from '@/utils/support';

import { styles } from './styles';

/** Contact options for support — a phone call, WhatsApp, or email. */
export default function HelpSupportScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Help & support" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Have a question or ran into a problem? Reach us any of these ways — we're happy to help.
        </Text>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(supportLinks.call)}
          >
            <View style={styles.rowIcon}>
              <Phone size={18} color={Color.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Call us</Text>
              <Text style={styles.rowSub}>{SUPPORT.phoneDisplay}</Text>
            </View>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(supportLinks.whatsapp)}
          >
            <View style={styles.rowIcon}>
              <MessageCircle size={18} color={Color.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>WhatsApp us</Text>
              <Text style={styles.rowSub}>{SUPPORT.phoneDisplay}</Text>
            </View>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(supportLinks.email)}
          >
            <View style={styles.rowIcon}>
              <Mail size={18} color={Color.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Email us</Text>
              <Text style={styles.rowSub}>{SUPPORT.email}</Text>
            </View>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
