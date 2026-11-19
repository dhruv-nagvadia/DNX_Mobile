import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { RootStackParamList } from '@/navigation/routes';
import { Color } from '@/utils/Theme';
import { INK, PillColors } from '@/utils/modernTheme';
import { SUPPORT, supportLinks } from '@/utils/support';

import {
  EMAIL_REPLY_TIME,
  FAQ_TOPICS,
  FAQS,
  Faq,
  FaqLinkRoute,
  FaqTopic,
  SUPPORT_HOURS,
  WHATSAPP_REPLY_TIME,
  answerText,
} from './constants';
import { HelpIllustration } from './HelpIllustration';
import { BRAND_BLUE, CONTACT_TINT, HERO_COLORS, styles } from './styles';

type HelpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HelpSupportScreen'>;

const HERO_START = { x: 0, y: 0.2 };
const HERO_END = { x: 1, y: 0.8 };

function ContactCard({
  icon: Icon,
  tint,
  title,
  details,
  onPress,
}: {
  icon: typeof Phone;
  tint: PillColors;
  title: string;
  details: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${details}`}
    >
      <View style={[styles.contactIcon, { backgroundColor: tint.bg }]}>
        <Icon size={20} color={tint.fg} />
      </View>
      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDetails} numberOfLines={1}>
          {details}
        </Text>
      </View>
      <ChevronRight size={18} color={INK} />
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
        <CircleHelp size={20} color={open ? BRAND_BLUE : INK} />
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Chevron size={18} color={INK} />
      </TouchableOpacity>
      {open && (
        <Text style={styles.faqAnswer}>
          {faq.answer.map((seg, i) =>
            typeof seg === 'string' ? (
              seg
            ) : (
              <Text
                key={i}
                style={styles.faqLink}
                onPress={() => onLink(seg.route)}
                accessibilityRole="link"
              >
                {seg.text}
              </Text>
            ),
          )}
        </Text>
      )}
    </View>
  );
}

/**
 * Help & support — same layout as the provider app's redesigned Support
 * screen: navy hero with FAQ search, call / WhatsApp / email cards, an FAQ
 * accordion grouped by topic, and a "Still need help?" card.
 */
export default function HelpSupportScreen() {
  const navigation = useNavigation<HelpNavigationProp>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<FaqTopic>('all');
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  const onSearch = (text: string) => {
    setQuery(text);
    if (text.trim()) {
      setTopic('all');
    }
  };

  /** Matching FAQs, grouped under their topic in FAQ_TOPICS order. */
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = FAQS.filter((f) => {
      if (topic !== 'all' && f.topic !== topic) {
        return false;
      }
      return !q || f.question.toLowerCase().includes(q) || answerText(f).toLowerCase().includes(q);
    });
    return FAQ_TOPICS.filter((t) => t.key !== 'all')
      .map((t) => ({ ...t, faqs: matches.filter((f) => f.topic === t.key) }))
      .filter((g) => g.faqs.length > 0);
  }, [query, topic]);

  const onLink = (route: FaqLinkRoute) => navigation.navigate(route);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Help & support" subtitle="We’re here to help" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero + search */}
        <View style={styles.hero}>
          <GradientBackground colors={HERO_COLORS} start={HERO_START} end={HERO_END} />
          <View style={styles.heroTop}>
            <HelpIllustration size={80} />
            <View style={styles.heroDivider} />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>How can we help?</Text>
              <Text style={styles.heroBody}>
                Have a question or ran into a problem? Reach us any of these ways — we’re happy to
                help.
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
              accessibilityLabel="Search help"
            />
          </View>
        </View>

        {/* Contact options */}
        <ContactCard
          icon={Phone}
          tint={CONTACT_TINT.call}
          title="Call us"
          details={`${SUPPORT.phoneDisplay} • ${SUPPORT_HOURS}`}
          onPress={() => Linking.openURL(supportLinks.call)}
        />
        <ContactCard
          icon={MessageCircle}
          tint={CONTACT_TINT.whatsapp}
          title="WhatsApp us"
          details={`${SUPPORT.phoneDisplay} • ${WHATSAPP_REPLY_TIME}`}
          onPress={() => Linking.openURL(supportLinks.whatsapp)}
        />
        <ContactCard
          icon={Mail}
          tint={CONTACT_TINT.email}
          title="Email us"
          details={`${SUPPORT.email} • ${EMAIL_REPLY_TIME}`}
          onPress={() => Linking.openURL(supportLinks.email)}
        />

        {/* FAQs */}
        <View style={styles.faqCard}>
          <Text style={styles.faqTitle} accessibilityRole="header">
            Frequently asked questions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipRow}
          >
            {FAQ_TOPICS.map((t) => {
              const active = t.key === topic;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setTopic(t.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {groups.length === 0 ? (
            <Text style={styles.faqEmpty}>No answers match — contact us above</Text>
          ) : (
            groups.map((g) => (
              <View key={g.key} style={styles.faqGroup}>
                <Text style={styles.groupLabel}>{g.label}</Text>
                {g.faqs.map((f) => (
                  <FaqItem
                    key={f.id}
                    faq={f}
                    open={openId === f.id}
                    onToggle={() => setOpenId((prev) => (prev === f.id ? null : f.id))}
                    onLink={onLink}
                  />
                ))}
              </View>
            ))
          )}
        </View>

        {/* Still need help? */}
        <View style={styles.stillCard}>
          <View style={styles.stillTop}>
            <View style={styles.stillIcon}>
              <Headphones size={22} color={BRAND_BLUE} />
            </View>
            <View style={styles.stillText}>
              <Text style={styles.stillTitle}>Still need help?</Text>
              <Text style={styles.stillBody}>
                Keep your booking or order details handy and our team will sort it out.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.stillBtn}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(supportLinks.whatsapp)}
            accessibilityRole="button"
            accessibilityLabel="Chat with us on WhatsApp"
          >
            <MessageCircle size={18} color={Color.white} />
            <Text style={styles.stillBtnText}>Chat with us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
