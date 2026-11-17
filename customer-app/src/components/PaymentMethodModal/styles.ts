import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, INK, PILL } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const OFF = '#94A3B8';

/** Mockup "designs/customer/mobile/Mobile Booking Review and Payment UI.png" (right). */
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Color.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
    color: INK,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 15,
    color: META,
  },

  options: {
    gap: 10,
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  optionSelected: {
    borderColor: BLUE,
    backgroundColor: '#EEF4FF',
  },
  optionDisabled: {
    backgroundColor: '#F8FAFC',
  },
  optionBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionTitle: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  textDisabled: {
    color: OFF,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  tagText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  optionSub: {
    fontSize: 13.5,
    color: META,
  },
  optionStrong: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  optionReason: {
    fontSize: 12.5,
    color: MUTED,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: OFF,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  radioSelected: {
    borderWidth: 2,
    borderColor: BLUE,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },

  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  secureText: {
    fontSize: 13,
    color: META,
  },

  cta: {
    height: 52,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
