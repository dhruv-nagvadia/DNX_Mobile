import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import {
  BellRing,
  CalendarDays,
  CircleCheck,
  Dumbbell,
  GraduationCap,
  Receipt,
  Scissors,
  Smile,
  Sparkles,
  Wrench,
} from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { PILL, TINT } from '@/utils/modernTheme';

import { CATEGORIES, ORGANISED_TILES } from './slides';
import { SlideVisual as SlideVisualKind } from './types';
import { CATEGORY_TONES, styles } from './styles';

type IconType = typeof Smile;

/** Icon per category on the first slide (matched by name from slides.ts). */
const CATEGORY_ICONS: Record<string, IconType> = {
  Dentist: Smile,
  Salon: Scissors,
  Gym: Dumbbell,
  Tutor: GraduationCap,
  Plumber: Wrench,
  Cleaning: Sparkles,
};

/** Icon + tone per tile on the third slide, in ORGANISED_TILES order. */
const TILE_ICONS: { icon: IconType; tone: { bg: string; fg: string } }[] = [
  { icon: CalendarDays, tone: PILL.blue },
  { icon: Receipt, tone: PILL.green },
  { icon: BellRing, tone: PILL.orange },
];

const BACKDROP: Record<SlideVisualKind, (typeof TINT)[keyof typeof TINT]> = {
  categories: TINT.blue,
  assistant: TINT.lavender,
  organised: TINT.mint,
};

/**
 * The illustration for a slide: a large pastel circle with white cards built
 * from icons and text on top — no bundled images.
 */
export function SlideVisual({ kind }: { kind: SlideVisualKind }) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - 48, 320);
  const tint = BACKDROP[kind];

  return (
    <View
      style={[styles.stage, { width: size, height: size }]}
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[
          styles.backdrop,
          { width: size, height: size, borderRadius: size / 2, borderColor: tint.border },
        ]}
      >
        <GradientBackground colors={tint.colors} />
      </View>

      {kind === 'categories' && (
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.name] ?? Sparkles;
            const tone = CATEGORY_TONES[c.tint % CATEGORY_TONES.length];
            return (
              <View key={c.name} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: tone.bg }]}>
                  <Icon size={20} color={tone.fg} />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {c.name}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {kind === 'assistant' && (
        <View style={styles.chat}>
          <View style={[styles.bubble, styles.bubbleMine]}>
            <Text style={styles.bubbleMineText}>
              “Book a dentist tomorrow at 10 and pay from my card.”
            </Text>
          </View>
          <View style={[styles.bubble, styles.bubbleReply]}>
            <View style={styles.replyHead}>
              <View style={styles.replyBadge}>
                <Sparkles size={14} color={PILL.lavender.fg} />
              </View>
              <Text style={styles.replyName}>DNX</Text>
            </View>
            <Text style={styles.bubbleText}>Dr. Mehta, 10:00 AM — confirmed.</Text>
            <View style={styles.replyMetaRow}>
              <CircleCheck size={14} color={PILL.green.fg} />
              <Text style={styles.replyMeta}>Paid · Added to your calendar</Text>
            </View>
          </View>
        </View>
      )}

      {kind === 'organised' && (
        <View style={styles.tileWrap}>
          {ORGANISED_TILES.map((t, i) => {
            const { icon: Icon, tone } = TILE_ICONS[i % TILE_ICONS.length];
            return (
              <View
                key={t.label}
                style={[styles.tile, t.wide ? styles.tileWide : styles.tileSmall]}
              >
                <View style={[styles.tileIcon, { backgroundColor: tone.bg }]}>
                  <Icon size={20} color={tone.fg} />
                </View>
                <Text style={styles.tileLabel}>{t.label}</Text>
                <Text style={styles.tileBody}>{t.body}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
