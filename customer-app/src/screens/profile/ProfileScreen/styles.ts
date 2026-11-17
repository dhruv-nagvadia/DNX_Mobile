import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const BODY = '#334155';
const HAIRLINE = '#E8ECF2';
const G = ModernSize.gutter;

/** Soft blue gradient behind the profile card. */
export const PROFILE_CARD_GRADIENT = ['#F1F6FF', '#E1EBFD', '#D6E4FC'];

/** Mockup "designs/customer/mobile/DNX Profile and Edit Profile Screens.png" (left frame). */
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  content: { paddingHorizontal: G, paddingBottom: 32 },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.6,
    color: INK,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },

  // ── Profile card ────────────────────────────────────────────────────────
  profileCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D5E2FA',
    overflow: 'hidden',
    backgroundColor: '#E6EEFD',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
    ...CARD_SHADOW,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: FontWeight.extrabold,
    color: LINK,
  },
  profileInfo: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.4,
    color: INK,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  editPillText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  contactText: { fontSize: ModernType.body, color: BODY },
  locationChip: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Color.white,
  },
  locationText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  sinceText: {
    marginTop: 6,
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── Stats ───────────────────────────────────────────────────────────────
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: { flex: 1 },
  statValue: {
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  statLabel: { fontSize: ModernType.caption, color: MUTED },

  // ── Sections ────────────────────────────────────────────────────────────
  sectionLabel: {
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MUTED,
  },
  section: {
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  rowIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  rowSubtitle: { fontSize: ModernType.secondary, color: MUTED },
  duePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PILL.yellow.bg,
  },
  duePillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: PILL.yellow.fg,
  },

  // ── Footer actions ──────────────────────────────────────────────────────
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    marginTop: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },
  deleteAccount: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteAccountText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: '#B91C1C',
    textDecorationLine: 'underline',
  },
  version: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: ModernType.caption,
    color: MUTED,
  },
});
