import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // ── Header ───────────────────────────────────────────────────────────
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  locationPill: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: Spacing.sm,
  },
  locationLabel: {
    flexShrink: 0,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    marginRight: 2,
  },
  locationText: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  locationChevron: {
    flexShrink: 0,
  },
  headerRight: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bellBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: -7,
    right: -9,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 4,
    borderRadius: 11,
    backgroundColor: Color.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Color.surface,
  },
  bellBadgeText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Color.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },

  // ── Search ───────────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 54,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  searchText: { fontSize: FontSize.md, color: Color.placeholder },

  // ── Section heads ────────────────────────────────────────────────────
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  // Groups a title with an inline tag (e.g. "Shop by category" + "Products")
  // as one flex-shrinkable unit, so a sibling "View all" link stays pinned
  // right instead of a 3-way space-between squeezing awkwardly.
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  sectionLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  sectionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  sectionTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.primaryDark,
  },
  scopeBanner: {
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  scopeBannerText: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    fontStyle: 'italic',
  },

  // ── Store cards (horizontal) ─────────────────────────────────────────
  storeCard: {
    width: 150,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  storeThumb: {
    width: '100%',
    height: 84,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  storeThumbImg: { width: '100%', height: '100%' },
  storeName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  storeMeta: { marginTop: 2, fontSize: FontSize.xs, color: Color.textSecondary },
  storeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  storeRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  storeRatingText: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    fontWeight: FontWeight.semibold,
  },
  shopChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.primary,
  },
  shopChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.white },

  // ── Offers carousel ──────────────────────────────────────────────────
  hRow: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  offerCard: {
    width: 250,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  offerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
  },
  offerSub: {
    marginTop: 4,
    fontSize: FontSize.sm,
    color: Color.onDarkMuted,
  },
  offerTag: {
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Color.glassStrong,
  },
  offerTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.white,
    letterSpacing: 0.5,
  },

  // ── Most booked chips ────────────────────────────────────────────────
  chipsRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },

  // ── Top hero carousel ────────────────────────────────────────────────
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
  // Text over the quiet left third of a dark-background banner. Less padding
  // on the left (card edge) than the right (where the art starts), so the
  // text sits close to the edge instead of leaving a visible gap.
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
  // Text over the quiet bottom strip of a light-background banner — a fixed
  // height band (not just bottom-anchored) so it stays put, and no side
  // padding so the one-line headline has the full card width to fit in.
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
  // First/second banners — "lightly bold" details text, per feedback.
  heroSubtitleBold: { fontWeight: FontWeight.semibold },
  // Third banner — tighter gap under the headline, centered under it.
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

  // ── Most booked (business rows) ──────────────────────────────────────
  mbCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  mbAvatar: {
    width: 54,
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mbAvatarImg: { width: '100%', height: '100%' },
  mbInfo: { flex: 1, minWidth: 0 },
  mbName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  mbMeta: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  mbRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  mbRatingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },

  // ── Category grid ────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: Spacing.lg,
    columnGap: Spacing.sm,
  },
  catCard: { alignItems: 'center' },
  catTile: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Shadow.card,
  },
  catName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    textAlign: 'center',
  },

  // ── "Shop by product" — real-photo cards in a horizontal row. Same white
  // card + soft icon-tile look as every other card in the app (catTile,
  // StoreProductCard), just sized up for a bigger, richer photo. ──
  productCard: {
    width: 124,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    backgroundColor: Color.surface,
    ...Shadow.card,
  },
  productCardImageWrap: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  productCardImage: {
    width: '100%',
    height: '100%',
  },
  productCardName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    textAlign: 'center',
  },

  // ── Reminders ────────────────────────────────────────────────────────
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderInfo: { flex: 1, minWidth: 0 },
  reminderTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  reminderSub: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  reminderCta: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },

  // ── Recently viewed ──────────────────────────────────────────────────
  recentCard: {
    width: 168,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  recentName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  recentType: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  recentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  recentRatingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },

  // ── Booking card (conditional section) ───────────────────────────────
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  bookingIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingInfo: { flex: 1, minWidth: 0 },
  bookingName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  bookingMeta: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },

  // ── Trust strip ──────────────────────────────────────────────────────
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Color.primarySoft,
  },
  trustItem: { flex: 1, alignItems: 'center' },
  trustValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.primaryDark,
  },
  trustLabel: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Color.primary,
  },
  trustDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(30, 58, 138, 0.15)',
  },
});
