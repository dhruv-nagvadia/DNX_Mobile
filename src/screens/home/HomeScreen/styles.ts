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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    marginRight: 2,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  greetingLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    fontWeight: FontWeight.medium,
  },
  name: {
    marginTop: 2,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: Color.textPrimary,
  },
  headerRight: {
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
    top: 9,
    right: 9,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Color.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Color.surface,
  },
  bellBadgeText: {
    color: Color.white,
    fontSize: 9,
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
    marginTop: Spacing.md,
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
  sectionLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

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

  // ── Top trust banner ─────────────────────────────────────────────────
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Color.primary,
    overflow: 'hidden',
  },
  trustBannerBody: {
    flex: 1,
  },
  trustBannerTitle: {
    color: Color.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  trustStatsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xl,
  },
  trustStat: {},
  trustStatValue: {
    color: Color.white,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  trustStatLabel: {
    marginTop: 2,
    color: Color.onDarkMuted,
    fontSize: FontSize.xs,
  },
  trustBannerIcon: {
    width: 54,
    height: 54,
    borderRadius: Radius.pill,
    backgroundColor: Color.glassStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
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
    justifyContent: 'space-between',
    rowGap: Spacing.lg,
  },
  catCard: { width: '22%', alignItems: 'center' },
  catTile: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
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
