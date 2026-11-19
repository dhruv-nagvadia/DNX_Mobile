import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  ACTION,
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
} from '@/utils/modernTheme';

/** Matches the provider app's Help & Support (Modern Help & Support App Screen.png). */
export const BRAND_BLUE = '#1D4ED8';
export const HERO_COLORS = ['#0A1A55', '#0F2E8C', '#1D4ED8'];

export const CONTACT_TINT = {
  call: PILL.blue,
  whatsapp: { bg: PILL.green.bg, fg: '#16A34A' },
  email: { bg: PILL.lavender.bg, fg: '#7C3AED' },
};

const MUTED = '#64748B';
const OPEN_HEADER_BG = '#E8F0FE';
const OPEN_BORDER = '#C9D8F5';
const STILL_BG = '#EEF4FF';
const STILL_BORDER = '#D5E2FA';
const HERO_DIVIDER = 'rgba(255,255,255,0.35)';
const HERO_BODY = 'rgba(255,255,255,0.88)';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    gap: ModernSize.gap,
  },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    borderRadius: ModernRadius.card,
    overflow: 'hidden',
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    backgroundColor: HERO_COLORS[1],
    ...CARD_SHADOW,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  heroDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
    backgroundColor: HERO_DIVIDER,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
  },
  heroBody: {
    fontSize: ModernType.secondary,
    lineHeight: 18,
    color: HERO_BODY,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: ModernRadius.box,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: ModernType.body,
    color: INK,
  },

  // ── Contact cards ───────────────────────────────────────────────────────
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    padding: ModernSize.gap,
    minHeight: ModernSize.rowMinHeight + 8,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  contactIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  contactDetails: {
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── FAQ ─────────────────────────────────────────────────────────────────
  faqCard: {
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  faqTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  // Bleed the chip row to the card edges so chips scroll off-card.
  chipScroll: {
    marginHorizontal: -ModernSize.cardPad,
    flexGrow: 0,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: ModernSize.cardPad,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: BRAND_BLUE,
    backgroundColor: BRAND_BLUE,
  },
  chipText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  faqGroup: {
    gap: 8,
  },
  groupLabel: {
    marginTop: 2,
    marginLeft: 2,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: MUTED,
  },
  faqItem: {
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    backgroundColor: Color.white,
  },
  faqItemOpen: {
    borderColor: OPEN_BORDER,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    padding: ModernSize.gap,
  },
  faqHeaderOpen: {
    backgroundColor: OPEN_HEADER_BG,
  },
  faqQuestion: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  faqAnswer: {
    paddingLeft: ModernSize.gap + 20 + ModernSize.gap,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 14,
    fontSize: ModernType.body,
    lineHeight: 20,
    color: Color.textPrimary,
  },
  faqLink: {
    color: BRAND_BLUE,
    fontWeight: FontWeight.medium,
  },
  faqEmpty: {
    paddingVertical: 16,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: MUTED,
  },

  // ── Still need help? ────────────────────────────────────────────────────
  stillCard: {
    padding: ModernSize.cardPad,
    gap: 14,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: STILL_BORDER,
    backgroundColor: STILL_BG,
  },
  stillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  stillIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  stillText: {
    flex: 1,
    gap: 2,
  },
  stillTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  stillBody: {
    fontSize: ModernType.secondary,
    lineHeight: 18,
    color: MUTED,
  },
  stillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: ModernSize.control,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
  },
  stillBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
