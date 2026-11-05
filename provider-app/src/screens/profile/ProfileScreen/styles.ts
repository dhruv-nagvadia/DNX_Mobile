import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  PAGE_BG,
  SOFT_FILL,
} from '@/utils/modernTheme';

const AVATAR = 88;

/** Profile — matches "DNX Provider Profile Dashboard.png" (modern light look). */
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm + 4,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: FontWeight.extrabold,
    color: INK,
    marginLeft: 2,
  },

  // ── Hero card ────────────────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
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
    fontSize: FontSize.sm,
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
    fontSize: FontSize.xl,
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
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
    paddingRight: 64,
  },
  heroContact: {
    fontSize: FontSize.xs + 1,
    color: 'rgba(248, 250, 252, 0.88)',
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  avatarErrorText: {
    fontSize: FontSize.xs,
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
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tileValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Menu cards ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.xs,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
    marginBottom: 2,
  },
  logoutCard: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    ...CARD_SHADOW,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
  },
  menuBodyDivided: {
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  menuItemText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  menuItemTextDanger: {
    color: Color.error,
  },
  trailingPill: {
    alignSelf: 'center',
  },
  countBadge: {
    minWidth: 30,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  countBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.error,
  },
  unreadBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  deleteLink: {
    alignSelf: 'center',
    paddingVertical: 4,
    marginTop: 2,
  },
  deleteLinkText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textDecorationLine: 'underline',
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Modals (light sheet) ─────────────────────────────────────────────────
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Color.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: CARD_BORDER,
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
    marginBottom: Spacing.xs,
  },
  modalBody: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Color.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalButton: {
    flex: 1,
    borderRadius: ModernRadius.button,
  },
  primaryButton: {
    backgroundColor: LINK,
  },
  dangerButton: {
    backgroundColor: Color.error,
  },
});
