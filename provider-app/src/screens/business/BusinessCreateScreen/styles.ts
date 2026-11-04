import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PILL, PillColors, SOFT_FILL } from '@/utils/modernTheme';

/** Mockup "Mobile Business Onboarding Flow.png": light header with a slim
 * 5-segment progress bar, white cards, sticky Back / Continue footer.
 * Header/footer mirror BusinessHoursScreen / BusinessPhotosScreen. */
export const BRAND_BLUE = '#1D4ED8';
export const SOFT_BLUE = '#EEF4FF';
export const TRACK = '#E2E7EF';
export const SWITCH_TRACK = { true: BRAND_BLUE, false: TRACK };
export const SUCCESS_GREEN = PILL.green.fg;
/** Solid blue "★ Cover" tag, as on the Photos screen. */
export const COVER_PILL: PillColors = { bg: BRAND_BLUE, fg: Color.white };

const INFO_BG = '#EAF0FC';
const ADD_BG = '#F5F8FE';
const ADD_BORDER = '#BCD0F5';
const SUCCESS_SOFT = '#E3F8EA';
const CONFETTI_GREEN = '#16A34A';
const CONFETTI_YELLOW = '#EAB308';
const CONFETTI_OLIVE = '#84A11B';
const INPUT_HEIGHT = 52;
const CHECK_CIRCLE = 116;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.white,
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 6,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm + 4,
    backgroundColor: Color.white,
  },
  headerBtn: {
    paddingTop: 4,
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
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: Spacing.md + 4,
    paddingBottom: Spacing.sm,
  },
  progressSeg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK,
  },
  progressSegOn: {
    backgroundColor: BRAND_BLUE,
  },

  // ── Content ─────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm + 2,
  },
  stepTitle: {
    fontSize: FontSize.xl + 2,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.4,
  },
  optionalPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stepSubtitle: {
    marginTop: -Spacing.sm,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.4,
    color: Color.textSecondary,
  },
  sectionTitle: {
    marginTop: Spacing.xs,
    fontSize: FontSize.lg + 1,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  fieldError: {
    marginTop: -Spacing.sm,
    fontSize: FontSize.xs,
    color: Color.error,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Step 1: type cards ──────────────────────────────────────────────────
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.md,
    borderRadius: ModernRadius.card,
    borderWidth: 1.5,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  typeCardOn: {
    borderColor: BRAND_BLUE,
    backgroundColor: SOFT_BLUE,
  },
  typeBody: {
    flex: 1,
    gap: 2,
  },
  typeTitle: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  typeSub: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  checkBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_BLUE,
  },
  checkBadgeSmall: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_BLUE,
  },

  // ── Step 1: category grid ───────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm + 2,
  },
  gridSpacer: {
    width: '31.5%',
  },
  tile: {
    width: '31.5%',
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: Spacing.sm + 4,
    borderRadius: ModernRadius.box + 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileOn: {
    borderWidth: 2,
    borderColor: BRAND_BLUE,
  },
  tileLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
    textAlign: 'center',
  },

  // ── Step 1: specific type chips ─────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipOn: {
    borderColor: BRAND_BLUE,
    backgroundColor: BRAND_BLUE,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextOn: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },

  // ── Fields ──────────────────────────────────────────────────────────────
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  required: {
    color: Color.error,
  },
  labelHint: {
    fontWeight: FontWeight.regular,
    color: Color.textSecondary,
  },
  input: {
    minHeight: INPUT_HEIGHT,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    fontSize: FontSize.md,
    color: INK,
  },
  inputError: {
    borderColor: Color.error,
  },
  inputMultiline: {
    minHeight: 128,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: -2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  inlineError: {
    fontSize: FontSize.xs,
    color: Color.error,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    minWidth: 92,
    height: INPUT_HEIGHT,
    paddingHorizontal: 14,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  prefixText: {
    fontSize: FontSize.md,
    color: INK,
  },
  pairRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  // "Pin your location" card (current-location button + saved pill).
  pinCard: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    gap: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  pinCardHead: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  pinCardText: {
    flex: 1,
    gap: 2,
  },
  pinCardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  pinCardSub: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  locateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 46,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: LINK,
  },
  locateBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  locationSaved: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.green.bg,
  },
  locationSavedText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  pinField: {
    flex: 1,
  },
  // Green "✓ Ahmedabad, Gujarat" chip — the India Post match for the PIN.
  pinMatch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.box,
    backgroundColor: PILL.green.bg,
  },
  pinMatchText: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },

  // ── Step 3: payment cards ───────────────────────────────────────────────
  payCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md - 2,
    padding: Spacing.md,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  payIcon: {
    paddingTop: 2,
  },
  payBody: {
    flex: 1,
    gap: 4,
  },
  payTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  payTitle: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  payDesc: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    color: Color.textSecondary,
  },
  alwaysOnPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: Spacing.sm,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 56,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperValue: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 46,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: CARD_BORDER,
  },
  stepperHelp: {
    marginTop: 4,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    color: Color.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
    borderRadius: ModernRadius.box,
    backgroundColor: INFO_BG,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.35,
    color: INK,
  },

  // ── Step 4: photos ──────────────────────────────────────────────────────
  usageStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: ModernRadius.box,
    backgroundColor: INFO_BG,
  },
  usageText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: BRAND_BLUE,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md - 2,
  },
  photoTile: {
    width: '48.5%',
    aspectRatio: 1,
    borderRadius: ModernRadius.box + 2,
    overflow: 'hidden',
    backgroundColor: Color.divider,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  coverPill: {
    position: 'absolute',
    top: Spacing.sm + 2,
    left: Spacing.sm + 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  removeBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: ADD_BORDER,
    backgroundColor: ADD_BG,
  },
  addText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.sm + 6,
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  footerStack: {
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.sm + 6,
    backgroundColor: Color.white,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  backBtn: {
    minWidth: 130,
  },
  outlineText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  primaryBtnFull: {
    flex: 0,
    alignSelf: 'stretch',
  },
  primaryBtnBusy: {
    opacity: 0.8,
  },
  primaryText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Done ────────────────────────────────────────────────────────────────
  doneContent: {
    alignItems: 'stretch',
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  celebrate: {
    alignSelf: 'center',
    width: CHECK_CIRCLE + 96,
    height: CHECK_CIRCLE + 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: CHECK_CIRCLE,
    height: CHECK_CIRCLE,
    borderRadius: CHECK_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SUCCESS_SOFT,
  },
  dash: {
    position: 'absolute',
    width: 14,
    height: 4,
    borderRadius: 2,
  },
  dashA: {
    top: 18,
    left: 34,
    backgroundColor: CONFETTI_OLIVE,
    transform: [{ rotate: '40deg' }],
  },
  dashB: {
    top: 54,
    left: 10,
    backgroundColor: CONFETTI_GREEN,
    transform: [{ rotate: '15deg' }],
  },
  dashC: {
    bottom: 26,
    left: 30,
    backgroundColor: CONFETTI_YELLOW,
    transform: [{ rotate: '-30deg' }],
  },
  dashD: {
    top: 16,
    right: 36,
    backgroundColor: CONFETTI_GREEN,
    transform: [{ rotate: '-40deg' }],
  },
  dashE: {
    top: 52,
    right: 8,
    backgroundColor: CONFETTI_YELLOW,
    transform: [{ rotate: '-15deg' }],
  },
  dashF: {
    bottom: 30,
    right: 30,
    backgroundColor: CONFETTI_GREEN,
    transform: [{ rotate: '30deg' }],
  },
  doneTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  statusPill: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  doneSub: {
    marginTop: Spacing.xs,
    fontSize: FontSize.md,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  nextBody: {
    flex: 1,
    gap: 2,
  },
  nextTitle: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  nextSub: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
