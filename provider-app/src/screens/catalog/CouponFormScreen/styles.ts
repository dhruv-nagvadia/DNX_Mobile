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
  PILL,
} from '@/utils/modernTheme';
import { INPUT_BORDER } from '@/screens/catalog/ServiceFormScreen/formKitStyles';

// Shared form look lives in ServiceFormScreen/formKitStyles.ts — the offer
// preview ticket (mirrors AllOffersScreen's OfferCard) and item picker are here.
export const META_ICON = '#334155';
const STUB_BG = '#F1EEFD';
const CODE_BORDER = '#A5B4FC';
const STUB_NOTCH = 12;

export const styles = StyleSheet.create({
  // ── Preview ticket ──────────────────────────────────────────────────────
  previewLabel: {
    marginBottom: Spacing.sm,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  ticket: {
    flexDirection: 'row',
    gap: ModernSize.gap,
    padding: ModernSize.gap,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  stub: {
    width: '36%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    backgroundColor: STUB_BG,
    overflow: 'hidden',
  },
  stubNotch: {
    position: 'absolute',
    top: '50%',
    marginTop: -STUB_NOTCH / 2,
    width: STUB_NOTCH,
    height: STUB_NOTCH,
    borderRadius: STUB_NOTCH / 2,
    backgroundColor: Color.white,
  },
  stubNotchLeft: {
    left: -STUB_NOTCH / 2,
  },
  stubNotchRight: {
    right: -STUB_NOTCH / 2,
  },
  discount: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: LINK,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  cap: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  details: {
    flex: 1,
    gap: 6,
  },
  detailsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  codeChip: {
    flexShrink: 1,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: CODE_BORDER,
    backgroundColor: '#F7F8FF',
  },
  code: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: 0.3,
  },
  codePlaceholder: {
    color: Color.placeholder,
  },
  description: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    flex: 1,
    fontSize: ModernType.secondary,
    color: INK,
  },

  // ── Item picker ─────────────────────────────────────────────────────────
  pickerList: {
    gap: Spacing.sm,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: ModernSize.control,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    backgroundColor: Color.white,
  },
  pickerRowActive: {
    borderColor: LINK,
    backgroundColor: PILL.blue.bg,
  },
  pickerText: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  pickerTextActive: {
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: INPUT_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  emptyHint: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
});
