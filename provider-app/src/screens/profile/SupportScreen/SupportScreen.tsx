import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { RootStackParamList } from '@/navigation/routes';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG } from '@/utils/modernTheme';
import { SUPPORT, supportLinks } from '@/utils/support';

import {
  EMAIL_REPLY_TIME,
  FAQ_CATEGORIES,
  FAQS,
  Faq,
  FaqCategory,
  FaqLinkRoute,
  SUPPORT_HOURS,
  TIP_EXAMPLE_ID,
  WHATSAPP_REPLY_TIME,
  answerText,
} from './constants';
import { HelpIllustration } from './HelpIllustration';
import { BRAND_BLUE, CONTACT_TINT, HERO_COLORS, TIP_ICON, styles } from './styles';

type SupportNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SupportScreen'>;

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const HERO_START = { x: 0, y: 0.2 };
const HERO_END = { x: 1, y: 0.8 };

function ContactCard({
  icon,
  tint,
  title,
  details,
  onPress,
}: {
  icon: React.ReactNode;
  tint: object;
  title: string;
  details: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.contactCard} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
      <View style={[styles.contactIcon, tint]}>{icon}</View>
      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDetails} numberOfLines={1}>
          {details}
        </Text>
      </View>
      <ChevronRight size={22} color={INK} />
    </TouchableOpacity>
  );
}

function FaqItem({
  faq,
  open,
  onToggle,
  onLink,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  onLink: (route: FaqLinkRoute) => void;
}) {
  const Chevron = open ? ChevronUp : ChevronDown;
  return (
    <View style={[styles.faqItem, open && styles.faqItemOpen]}>
      <TouchableOpacity
        style={[styles.faqHeader, open && styles.faqHeaderOpen]}
        onPress={onToggle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <CircleHelp size={22} color={open ? BRAND_BLUE : INK} />
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Chevron size={20} color={INK} />
      </TouchableOpacity>
      {open && (
        <Text style={styles.faqAnswer}>
          {faq.answer.map((seg, i) =>
            typeof seg === 'string' ? (
              seg
            ) : (
              <Text key={i} style={styles.faqLink} onPress={() => onLink(seg.route)} accessibilityRole="link">
                {seg.text}
              </Text>
            ),
          )}
        </Text>
      )}
    </View>
  );
}

/** Mockup "Modern Help & Support App Screen.png": light header, navy hero
 * with FAQ search, contact cards, filterable FAQ accordion and a tip card. */
export default function SupportScreen() {
  const navigation = useNavigation<SupportNavigationProp>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  const onSearch = (text: string) => {
    setQuery(text);
    if (text.trim()) {
      setCategory('all');
    }
  };

  const visibleFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(f => {
      if (category !== 'all' && !f.categories.includes(category)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return f.question.toLowerCase().includes(q) || answerText(f).toLowerCase().includes(q);
    });
  }, [query, category]);

  const onLink = (route: FaqLinkRoute) => navigation.navigate(route);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Help & support</Text>
          <Text style={styles.subtitle}>We’re here to help</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <GradientBackground colors={HERO_COLORS} start={HERO_START} end={HERO_END} />
          <View style={styles.heroTop}>
            <HelpIllustration size={80} />
            <View style={styles.heroDivider} />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>How can we help?</Text>
              <Text style={styles.heroBody}>
                Something wrong on a job, a payment issue, or anything else — reach us directly.
              </Text>
            </View>
          </View>
          <View style={styles.search}>
            <Search size={20} color={Color.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={onSearch}
              placeholder="Search help..."
              placeholderTextColor={Color.textSecondary}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Contact options */}
        <ContactCard
          icon={<Phone size={24} color={CONTACT_TINT.call.fg} />}
          tint={styles.tintCall}
          title="Call us"
          details={`${SUPPORT.phoneDisplay} • ${SUPPORT_HOURS}`}
          onPress={() => Linking.openURL(supportLinks.call)}
        />
        <ContactCard
          icon={<MessageCircle size={24} color={CONTACT_TINT.whatsapp.fg} />}
          tint={styles.tintWhatsapp}
          title="WhatsApp us"
          details={WHATSAPP_REPLY_TIME}
          onPress={() => Linking.openURL(supportLinks.whatsapp)}
        />
        <ContactCard
          icon={<Mail size={24} color={CONTACT_TINT.email.fg} />}
          tint={styles.tintEmail}
          title="Email us"
          details={`${SUPPORT.email} • ${EMAIL_REPLY_TIME}`}
          onPress={() => Linking.openURL(supportLinks.email)}
        />

        {/* FAQs */}
        <View style={styles.faqCard}>
          <Text style={styles.faqTitle}>Frequently asked questions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipRow}
          >
            {FAQ_CATEGORIES.map(c => {
              const active = c.key === category;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(c.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.faqList}>
            {visibleFaqs.length === 0 ? (
              <Text style={styles.faqEmpty}>No answers match — contact us above</Text>
            ) : (
              visibleFaqs.map(f => (
                <FaqItem
                  key={f.id}
                  faq={f}
                  open={openId === f.id}
                  onToggle={() => setOpenId(prev => (prev === f.id ? null : f.id))}
                  onLink={onLink}
                />
              ))
            )}
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Lightbulb size={30} color={TIP_ICON} />
          <View style={styles.tipDivider} />
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Before contacting us:</Text>
            <Text style={styles.tipBody}>Keep your booking/order ID handy, e.g. {TIP_EXAMPLE_ID}.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
