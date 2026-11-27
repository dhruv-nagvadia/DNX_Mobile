import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL } from '@/utils/modernTheme';

/** Mockup "Modern Help & Support App Screen.png". */
export const BRAND_BLUE = '#1D4ED8';
export const HERO_COLORS = ['#0A1A55', '#0F2E8C', '#1D4ED8'];
export const TIP_ICON = '#7C3AED';

export const CONTACT_TINT = {
  call: PILL.blue,
  whatsapp: { bg: PILL.green.bg, fg: '#16A34A' },
  email: { bg: '#EDE9FE', fg: TIP_ICON },
};

const OPEN_HEADER_BG = '#E8F0FE';
const OPEN_BORDER = '#C9D8F5';
const TIP_BG = '#F1EBFE';
const TIP_DIVIDER = '#C4B5FD';
const HERO_DIVIDER = 'rgba(255,255,255,0.35)';
const HERO_BODY = 'rgba(255,255,255,0.88)';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
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

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    borderRadius: ModernRadius.card,
    overflow: 'hidden',
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    // Solid base under the gradient — Android only draws elevation for a filled view.
    backgroundColor: '#0F2E8C',
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
    marginVertical: Spacing.xs,
    backgroundColor: HERO_DIVIDER,
  },
  heroText: {
    flex: 1,
    gap: Spacing.xs,
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
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md - 2,
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
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
    minHeight: ModernSize.rowMinHeight + 8,
  },
  contactIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tintCall: {
    backgroundColor: CONTACT_TINT.call.bg,
  },
  tintWhatsapp: {
    backgroundColor: CONTACT_TINT.whatsapp.bg,
  },
  tintEmail: {
    backgroundColor: CONTACT_TINT.email.bg,
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
    color: Color.textSecondary,
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
    marginHorizontal: -Spacing.md,
    flexGrow: 0,
  },
  chipRow: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 1,
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
  faqList: {
    gap: Spacing.sm,
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
    paddingHorizontal: ModernSize.gap,
    paddingVertical: ModernSize.gap,
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
    paddingRight: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.md - 2,
    fontSize: ModernType.body,
    lineHeight: 20,
    color: Color.textPrimary,
  },
  faqLink: {
    color: BRAND_BLUE,
    fontWeight: FontWeight.medium,
  },
  faqEmpty: {
    paddingVertical: Spacing.md,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // ── Tip ─────────────────────────────────────────────────────────────────
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    padding: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    backgroundColor: TIP_BG,
  },
  tipDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: TIP_DIVIDER,
  },
  tipText: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tipBody: {
    fontSize: ModernType.body,
    color: INK,
  },
});
