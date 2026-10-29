import React from 'react';
import { Text, View } from 'react-native';

import { CATEGORIES, ORGANISED_TILES } from './slides';
import { SlideVisual as SlideVisualKind } from './types';
import { styles, categoryTints } from './styles';

/**
 * The illustration for a slide. Glass tiles on ink, built from typography and
 * Views — this app has no icon or SVG library, and adding one would mean a
 * native rebuild.
 */
export function SlideVisual({ kind }: { kind: SlideVisualKind }) {
  if (kind === 'categories') {
    return (
      <View style={styles.categoryWrap}>
        {CATEGORIES.map((c) => (
          <View key={c.name} style={styles.categoryCard}>
            <View style={[styles.categoryBadge, categoryTints[c.tint]]}>
              <Text style={styles.categoryInitial}>{c.name[0]}</Text>
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
              {c.name}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (kind === 'assistant') {
    return (
      <View style={styles.assistant}>
        <Text style={styles.assistantLabel}>You</Text>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            “Book a dentist tomorrow at 10 and pay from my card.”
          </Text>
        </View>

        <Text style={[styles.assistantLabel, styles.assistantLabelRight]}>DNX</Text>
        <View style={[styles.bubble, styles.bubbleReply]}>
          <Text style={styles.bubbleText}>Dr. Mehta, 10:00 AM — confirmed.</Text>
          <View style={styles.replyMetaRow}>
            <View style={styles.dot} />
            <Text style={styles.replyMeta}>Paid · Added to your calendar</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tileWrap}>
      {ORGANISED_TILES.map((t) => (
        <View key={t.label} style={[styles.tile, t.wide ? styles.tileWide : styles.tileSmall]}>
          <Text style={styles.tileLabel}>{t.label}</Text>
          <Text style={styles.tileBody}>{t.body}</Text>
        </View>
      ))}
    </View>
  );
}
