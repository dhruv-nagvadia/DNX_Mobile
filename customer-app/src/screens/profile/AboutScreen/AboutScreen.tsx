import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CalendarCheck,
  ChevronRight,
  FileText,
  Headphones,
  Heart,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AppConfig } from '@/utils/Constants';
import { PILL, PillColors } from '@/utils/modernTheme';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { BRAND_GRADIENT, CHEVRON, HEART, styles } from './styles';

type AboutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AboutScreen'>;
type IconType = typeof FileText;

const HIGHLIGHTS: { icon: IconType; tone: PillColors; text: string }[] = [
  { icon: CalendarCheck, tone: PILL.blue, text: 'Book appointments' },
  { icon: ShoppingBag, tone: PILL.green, text: 'Order from nearby shops' },
  { icon: Store, tone: PILL.orange, text: 'Track it all in one place' },
];

function Row({
  icon: Icon,
  tone,
  title,
  onPress,
  first,
}: {
  icon: IconType;
  tone: PillColors;
  title: string;
  onPress: () => void;
  first?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !first && styles.rowBorder]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.rowIcon, { backgroundColor: tone.bg }]}>
        <Icon size={20} color={tone.fg} />
      </View>
      <Text style={styles.rowTitle} numberOfLines={1}>
        {title}
      </Text>
      <ChevronRight size={20} color={CHEVRON} />
    </TouchableOpacity>
  );
}

/** App version, a short blurb, and links to the legal pages and support. */
export default function AboutScreen() {
  const navigation = useNavigation<AboutNavigationProp>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHeader title="About DNX" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand card */}
        <View style={styles.brandCard}>
          <GradientBackground colors={BRAND_GRADIENT} />
          <View style={styles.logo} accessibilityLabel="DNX logo">
            <Text style={styles.logoText}>D</Text>
          </View>
          <Text style={styles.appName}>DNX</Text>
          <Text style={styles.tagline}>Every local service and store, in one app</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>Version {AppConfig.version}</Text>
          </View>
        </View>

        {/* What DNX does */}
        <Text style={styles.sectionLabel}>What DNX does</Text>
        <View style={styles.card}>
          <Text style={styles.blurb}>
            DNX brings every local service and store into one app — book appointments, order from
            nearby shops, and keep track of it all in one place.
          </Text>
          <View style={styles.highlights}>
            {HIGHLIGHTS.map(({ icon: Icon, tone, text }) => (
              <View key={text} style={styles.highlight}>
                <View style={[styles.highlightIcon, { backgroundColor: tone.bg }]}>
                  <Icon size={18} color={tone.fg} />
                </View>
                <Text style={styles.highlightText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <Text style={styles.sectionLabel}>Support & legal</Text>
        <View style={styles.section}>
          <Row
            first
            icon={Headphones}
            tone={PILL.blue}
            title="Help & support"
            onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)}
          />
          <Row
            icon={ShieldCheck}
            tone={PILL.green}
            title="Privacy Policy"
            onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
          />
          <Row
            icon={FileText}
            tone={PILL.lavender}
            title="Terms of Service"
            onPress={() => navigation.navigate(ROUTES.TERMS)}
          />
          <Row
            icon={RefreshCw}
            tone={PILL.orange}
            title="Refund & Cancellation Policy"
            onPress={() => navigation.navigate(ROUTES.REFUND_POLICY)}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow} accessible accessibilityLabel="Made with love in India">
            <Text style={styles.footerText}>Made with</Text>
            <Heart size={14} color={HEART} fill={HEART} />
            <Text style={styles.footerText}>in India</Text>
          </View>
          <Text style={styles.footerMeta}>DNX • v{AppConfig.version}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
