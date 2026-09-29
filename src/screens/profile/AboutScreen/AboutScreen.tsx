import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { AppConfig } from '@/utils/Constants';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type AboutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AboutScreen'>;

/** App version, a short blurb, and links to the legal pages and support. */
export default function AboutScreen() {
  const navigation = useNavigation<AboutNavigationProp>();

  return (
    <View style={styles.container}>
      <AppHeader title="About DNX" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>D</Text>
        </View>
        <Text style={styles.appName}>DNX</Text>
        <Text style={styles.version}>Version {AppConfig.version}</Text>
        <Text style={styles.blurb}>
          DNX brings every local service and store into one app — book appointments, order from
          nearby shops, and keep track of it all in one place.
        </Text>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)}
          >
            <Text style={styles.rowLabel}>Help & support</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
          >
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(ROUTES.TERMS)}
          >
            <Text style={styles.rowLabel}>Terms of Service</Text>
            <ChevronRight size={20} color={Color.placeholder} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
