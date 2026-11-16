import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  SOFT_FILL,
} from '@/utils/modernTheme';

const AVATAR = 84;

/** Profile — matches "DNX Provider Profile Dashboard.png" (modern light look). */
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap,
  },
  pageTitle: {
    fontSize: ModernType.largeTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    marginLeft: 2,
  },

  // ── Hero card ────────────────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    paddingTop: Spacing.md + 4,
    paddingBottom: Spacing.md + 4,
    borderRadius: ModernRadius.card + 4,
    overflow: 'hidden',
    backgroundColor: '#0F2E7A',
    ...CARD_SHADOW,
  },
  editBtn: {
    position: 'absolute',
    top: Spacing.sm + 2,
    right: Spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 1,
  },
  editBtnText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  avatarWrap: {
    width: AVATAR,
    height: AVATAR,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 3,
    borderColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
  },
  avatarImage: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 3,
    borderColor: Color.white,
    backgroundColor: '#DBEAFE',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  avatarCameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
    borderWidth: 2,
    borderColor: Color.white,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
    paddingTop: Spacing.md,
  },
  heroName: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: Color.white,
    paddingRight: 64,
  },
  heroContact: {
    fontSize: ModernType.secondary,
    color: 'rgba(248, 250, 252, 0.88)',
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  avatarErrorText: {
    fontSize: ModernType.caption,
    color: Color.white,
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  // ── 2×2 stat tiles ───────────────────────────────────────────────────────
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm,
  },
  tile: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: Color.surface,
    ...CARD_SHADOW,
    minHeight: 76,
  },
  tileIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tileValue: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Menu cards ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: ModernSize.cardPad,
    paddingTop: ModernSize.gap,
    paddingBottom: Spacing.xs,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    marginBottom: 2,
  },
  logoutCard: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: ModernSize.cardPad,
    paddingVertical: 4,
    ...CARD_SHADOW,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  menuIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: ModernSize.rowMinHeight,
  },
  menuBodyDivided: {
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  menuItemText: {
    flex: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  menuItemTextDanger: {
    color: Color.error,
  },
  trailingPill: {
    alignSelf: 'center',
  },
  countBadge: {
    minWidth: 26,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  countBadgeText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.error,
  },
  unreadBadgeText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  deleteLink: {
    alignSelf: 'center',
    paddingVertical: 4,
    marginTop: 2,
  },
  deleteLinkText: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
    textDecorationLine: 'underline',
  },
  version: {
    textAlign: 'center',
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // ── Modals (light sheet) ─────────────────────────────────────────────────
  errorText: {
    fontSize: ModernType.secondary,
    color: Color.error,
  },
  sheetForm: {
    gap: Spacing.sm,
  },
  modalBody: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: Color.textSecondary,
  },
});
