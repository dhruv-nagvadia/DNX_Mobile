import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
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
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
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
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: ModernRadius.pill,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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

  // Cards
  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    gap: Spacing.sm + 4,
    ...CARD_SHADOW,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  cardTitleSm: {
    flexShrink: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  body: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  muted: {
    flexShrink: 1,
    fontSize: FontSize.sm,
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
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontSize: FontSize.sm,
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
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // Cancelled / no-show note
  closedNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  closedTitleRed: {
    color: PILL.red.fg,
  },
  closedReason: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Appointment / service
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  serviceIconBox: {
    width: 64,
    height: 64,
    borderRadius: ModernRadius.box,
    backgroundColor: PILL.lavender.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  servicePrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // Home visit
  visitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 4,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: PRIMARY_BLUE,
  },
  mapsBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: PRIMARY_BLUE,
  },

  // Customer
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PILL.blue.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: PRIMARY_BLUE,
  },
  customerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  customerPhone: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  contactBtn: {
    width: 48,
    height: 44,
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
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  payRows: {
    marginLeft: 24 + Spacing.sm + 4,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  payLabel: {
    fontSize: FontSize.sm,
    color: INK,
  },
  payValue: {
    fontSize: FontSize.sm,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: PRIMARY_BLUE,
  },
  payPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
  },
  payPillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },

  // Activity timeline
  timeline: {
    paddingLeft: Spacing.xs,
  },
  tlRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  tlRail: {
    width: 24,
    alignItems: 'center',
  },
  tlDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: FontSize.md,
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
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Sticky action bar
  bar: {
    backgroundColor: Color.white,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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
    minHeight: 50,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  barCaption: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
