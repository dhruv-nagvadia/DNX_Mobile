import { StyleSheet } from 'react-native';
import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

export const AMBER = '#F59E0B';
const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const G = ModernSize.gutter;

/**
 * Business Detail — laid out like the customer app's business page: one rounded
 * photo + identity card at the top, then white section cards (title on the left,
 * action link on the right) on the page background.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  content: {
    paddingBottom: 24,
  },
  body: {
    paddingHorizontal: G,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
  },

  // ── Top card: photo + identity share one rounded, inset card ────────────
  topCard: {
    marginHorizontal: G,
    borderRadius: 18,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  hero: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
  },
  heroEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E6EEFC',
  },
  heroEmptyText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  heroBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...CARD_SHADOW,
  },
  heroBtnLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  heroBtnRow: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 10,
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  counterText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#3B82F6',
  },

  // ── Identity (under the photo) ──────────────────────────────────────────
  headerCard: {
    padding: 16,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nameWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  name: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: INK,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },
  ratingPillText: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  subline: {
    fontSize: 14,
    color: META,
  },
  infoChips: {
    gap: 8,
    paddingTop: 6,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  infoChipOpen: {
    borderColor: PILL.green.bg,
    backgroundColor: PILL.green.bg,
  },
  infoChipClosed: {
    backgroundColor: '#F1F5F9',
  },
  infoChipText: {
    fontSize: 13,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  infoChipOpenText: {
    color: PILL.green.fg,
    fontWeight: FontWeight.semibold,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOpen: {
    backgroundColor: '#22C55E',
  },
  dotClosed: {
    backgroundColor: '#94A3B8',
  },

  // ── Blocked banner ──────────────────────────────────────────────────────
  banner: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F7C9C9',
  },
  bannerMain: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },
  bannerText: {
    fontSize: 13,
    lineHeight: 18,
    color: INK,
  },

  // ── Section titles / cards ──────────────────────────────────────────────
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    // A line under the title row separates the header from the content below it.
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  cardTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // Keep the action at its natural width — only the title may shrink.
    flexShrink: 0,
  },
  linkText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },

  // ── Manage grid: pastel gradient tiles, three per row ───────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  manageTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 92,
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 1,
  },
  manageIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageLabel: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── About ───────────────────────────────────────────────────────────────
  about: {
    fontSize: 14,
    lineHeight: 20,
    color: META,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },

  // ── Opening hours ───────────────────────────────────────────────────────
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  hoursRowDivider: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  hoursDay: {
    fontSize: 14,
    color: META,
  },
  hoursTime: {
    fontSize: 14,
    color: META,
  },
  hoursToday: {
    color: BLUE,
    fontWeight: FontWeight.bold,
  },
  hoursClosed: {
    color: '#DC2626',
    fontWeight: FontWeight.semibold,
  },

  // ── Contact & location ──────────────────────────────────────────────────
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  contactMain: {
    flex: 1,
    gap: 2,
    paddingVertical: 12,
  },
  contactDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  contactLabel: {
    fontSize: 12,
    color: MUTED,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Reviews ─────────────────────────────────────────────────────────────
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryAvg: {
    fontSize: 38,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  summaryCount: {
    fontSize: 13,
    color: MUTED,
  },
  summaryBody: {
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  halfStar: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  reviewEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  reviewBody: {
    flex: 1,
    gap: 3,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewAgo: {
    fontSize: 12,
    color: MUTED,
  },
  reviewText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: INK,
  },
  reply: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    borderRadius: 8,
    backgroundColor: '#F1F5FB',
    gap: 2,
  },
  replyTitle: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 18,
    color: META,
  },
});
