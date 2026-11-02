import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, LINK, ModernRadius, PAGE_BG, SOFT_FILL } from '@/utils/modernTheme';

export const STAR_COLOR = '#F5B301';

/** Review avatar circle colours, alternating (blue, lavender). */
export const AVATAR_COLORS = [
  { bg: '#E0E7FF', fg: '#3730A3' },
  { bg: '#EDE9FE', fg: '#6D28D9' },
];

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // Header actions
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerBtn: {
    width: 46,
    height: 42,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEF6',
  },

  // Cover + identity
  cover: {
    width: '100%',
    height: 190,
    borderRadius: ModernRadius.card,
    backgroundColor: SOFT_FILL,
  },
  coverEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Color.border,
  },
  coverEmptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  identity: {
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: FontSize.xl + 2,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EEF1F8',
  },
  categoryText: {
    fontSize: FontSize.xs + 1,
    color: '#4F5D8A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  ratingCount: {
    fontSize: FontSize.md,
    color: INK,
  },
  mutedText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Blocked banner
  banner: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
    borderRadius: ModernRadius.box,
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F7C9C9',
  },
  bannerMain: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#991B1B',
  },
  bannerText: {
    fontSize: FontSize.sm,
    color: '#7F1D1D',
    lineHeight: FontSize.sm * 1.4,
  },

  // Sections
  section: {
    gap: Spacing.sm + 4,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FontSize.lg + 2,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // Manage grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm + 4,
  },
  tile: {
    width: '48.5%',
    height: 96,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
  },
  tileText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // About
  aboutText: {
    fontSize: FontSize.md,
    color: INK,
    lineHeight: FontSize.md * 1.45,
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
  },

  // Contact
  contactRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactIcon: {
    width: 28,
    paddingTop: Spacing.sm + 2,
    alignItems: 'center',
  },
  contactMain: {
    flex: 1,
    gap: 2,
    paddingVertical: Spacing.sm,
  },
  contactDivider: {
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER,
  },
  contactLabel: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  contactValue: {
    fontSize: FontSize.md,
    color: INK,
    lineHeight: FontSize.md * 1.35,
  },

  // Reviews
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  halfStar: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER,
  },
  reviewSummaryValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  reviewSummaryCount: {
    fontSize: FontSize.md,
    color: INK,
  },
  reviewEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.xs,
  },
  reviewRowDivider: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    paddingTop: Spacing.sm + 4,
  },
  reviewAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  reviewMain: {
    flex: 1,
    gap: 3,
  },
  reviewAuthor: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewTime: {
    fontSize: FontSize.xs + 1,
    color: Color.textSecondary,
  },
  reviewComment: {
    fontSize: FontSize.sm + 1,
    color: INK,
    lineHeight: (FontSize.sm + 1) * 1.4,
  },
});
