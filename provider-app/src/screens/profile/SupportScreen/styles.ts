import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL } from '@/utils/modernTheme';

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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm + 2,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 6,
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

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    borderRadius: ModernRadius.card,
    overflow: 'hidden',
    padding: Spacing.md,
    gap: Spacing.md,
    ...CARD_SHADOW,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
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
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
  },
  heroBody: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    color: HERO_BODY,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: FontSize.md,
    color: INK,
  },

  // ── Contact cards ───────────────────────────────────────────────────────
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    padding: Spacing.md - 4,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  contactIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  contactDetails: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  // ── FAQ ─────────────────────────────────────────────────────────────────
  faqCard: {
    padding: Spacing.md,
    gap: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  faqTitle: {
    fontSize: FontSize.lg,
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
    fontSize: FontSize.sm,
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
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.sm + 4,
  },
  faqHeaderOpen: {
    backgroundColor: OPEN_HEADER_BG,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  faqAnswer: {
    paddingLeft: Spacing.md - 4 + 22 + Spacing.sm + 4,
    paddingRight: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.md - 2,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.45,
    color: Color.textPrimary,
  },
  faqLink: {
    color: BRAND_BLUE,
    fontWeight: FontWeight.medium,
  },
  faqEmpty: {
    paddingVertical: Spacing.md,
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Tip ─────────────────────────────────────────────────────────────────
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
    padding: Spacing.md,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tipBody: {
    fontSize: FontSize.sm,
    color: INK,
  },
});
