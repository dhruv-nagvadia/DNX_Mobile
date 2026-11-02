import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';

/**
 * Local-only overrides for this screen's mockup-matched look (soft shadows,
 * larger rounded corners). Deliberately NOT added to Theme.ts's global
 * Radius/Shadow tokens — every other screen keeps the flat/no-shadow
 * convention, this is the one screen allowed to differ.
 */
// Matches the web dashboard's `--radius-xl` (6px) exactly — same hero/tile/
// card corner radius on both platforms.
const CARD_RADIUS = 6;
const TILE_RADIUS = 6;
// Revenue-card gradient — matches the web dashboard's `.revenueCard` exactly
// (shared palette spec: navy → mid navy → deep navy).
export const HERO_GRADIENT = ['#1E3A8A', '#102B65', '#0B1B3A'];
const CARD_SHADOW = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 2,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Color.primary,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Color.glass,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerGreeting: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Color.onDarkMuted,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.glassStrong,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Color.error,
    borderWidth: 1.5,
    borderColor: Color.primary,
  },

  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.white,
    borderRadius: TILE_RADIUS,
    padding: Spacing.sm + 2,
    ...CARD_SHADOW,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMain: {
    flex: 1,
    gap: 2,
  },
  quickLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  quickSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: CARD_RADIUS,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...CARD_SHADOW,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.onDarkMuted,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  heroLeft: {
    gap: 6,
    flexShrink: 1,
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
    fontWeight: FontWeight.semibold,
    // Matches the web dashboard's revenue-card trend color exactly.
    color: '#4ADE80',
  },
  heroTrendLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.onDarkMuted,
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statTile: {
    flexBasis: '48%',
    flexGrow: 1,
    borderRadius: TILE_RADIUS,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...CARD_SHADOW,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },

  sectionHeaderOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
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
    padding: Spacing.md,
  },

  card: {
    backgroundColor: Color.white,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: TILE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    width: 48,
    alignItems: 'center',
  },
  timeBadgeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.primary,
  },
  timeBadgeMeridiem: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  rowMain: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  rowSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  rowAmount: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
});
