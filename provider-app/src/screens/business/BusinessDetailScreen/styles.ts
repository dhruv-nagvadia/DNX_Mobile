import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, LINK, ModernRadius, ModernSize, ModernType, PAGE_BG, SOFT_FILL } from '@/utils/modernTheme';

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
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap + 4,
  },

  // Header actions
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEF6',
  },

  // Cover + identity
  cover: {
    width: '100%',
    height: 176,
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
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },
  identity: {
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
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
    fontSize: ModernType.caption,
    color: '#4F5D8A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  ratingCount: {
    fontSize: ModernType.body,
    color: INK,
  },
  mutedText: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // Blocked banner
  banner: {
    flexDirection: 'row',
    gap: ModernSize.gap,
    padding: ModernSize.cardPad,
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
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: '#991B1B',
  },
  bannerText: {
    fontSize: ModernType.body,
    color: '#7F1D1D',
    lineHeight: 20,
  },

  // Sections
  section: {
    gap: ModernSize.gap,
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
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // Manage grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: ModernSize.gap,
  },
  tile: {
    width: '48.5%',
    height: 84,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
  },
  tileText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // About
  aboutText: {
    fontSize: ModernType.body,
    color: INK,
    lineHeight: 20,
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
    width: 24,
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
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  contactValue: {
    fontSize: ModernType.body,
    color: INK,
    lineHeight: 20,
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
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  reviewSummaryCount: {
    fontSize: ModernType.body,
    color: INK,
  },
  reviewEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: ModernSize.gap,
    paddingVertical: Spacing.xs,
  },
  reviewRowDivider: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    paddingTop: ModernSize.gap,
  },
  reviewAvatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernSize.avatar / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
  },
  reviewMain: {
    flex: 1,
    gap: 3,
  },
  reviewAuthor: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewTime: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  reviewComment: {
    fontSize: ModernType.body,
    color: INK,
    lineHeight: 20,
  },
});
