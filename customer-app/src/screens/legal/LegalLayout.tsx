import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_SHADOW,
  INK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
} from '@/utils/modernTheme';
import { LegalSection } from '@/utils/legalContent';

const MUTED = '#64748B';
const BODY = '#334155';
const SUMMARY_BG = '#EEF4FF';
const SUMMARY_BORDER = '#D5E2FA';

/** "Label: rest" at the start of a paragraph — the label is drawn bold. */
const LEAD_LABEL = /^([A-Z][A-Za-z ,'&/()-]{2,40}):\s/;
const BULLET = /^•\s*/;

/** Paragraphs (blank-line separated); "• " paragraphs render as bullet rows. */
function SectionBody({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <View style={styles.paragraphs}>
      {paragraphs.map((p, i) => {
        if (BULLET.test(p)) {
          return (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={[styles.body, styles.bulletText]}>{p.replace(BULLET, '')}</Text>
            </View>
          );
        }
        // Paragraphs that hold their own "• " lines (single newlines).
        if (p.includes('\n•')) {
          const [lead, ...items] = p.split('\n');
          return (
            <View key={i} style={styles.paragraphs}>
              <Text style={styles.body}>{lead}</Text>
              {items.map((item, j) => (
                <View key={j} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.body, styles.bulletText]}>{item.replace(BULLET, '')}</Text>
                </View>
              ))}
            </View>
          );
        }
        const m = p.match(LEAD_LABEL);
        return (
          <Text key={i} style={styles.body}>
            {m ? (
              <>
                <Text style={styles.lead}>{m[1]}:</Text> {p.slice(m[0].length)}
              </>
            ) : (
              p
            )}
          </Text>
        );
      })}
    </View>
  );
}

interface LegalLayoutProps {
  title: string;
  lastUpdated?: string;
  sections: LegalSection[];
}

/**
 * Shared modern layout for the legal pages: light header with "Last updated",
 * the first section as a soft-blue Summary card, then numbered sections in
 * white cards. Content comes unchanged from utils/legalContent.
 */
export function LegalLayout({ title, lastUpdated, sections }: LegalLayoutProps) {
  const insets = useSafeAreaInsets();
  const [summary, ...rest] = sections;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={title}
        subtitle={lastUpdated ? `Last updated ${lastUpdated}` : undefined}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {!!summary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHead}>
              <View style={styles.summaryIcon}>
                <Info size={18} color={PILL.blue.fg} />
              </View>
              <View style={styles.summaryHeadText}>
                <Text style={styles.summaryEyebrow}>Summary</Text>
                <Text style={styles.summaryTitle} accessibilityRole="header">
                  {summary.heading}
                </Text>
              </View>
            </View>
            <SectionBody body={summary.body} />
          </View>
        )}

        {rest.map((section, i) => (
          <View key={section.heading} style={styles.card}>
            <View style={styles.headingRow}>
              <View style={styles.number}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <Text style={styles.heading} accessibilityRole="header">
                {section.heading}
              </Text>
            </View>
            <SectionBody body={section.body} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    gap: ModernSize.gap,
  },

  // ── Summary ─────────────────────────────────────────────────────────────
  summaryCard: {
    padding: ModernSize.cardPad,
    gap: 12,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: SUMMARY_BORDER,
    backgroundColor: SUMMARY_BG,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  summaryHeadText: { flex: 1, gap: 1 },
  summaryEyebrow: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: PILL.blue.fg,
  },
  summaryTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Sections ────────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: 12,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
  },
  numberText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: PILL.blue.fg,
  },
  heading: {
    flex: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  paragraphs: { gap: 10 },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: BODY,
  },
  lead: {
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: MUTED,
  },
  bulletText: { flex: 1 },
});
