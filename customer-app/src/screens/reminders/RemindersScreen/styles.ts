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

/** Line between reminders inside a group — darker than the card border so rows read as separate. */
const DIVIDER = '#D3DAE6';

/** Width of the category icon square — extra lines under a row line up with the title. */
const ICON = 44;
const ICON_GAP = 12;

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

/** Reminders tab. Layout after "Modern Reminders App Dashboard.png", in the app's own colours. */
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

  // ── Summary tiles ───────────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: 10 },
  statTile: {
    flex: 1,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    // Solid base under the gradient — Android only draws elevation for a filled view.
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  statValue: {
    fontSize: ModernType.stat + 4,
    lineHeight: ModernType.stat + 8,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  statLabel: {
    marginTop: 6,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },
  statLabelRed: { color: PILL.red.fg },
  statLabelAmber: { color: PILL.yellow.fg },
  statLabelBlue: { color: INK },
  statValueRed: { color: PILL.red.fg },

  // ── Filter chips (with category icons) ──────────────────────────────────
  chipsScroll: { marginHorizontal: -G, marginTop: 14, flexGrow: 0 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: G, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  chipActive: { backgroundColor: NAVY },
  chipText: { fontSize: ModernType.body, fontWeight: FontWeight.medium, color: INK },
  chipTextActive: { color: Color.white, fontWeight: FontWeight.semibold },
  noMatch: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: COLORS.muted,
  },

  // ── Section headers: coloured bar + title (+ "Show all" link) ───────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  bar: { width: 4, height: 20, borderRadius: 2 },
  barRed: { backgroundColor: COLORS.red },
  barBlue: { backgroundColor: BLUE },
  sectionTitle: {
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionTitleFlex: { flex: 1 },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionLinkText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Group card + rows ───────────────────────────────────────────────────
  group: {
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: DIVIDER },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: ICON_GAP },
  // Lines under the main row (business, Done / Missed) line up with the title.
  rowExtra: { marginTop: 10, marginLeft: ICON + ICON_GAP },

  iconTile: {
    width: ICON,
    height: ICON,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileSm: {
    width: ICON,
    height: ICON,
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
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  repeatText: { fontSize: ModernType.caption, fontWeight: FontWeight.medium, color: INK },

  // ── Linked business ─────────────────────────────────────────────────────
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bizThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  bizName: {
    flex: 1,
    minWidth: 0,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  bookText: { fontSize: ModernType.caption, fontWeight: FontWeight.semibold, color: LINK },

  // ── Done / Missed buttons and the outcome pill ──────────────────────────
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    borderWidth: 1.4,
    backgroundColor: Color.white,
  },
  pillBtnDone: { borderColor: COLORS.green },
  pillBtnMissed: { borderColor: COLORS.red },
  pillBtnText: { fontSize: ModernType.secondary, fontWeight: FontWeight.semibold },
  outcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 14,
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
});
