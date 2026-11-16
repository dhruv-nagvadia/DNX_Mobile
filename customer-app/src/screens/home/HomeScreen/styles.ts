import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';
import { CARD_SHADOW, INK, LINK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

/**
 * Mockup "designs/customer/mobile/user_dashboard.png". Rails are sized from
 * the screen width in HomeScreen (2-up offers, 3-up stores, 4-up photo rows),
 * these styles carry the look.
 */
const G = ModernSize.gutter;
/** Gap between cards in every grid / rail. */
export const GAP = 10;
const MUTED = Color.textSecondary;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: G,
    paddingTop: 6,
    paddingBottom: 28,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  // Horizontal rails run edge-to-edge while their first card lines up with the gutter.
  bleed: {
    marginHorizontal: -G,
  },
  hRow: {
    paddingHorizontal: G,
    gap: GAP,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  locationBtn: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  locationText: {
    flexShrink: 1,
    minWidth: 0,
  },
  locationLabel: {
    fontSize: 12,
    color: MUTED,
  },
  locationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationValue: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  brand: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: '#1D4ED8',
  },
  // Hugs its content (DNX · bell · avatar) so the address gets the rest of the row.
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginLeft: 10,
  },
  iconBtn: {
    padding: 2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Color.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PILL.blue.bg,
    borderWidth: 2,
    borderColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // ── Greeting + search ───────────────────────────────────────────────────
  greeting: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    color: INK,
  },
  greetingSub: {
    marginTop: 2,
    fontSize: 15,
    color: '#475569',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
  },

  // ── Hero carousel (kept exactly as the original design) ───────────────
  heroScroll: {
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
  },
  heroCard: {
    height: 170,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Color.primary,
    ...Shadow.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTextLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '48%',
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  heroTextBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  heroHeadline: {
    color: Color.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    lineHeight: 24,
  },
  heroHeadlineDark: { color: Color.textPrimary },
  heroSubtitle: {
    marginTop: 6,
    color: Color.onDarkMuted,
    fontSize: FontSize.xs,
    lineHeight: 16,
  },
  heroSubtitleBold: { fontWeight: FontWeight.semibold },
  heroSubtitleDark: { color: Color.textSecondary, marginTop: 2, textAlign: 'center' },
  heroDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Color.border,
  },
  heroDotActive: {
    width: 16,
    backgroundColor: Color.primary,
  },

  // ── Section heads ───────────────────────────────────────────────────────
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: '#1D4ED8',
  },
  scopeText: {
    marginTop: -6,
    marginBottom: 10,
    fontSize: 12,
    color: MUTED,
  },

  // ── Offers ──────────────────────────────────────────────────────────────
  offerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  offerText: {
    flex: 1,
    minWidth: 0,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  offerSub: {
    marginTop: 1,
    fontSize: 12,
    color: MUTED,
  },
  dashRow: {
    flexDirection: 'row',
    gap: 3,
    height: 1.5,
    marginVertical: 9,
    overflow: 'hidden',
    opacity: 0.55,
  },
  dash: {
    width: 5,
    height: 1.5,
    borderRadius: 1,
  },
  offerCode: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  offerCodeText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Category grid ───────────────────────────────────────────────────────
  catTile: {
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  catName: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    color: INK,
  },

  // Popular services list (rows live in components/BusinessCards).
  list: {
    gap: 8,
  },

  // ── Recently viewed ─────────────────────────────────────────────────────
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  recentThumb: {
    width: 48,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },
  recentThumbIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  recentName: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
});
