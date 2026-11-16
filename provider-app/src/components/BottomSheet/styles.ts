import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernSize, ModernType, PILL, SOFT_FILL } from '@/utils/modernTheme';

/** Standard popup colours shared by `BottomSheet` and `ConfirmDialog`. */
export const SHEET_BLUE = '#1D4ED8';
export const SHEET_RED = '#DC2626';
export const SHEET_BACKDROP = 'rgba(15, 30, 74, 0.45)';
/** How far below its resting place the sheet starts its slide-up. */
export const SHEET_SLIDE_FROM = 600;
/**
 * Time for a closing sheet to finish animating out and unmount its Modal.
 * Wait this long before opening a dialog right after closing a sheet — iOS
 * can't present a second Modal while another is still on screen.
 */
export const SHEET_CLOSE_MS = 320;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SHEET_BACKDROP,
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: Color.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: CARD_BORDER,
    marginBottom: Spacing.sm + 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    marginBottom: Spacing.sm + 4,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  content: {
    gap: 2,
  },
  scroll: {
    flexGrow: 0,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    paddingTop: Spacing.md,
  },

  // ── Option row ────────────────────────────────────────────────────────
  option: {
    minHeight: ModernSize.rowMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: ModernSize.controlRadius,
  },
  optionSelected: {
    backgroundColor: PILL.blue.bg,
  },
  optionDestructive: {
    backgroundColor: PILL.red.bg,
  },
  optionDisabled: {
    opacity: 0.45,
  },
  iconBox: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.controlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  optionLabelSelected: {
    color: SHEET_BLUE,
  },
  optionLabelDestructive: {
    color: SHEET_RED,
  },
  optionDescription: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  // ── Buttons ───────────────────────────────────────────────────────────
  button: {
    flex: 1,
    height: ModernSize.control,
    borderRadius: ModernSize.controlRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  buttonPrimary: {
    backgroundColor: SHEET_BLUE,
  },
  buttonDanger: {
    backgroundColor: SHEET_RED,
  },
  buttonSecondary: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  buttonTextSecondary: {
    color: INK,
  },
});
