import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, ModernType, PAGE_BG, PILL } from '@/utils/modernTheme';

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
/** Header avatar — a step above the 40pt row avatar. */
const HEADER_AVATAR = 48;


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
    gap: ModernSize.gap,
  },

  // ── 1. Header ───────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingBottom: Spacing.xs,
  },
  avatarImage: {
    width: HEADER_AVATAR,
    height: HEADER_AVATAR,
    borderRadius: HEADER_AVATAR / 2,
    backgroundColor: Color.border,
  },
  avatar: {
    width: HEADER_AVATAR,
    height: HEADER_AVATAR,
    borderRadius: HEADER_AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  avatarText: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerGreeting: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  headerSubtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  bellBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
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
    gap: ModernSize.gap,
  },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.white,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.sm + 4,
    ...CARD_SHADOW,
  },
  quickIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
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
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  quickSubtitle: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // ── 3. Money card ───────────────────────────────────────────────────────
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.md + 4,
    minHeight: 136,
    justifyContent: 'center',
    // Solid base under the gradient — Android only draws elevation for a filled view.
    backgroundColor: '#0A1730',
    ...CARD_SHADOW,
  },
  heroLeft: {
    gap: 6,
    // Leaves room for the bar chart on the right.
    marginRight: 116,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLabel: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: 'rgba(248, 250, 252, 0.85)',
  },
  heroValue: {
    fontSize: ModernType.hero,
    fontWeight: FontWeight.extrabold,
    color: Color.onDark,
  },
  heroTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroTrendText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: '#4ADE80',
  },
  heroTrendDown: {
    color: '#F87171',
  },
  heroTrendLabel: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: Color.onDarkMuted,
  },
  heroBars: {
    position: 'absolute',
    right: Spacing.md + 4,
    bottom: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  heroBar: {
    width: 20,
    overflow: 'hidden',
    // Rounded top, nearly square bottom — same as the website's bars.
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  // ── 4. Stat tiles ───────────────────────────────────────────────────────
  statGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statTile: {
    flex: 1,
    minWidth: 0,
    // Grows past this when a label wraps to two lines.
    minHeight: 84,
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
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
    lineHeight: 15,
  },
  statValue: {
    fontSize: ModernType.stat,
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
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.info,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
    backgroundColor: CARD_BORDER,
  },
  ctaLink: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: Color.primary,
    marginTop: Spacing.xs,
  },
  emptyText: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  // ── Rows ────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    minHeight: ModernSize.rowMinHeight,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
  },
  rowIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
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
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
  },
  timeBox: {
    width: 52,
    height: 44,
    borderRadius: BOX_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6EEFB',
  },
  timeBoxText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
    lineHeight: 16,
  },
  rowMain: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  rowSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowSubtitle: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  rowAmount: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },
});
