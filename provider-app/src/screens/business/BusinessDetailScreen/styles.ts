import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },

  hero: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  heroTop: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Color.divider,
  },
  heroMain: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    flexShrink: 1,
  },
  heroCategory: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  heroNoRating: {
    fontSize: FontSize.xs,
    color: Color.placeholder,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.warning,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Color.errorSoft,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
  },
  bannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Color.error,
    lineHeight: FontSize.sm * 1.4,
  },

  sectionGroup: {
    gap: Spacing.xs,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionAction: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  sectionCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm + 2,
    gap: Spacing.sm,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contactIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  contactText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Color.textPrimary,
  },
  contactTextMuted: {
    color: Color.placeholder,
    fontStyle: 'italic',
  },
  aboutText: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
  aboutToggle: {
    marginTop: 4,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },

  reviewSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  reviewSummaryValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  reviewSummaryMeta: {
    gap: 2,
  },
  reviewSummaryCount: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  reviewEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  reviewRowFirst: {
    borderTopWidth: 0,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.accentSoft,
  },
  reviewAvatarText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.accent2,
  },
  reviewMain: {
    flex: 1,
    gap: 2,
  },
  reviewAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  reviewAuthor: {
    flexShrink: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  reviewComment: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  menuTile: {
    flexBasis: '31%',
    flexGrow: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  menuTileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  menuTileText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    textAlign: 'center',
  },
});
