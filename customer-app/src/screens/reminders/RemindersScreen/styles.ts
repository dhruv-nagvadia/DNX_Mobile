import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

const G = ModernSize.gutter;
const BLUE = '#1D4ED8';
const NAVY = '#1E3A8A';

/** Colours the components pass to icons. */
export const COLORS = {
  ink: INK,
  link: LINK,
  muted: '#64748B',
  white: Color.white,
  red: '#DC2626',
  amber: '#D97706',
  green: '#16A34A',
};

/** Mockup "designs/customer/mobile/DNX Reminders App Interface.png" (left frame). */
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  fill: { width: '100%', height: '100%' },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: G,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerText: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 28,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.6,
    color: INK,
  },
  subtitle: {
    marginTop: 2,
    fontSize: ModernType.body,
    color: COLORS.muted,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: BLUE,
    ...CARD_SHADOW,
  },
  addBtnText: {
    color: Color.white,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
  },

  content: { paddingHorizontal: G, paddingBottom: 32 },

  // ── Stat tiles ──────────────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: 10 },
  statTile: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statValue: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  statLabel: {
    marginTop: 2,
    marginLeft: 30,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
  },
  statLabelRed: { color: PILL.red.fg },
  statLabelAmber: { color: PILL.yellow.fg },
  statLabelBlue: { color: INK },

  // ── Filter chips ────────────────────────────────────────────────────────
  chipsScroll: { marginHorizontal: -G, marginTop: 14 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: G },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: { borderColor: NAVY, backgroundColor: NAVY },
  chipText: { fontSize: ModernType.body, fontWeight: FontWeight.medium, color: INK },
  chipTextActive: { color: Color.white, fontWeight: FontWeight.semibold },
  noMatch: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: COLORS.muted,
  },

  // ── Section headers ─────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotRed: { backgroundColor: COLORS.red },
  dotAmber: { backgroundColor: '#F59E0B' },
  dotBlue: { backgroundColor: BLUE },
  dotGrey: { backgroundColor: '#94A3B8' },
  sectionTitle: {
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionTitleFlex: { flex: 1 },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  group: {
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER },
  accentRed: { borderLeftWidth: 3, borderLeftColor: COLORS.red },
  accentAmber: { borderLeftWidth: 3, borderLeftColor: '#F59E0B' },

  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileSm: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  cardTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  due: { fontSize: ModernType.secondary },
  dueRed: { color: COLORS.red, fontWeight: FontWeight.medium },
  dueAmber: { color: COLORS.amber, fontWeight: FontWeight.medium },
  dueBlue: { color: '#475569' },
  dueMuted: { color: COLORS.muted },

  repeatChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: SOFT_FILL,
  },
  repeatText: { fontSize: ModernType.caption, fontWeight: FontWeight.medium, color: INK },

  // ── Linked business ─────────────────────────────────────────────────────
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  bizChip: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 3,
    paddingRight: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: SOFT_FILL,
  },
  bizAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  bizName: {
    flexShrink: 1,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  bookText: { fontSize: ModernType.caption, fontWeight: FontWeight.semibold, color: LINK },

  // ── Actions / outcome ───────────────────────────────────────────────────
  actionsRow: { flexDirection: 'row', gap: 10 },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  roundBtnDone: { borderColor: COLORS.green },
  roundBtnMissed: { borderColor: COLORS.red },
  outcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  outcomeDone: { backgroundColor: PILL.green.bg },
  outcomeMissed: { backgroundColor: PILL.red.bg },
  outcomeText: { fontSize: ModernType.secondary, fontWeight: FontWeight.semibold },
  outcomeTextDone: { color: PILL.green.fg },
  outcomeTextMissed: { color: PILL.red.fg },

  // ── Loading / empty ─────────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
  },
  emptyTitle: { marginTop: 4, fontSize: 18, fontWeight: FontWeight.bold, color: INK },
  emptyText: { fontSize: ModernType.body, textAlign: 'center', color: COLORS.muted },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    height: ModernSize.control,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  emptyBtnText: { color: Color.white, fontSize: ModernType.rowTitle, fontWeight: FontWeight.bold },
  showAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    marginTop: 8,
  },
  showAllText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
});
