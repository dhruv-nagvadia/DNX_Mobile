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

/** Bright blue for the primary call to action, per the Booking Details mockup. */
const PRIMARY_BLUE = LINK; // #1D4ED8
const DUE_FILL = '#DCE8FB';
const STEP_GREY = '#AEB7C6';

/**
 * Booking Details ("Salon Booking Details App Screen.png"): light header,
 * white 16px cards with soft shadows, a progress stepper, payment breakdown,
 * activity timeline and a sticky action bar.
 */
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    paddingVertical: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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

  // Cards
  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    ...CARD_SHADOW,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  cardTitleSm: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  body: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },
  muted: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },

  // Stepper
  stepperCard: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  stepsRow: {
    flexDirection: 'row',
  },
  step: {
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
    backgroundColor: STEP_GREY,
  },
  stepLineDone: {
    backgroundColor: PRIMARY_BLUE,
  },
  stepLineHidden: {
    backgroundColor: 'transparent',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: STEP_GREY,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  stepLabel: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  stepLabelDone: {
    color: INK,
  },
  stepLabelCurrent: {
    color: PRIMARY_BLUE,
    fontWeight: FontWeight.bold,
  },
  stepCaption: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // Cancelled / no-show note
  closedNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
    padding: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
  },
  closedNoteGrey: {
    backgroundColor: SOFT_FILL,
    borderColor: CARD_BORDER,
  },
  closedNoteRed: {
    backgroundColor: PILL.red.bg,
    borderColor: Color.errorBorder,
  },
  closedTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  closedTitleRed: {
    color: PILL.red.fg,
  },
  closedReason: {
    marginTop: 2,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  // Appointment / service
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: ModernRadius.box,
    backgroundColor: PILL.lavender.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  servicePrice: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // Home visit
  visitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: PRIMARY_BLUE,
    minHeight: ModernSize.controlSm,
  },
  mapsBtnText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: PRIMARY_BLUE,
  },

  // Customer
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  avatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernSize.avatar / 2,
    backgroundColor: PILL.blue.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: PRIMARY_BLUE,
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
  contactBtn: {
    width: 40,
    height: ModernSize.controlSm,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Payment
  methodChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
    backgroundColor: SOFT_FILL,
  },
  methodChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  payRows: {
    marginLeft: 20 + Spacing.sm + 2,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  payLabel: {
    fontSize: ModernType.body,
    color: INK,
  },
  payValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  payValueGreen: {
    color: PILL.green.fg,
  },
  dueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: -Spacing.sm,
    marginTop: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.box - 4,
    backgroundColor: DUE_FILL,
  },
  dueText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: PRIMARY_BLUE,
  },
  payPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
  },
  payPillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
  },

  // Activity timeline
  timeline: {
    paddingLeft: Spacing.xs,
  },
  tlRow: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  tlRail: {
    width: 24,
    alignItems: 'center',
  },
  tlDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: STEP_GREY,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tlDotDone: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  tlDotClosed: {
    backgroundColor: Color.error,
    borderColor: Color.error,
  },
  tlLine: {
    flex: 1,
    width: 2,
    minHeight: 12,
    backgroundColor: CARD_BORDER,
  },
  tlBody: {
    flex: 1,
    paddingBottom: Spacing.md,
    gap: 2,
  },
  tlBodyLast: {
    paddingBottom: 0,
  },
  tlTitle: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  tlTitlePending: {
    fontWeight: FontWeight.regular,
    color: Color.textSecondary,
  },
  tlTitleClosed: {
    color: Color.error,
  },
  tlTime: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // Sticky action bar
  bar: {
    backgroundColor: Color.white,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: ModernSize.gap,
    gap: Spacing.sm + 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  barRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: ModernSize.control,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
  },
  btnPrimary: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  btnDanger: {
    backgroundColor: Color.white,
    borderColor: Color.error,
  },
  btnNeutral: {
    backgroundColor: Color.white,
    borderColor: INK,
  },
  btnCollect: {
    backgroundColor: Color.white,
    borderColor: PILL.green.fg,
  },
  btnDisabled: {
    borderColor: CARD_BORDER,
  },
  btnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
  },
  barCaption: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
