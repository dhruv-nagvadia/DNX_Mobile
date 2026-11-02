import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, PAGE_BG, PILL } from '@/utils/modernTheme';

export { INK, PAGE_BG, PILL };

/**
 * Local-only overrides for this screen's mockup-matched look
 * ("Modern Provider Dashboard App Interface.png"): light header, soft
 * shadows, 16px rounded cards, pastel-gradient stat tiles. Deliberately NOT
 * added to Theme.ts's global Radius/Shadow tokens — every other screen keeps
 * the flat/no-shadow convention, this is the one screen allowed to differ.
 */
const CARD_RADIUS = 16;
const BOX_RADIUS = 12;


// Money card — navy → deep navy, left to right.
export const HERO_GRADIENT = ['#22408F', '#162F6E', '#0E2154'];

/** Per-tile pastel gradient, border, icon and value colours (mockup order). */
export const TILE_THEMES = {
  today: { colors: ['#EEF4FF', '#DDE8FC'], border: '#D5E2FA', icon: '#2563EB', value: '#1E3A8A' },
  upcoming: { colors: ['#F4F1FF', '#E7E2FB'], border: '#E0DAF7', icon: '#4F46E5', value: '#312E81' },
  orders: { colors: ['#FFF9EE', '#FCEFDA'], border: '#F7E6C8', icon: '#D97706', value: INK },
  action: { colors: ['#FFF3F3', '#FCE1E1'], border: '#F8D4D4', icon: '#DC2626', value: '#B91C1C' },
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  statusSpacer: {
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // ── 1. Header ───────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingBottom: Spacing.xs,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Color.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerGreeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  bellBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Color.error,
    borderWidth: 2,
    borderColor: Color.white,
  },

  // ── 2. Quick cards ──────────────────────────────────────────────────────
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.white,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.sm + 6,
    paddingHorizontal: Spacing.sm + 4,
    ...CARD_SHADOW,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: BOX_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FA',
  },
  quickMain: {
    flex: 1,
    gap: 2,
  },
  quickLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  quickSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  // ── 3. Money card ───────────────────────────────────────────────────────
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.lg,
    minHeight: 150,
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  heroLeft: {
    gap: 6,
    // Leaves room for the bar chart on the right.
    marginRight: 150,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: 'rgba(248, 250, 252, 0.85)',
  },
  heroValue: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Color.onDark,
  },
  heroTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroTrendText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#4ADE80',
  },
  heroTrendDown: {
    color: '#F87171',
  },
  heroTrendLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Color.onDarkMuted,
  },
  heroBars: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  heroBar: {
    width: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(120, 150, 230, 0.35)',
  },

  // ── 4. Stat tiles ───────────────────────────────────────────────────────
  statGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statTile: {
    flex: 1,
    minWidth: 0,
    minHeight: 124,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.sm + 2,
    gap: Spacing.xs,
  },
  statTop: {
    gap: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
    lineHeight: FontSize.sm * 1.2,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
  },

  // ── 5. Section cards ────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  sectionHeaderOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm + 4,
  },
  sectionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    flexShrink: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.info,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
    backgroundColor: CARD_BORDER,
  },
  ctaLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
    marginTop: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  // ── Rows ────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: BOX_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  confirmIconBox: {
    backgroundColor: '#F1EEFF',
  },
  collectIconBox: {
    backgroundColor: '#FBF3E6',
  },
  rowThumb: {
    width: 48,
    height: 48,
  },
  timeBox: {
    width: 60,
    height: 52,
    borderRadius: BOX_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6EEFB',
  },
  timeBoxText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
    lineHeight: FontSize.sm * 1.25,
  },
  rowMain: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  rowSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowSubtitle: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  rowAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
