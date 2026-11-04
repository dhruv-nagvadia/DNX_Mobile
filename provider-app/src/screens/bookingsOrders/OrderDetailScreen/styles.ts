import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

export const COLLECT_GREEN = PILL.green.fg;
const AVATAR_BG = '#E6EDFB';
const DUE_BG = '#DCE7FB';
const PENDING_GREY = '#9AA4B5';
const THUMB = 52;
const STEP_DOT = 30;
const TL_DOT = 22;

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
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md + 4,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 8,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
  },
  statusPillText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },

  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    gap: Spacing.sm + 4,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...CARD_SHADOW,
  },
  cardHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  cardTitle: {
    fontSize: FontSize.lg,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  stepLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  stepLabelActive: {
    color: LINK,
    fontWeight: FontWeight.bold,
  },
  stepCaption: {
    fontSize: FontSize.sm,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  endedTitleRed: {
    color: Color.error,
  },
  endedText: {
    fontSize: FontSize.sm,
    color: INK,
  },

  // Customer
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AVATAR_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: LINK,
  },
  customerMain: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  customerPhone: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  callBtn: {
    width: 52,
    height: 46,
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
    gap: Spacing.sm + 4,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  itemMeta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  itemTotal: {
    fontSize: FontSize.md,
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
    fontSize: FontSize.sm,
    color: INK,
  },
  totalValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  totalDiscount: {
    color: COLLECT_GREEN,
    fontWeight: FontWeight.semibold,
  },
  grandLabel: {
    fontSize: FontSize.md,
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
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // Customer note
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 4,
    padding: Spacing.sm + 4,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  noteMain: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  noteText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Payment
  payMethod: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
    flexShrink: 1,
  },
  methodChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  payPill: {
    marginLeft: Spacing.sm,
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  // Activity timeline
  timeline: {
    paddingLeft: Spacing.sm + 2,
  },
  tlRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 6,
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
    fontSize: FontSize.sm,
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
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  // Sticky actions
  actionBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    gap: Spacing.sm + 2,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    height: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: LINK,
  },
  primaryBtnText: {
    fontSize: FontSize.md,
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
    height: 50,
    paddingHorizontal: Spacing.sm,
    borderRadius: ModernRadius.button,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  outlineBtnTextCollect: {
    color: COLLECT_GREEN,
  },
  outlineBtnTextDanger: {
    color: Color.error,
  },
});
