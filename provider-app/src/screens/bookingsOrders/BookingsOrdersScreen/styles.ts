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
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Orders view ("Mobile Orders Dashboard UI.png") — active chip / primary
 * button blue matches the sibling catalog screens. */
export const COLLECT_GREEN = PILL.green.fg;
const AVATAR_BG = '#EEF1FB';
const THUMB = 40;

/** Bookings "In progress" tile — mint gradient with a teal icon. */
export const TEAL_TINT = {
  colors: ['#EEFBF8', '#DAF4EE'],
  border: '#C9ECE3',
  icon: PILL.teal.fg,
};

/**
 * Mockup look ("Salon Business Management App UI Collage.png" → Bookings):
 * light header, pill filter chips, white 16px cards with the customer name,
 * a status pill and inline 12px-radius action buttons.
 */
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },

  // Bookings / Orders segment (tab root only)
  segment: {
    flexDirection: 'row',
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.box,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: ModernRadius.box - 2,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.white,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  segmentText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: INK,
  },

  // Inline actions
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btnBusy: {
    opacity: 0.6,
  },
  // ── Orders view ─────────────────────────────────────────────────────────
  flex: {
    flex: 1,
  },
  ordersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  ordersContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: ModernSize.gap,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: ModernType.body,
    color: INK,
  },
  // Bleed the chip row to the screen edges so chips scroll off-screen.
  countChipsScroll: {
    marginHorizontal: -Spacing.md,
    flexGrow: 0,
  },
  countChips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    paddingVertical: 7,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  countChipActive: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  countChipText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  countChipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  countBadge: {
    minWidth: 22,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ModernRadius.pill,
    backgroundColor: SOFT_FILL,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  countBadgeText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  countBadgeTextActive: {
    color: Color.white,
  },

  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    // Title on top (full width), then icon + count on one line below it.
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: ModernSize.gap,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 76,
  },
  tileBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValue: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // Order card
  oCard: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    paddingHorizontal: ModernSize.cardPad,
    paddingTop: ModernSize.cardPad,
    paddingBottom: ModernSize.cardPad,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  oTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  oTopText: {
    flex: 1,
  },
  oId: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  oWhen: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
    marginTop: 1,
  },
  oPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
  },
  oPillShrink: {
    flexShrink: 1,
  },
  oPillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },
  oDivider: {
    height: 1,
    backgroundColor: CARD_BORDER,
    marginVertical: Spacing.sm + 2,
    opacity: 0.7,
  },
  oRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  oRowText: {
    flex: 1,
    gap: 1,
  },
  oAvatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AVATAR_BG,
  },
  oName: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  oMeta: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  oBusiness: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  oCallBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  oThumbs: {
    flexDirection: 'row',
  },
  oThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Color.white,
    backgroundColor: SOFT_FILL,
  },
  oThumbOverlap: {
    marginLeft: -8,
  },
  oThumbImg: {
    width: '100%',
    height: '100%',
  },
  oItems: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  oAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  oAmount: {
    flexShrink: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  oActions: {
    gap: Spacing.sm,
    marginTop: ModernSize.gap,
  },
  oBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: ModernSize.controlSm,
    paddingHorizontal: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  oBtnPrimary: {
    backgroundColor: LINK,
    borderColor: LINK,
  },
  oBtnDanger: {
    backgroundColor: Color.white,
    borderColor: Color.error,
  },
  oBtnCollect: {
    backgroundColor: Color.white,
    borderColor: COLLECT_GREEN,
  },
  oBtnText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
  },
  oBtnTextPrimary: {
    color: Color.white,
  },
  oBtnTextDanger: {
    color: Color.error,
  },
  oBtnTextCollect: {
    color: COLLECT_GREEN,
  },

  // Booking card ("Salon Bookings Management Dashboard.png") — reuses the
  // order card's o* layout and adds these bits.
  bCalIcon: {
    marginTop: 2,
  },
  bWhen: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bStatusCol: {
    alignItems: 'flex-end',
    gap: 4,
    maxWidth: '45%',
  },
  bStarted: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  bPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  bPayPill: {
    alignSelf: 'flex-start',
  },
  bPillText: {
    flexShrink: 1,
  },
  bDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bServiceBox: {
    backgroundColor: PILL.lavender.bg,
  },
  bPrice: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bCallBtn: {
    borderColor: LINK,
  },
  bBtnNeutral: {
    backgroundColor: Color.white,
    borderColor: INK,
  },
  bBtnTextNeutral: {
    color: INK,
  },
  bBtnDisabled: {
    opacity: 0.45,
  },
});
