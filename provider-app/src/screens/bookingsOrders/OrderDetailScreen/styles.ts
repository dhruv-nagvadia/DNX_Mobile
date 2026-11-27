import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

export const COLLECT_GREEN = PILL.green.fg;
const AVATAR_BG = '#E6EDFB';
const DUE_BG = '#DCE7FB';
const PENDING_GREY = '#9AA4B5';
const THUMB = 44;
const STEP_DOT = 28;
const TL_DOT = 20;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  loader: {
    marginTop: Spacing.xl,
  },

  // Light header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
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
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
  },
  statusPillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },

  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    gap: ModernSize.gap,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: ModernSize.cardPad,
    gap: Spacing.sm,
    ...CARD_SHADOW,
  },
  cardHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // Stepper
  stepRow: {
    flexDirection: 'row',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stepTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: CARD_BORDER,
  },
  stepLineDone: {
    backgroundColor: LINK,
  },
  stepLineHidden: {
    backgroundColor: 'transparent',
  },
  stepDot: {
    width: STEP_DOT,
    height: STEP_DOT,
    borderRadius: STEP_DOT / 2,
    borderWidth: 2,
    borderColor: PENDING_GREY,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotFilled: {
    backgroundColor: LINK,
    borderColor: LINK,
  },
  stepNum: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  stepLabel: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  stepLabelActive: {
    color: LINK,
    fontWeight: FontWeight.bold,
  },
  stepCaption: {
    fontSize: ModernType.caption,
    color: INK,
    textAlign: 'center',
  },

  // Cancelled / no-show note (replaces the stepper)
  endedCardRed: {
    backgroundColor: Color.errorSoft,
    borderColor: '#F8C9C9',
    gap: 4,
  },
  endedCardGrey: {
    backgroundColor: SOFT_FILL,
    gap: 4,
  },
  endedTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  endedTitleRed: {
    color: Color.error,
  },
  endedText: {
    fontSize: ModernType.secondary,
    color: INK,
  },

  // Customer
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  avatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernSize.avatar / 2,
    backgroundColor: AVATAR_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: LINK,
  },
  customerMain: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  customerPhone: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  callBtn: {
    width: 40,
    height: ModernSize.controlSm,
    borderRadius: ModernRadius.box,
    borderWidth: 1.5,
    borderColor: LINK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Items
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingVertical: Spacing.xs + 2,
  },
  itemRowDivided: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  itemImage: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    backgroundColor: SOFT_FILL,
  },
  itemImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMain: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  itemMeta: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  itemTotal: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  totals: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    paddingTop: Spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalRowDivided: {
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  totalLabel: {
    fontSize: ModernType.body,
    color: INK,
  },
  totalValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  totalDiscount: {
    color: COLLECT_GREEN,
    fontWeight: FontWeight.semibold,
  },
  grandLabel: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  dueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginHorizontal: -6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: DUE_BG,
  },
  dueText: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // Customer note
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
    padding: ModernSize.gap,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  noteMain: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  noteText: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // Payment
  payMethod: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    flexShrink: 1,
  },
  methodChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  payPill: {
    marginLeft: Spacing.sm,
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  // Activity timeline
  timeline: {
    paddingLeft: Spacing.sm + 2,
  },
  tlRow: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  tlRail: {
    width: TL_DOT,
    alignItems: 'center',
  },
  tlDot: {
    width: TL_DOT,
    height: TL_DOT,
    borderRadius: TL_DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: {
    backgroundColor: LINK,
  },
  tlDotFailed: {
    backgroundColor: Color.error,
  },
  tlDotPending: {
    width: 18,
    height: 18,
    marginVertical: 2,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: PENDING_GREY,
    backgroundColor: Color.white,
  },
  tlLine: {
    flex: 1,
    width: 1.5,
    minHeight: 10,
    backgroundColor: CARD_BORDER,
  },
  tlBody: {
    flex: 1,
    paddingBottom: Spacing.sm + 4,
  },
  tlBodyLast: {
    paddingBottom: 0,
  },
  tlTitle: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
    lineHeight: TL_DOT,
  },
  tlTitlePending: {
    fontWeight: FontWeight.regular,
    color: Color.textSecondary,
  },
  tlTitleFailed: {
    color: Color.error,
  },
  tlTime: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // Sticky actions
  actionBar: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: ModernSize.gap,
    gap: Spacing.sm + 2,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    height: ModernSize.control,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: LINK,
  },
  primaryBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: ModernSize.control,
    paddingHorizontal: Spacing.sm,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1.5,
    backgroundColor: Color.white,
  },
  outlineBtnCollect: {
    borderColor: COLLECT_GREEN,
  },
  outlineBtnDanger: {
    borderColor: Color.error,
  },
  outlineBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
  },
  outlineBtnTextCollect: {
    color: COLLECT_GREEN,
  },
  outlineBtnTextDanger: {
    color: Color.error,
  },
});
