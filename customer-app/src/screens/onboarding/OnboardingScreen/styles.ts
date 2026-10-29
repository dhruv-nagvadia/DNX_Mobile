import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

/** Badge tints for the category grid, so the set reads as variety. */
export const categoryTints = [
  { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' },
  { backgroundColor: '#FCE7F3', borderColor: '#FBCFE8' },
  { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' },
  { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  { backgroundColor: '#E0E7FF', borderColor: '#C7D2FE' },
  { backgroundColor: '#CFFAFE', borderColor: '#A5F3FC' },
];

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.ink,
    overflow: 'hidden',
  },

  // ── Header ────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: Color.ink,
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },
  wordmark: {
    color: Color.onDark,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  skip: {
    color: Color.onDarkMuted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  // ── Pager ─────────────────────────────────────────────────────────
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  visual: {
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  copy: {
    gap: Spacing.md,
  },
  title: {
    color: Color.onDark,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxl * 1.22,
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: Color.accent,
  },
  body: {
    color: Color.onDarkMuted,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.55,
  },

  // ── Slide 1: category grid ────────────────────────────────────────
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm + 2,
  },
  categoryCard: {
    // Three per row, accounting for the two gaps between them.
    width: '31%',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.glassBorder,
    backgroundColor: Color.glass,
  },
  categoryBadge: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInitial: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.primaryDark,
  },
  categoryName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.onDark,
  },

  // ── Slide 2: assistant conversation ───────────────────────────────
  assistant: {
    gap: Spacing.xs,
  },
  assistantLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Color.onDarkFaint,
    marginBottom: 2,
  },
  assistantLabelRight: {
    marginTop: Spacing.md,
    color: Color.accent,
    textAlign: 'right',
  },
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '88%',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: Color.glassBorder,
    backgroundColor: Color.glass,
  },
  bubbleReply: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: 6,
    borderColor: Color.accentSoft,
    backgroundColor: Color.accentSoft,
    gap: Spacing.sm,
  },
  bubbleText: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.42,
    fontWeight: FontWeight.medium,
    color: Color.onDark,
  },
  replyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  replyMeta: {
    fontSize: FontSize.sm,
    color: Color.onDarkMuted,
  },

  // ── Slide 3: mixed-size tiles ─────────────────────────────────────
  tileWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm + 2,
  },
  tile: {
    gap: 6,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.glassBorder,
    backgroundColor: Color.glass,
  },
  tileWide: {
    width: '100%',
  },
  tileSmall: {
    // Two per row, accounting for the gap between them.
    width: '48%',
  },
  tileLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.2,
    color: Color.onDark,
  },
  tileBody: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    color: Color.onDarkMuted,
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dotBase: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Color.glassBorder,
  },
  dotActive: {
    width: 22,
    backgroundColor: Color.accent,
  },
  cta: {
    width: '100%',
  },
});
