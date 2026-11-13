import { StyleSheet } from 'react-native';

import { INK, LINK, PAGE_BG } from '@/utils/modernTheme';
import { Color, FontWeight } from '@/utils/Theme';

/** Auth-mockup values that have no shared token. */
export const HERO_NAVY = '#0B1A4A';
export const FIELD_ICON = '#334155';
export const PLACEHOLDER = '#8A94A8';
const FIELD_BORDER = '#D6DEEA';
export const MUTED = '#5B6478';
/** How far the card rides up over the hero's bottom edge. */
const CARD_OVERLAP = 64;

/** Styles shared by Login, Register and Forgot-password. */
export const authStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: PAGE_BG,
  },

  // ── Hero ──────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: CARD_OVERLAP + 40,
  },
  logoTile: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000814',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTitle: {
    marginTop: 22,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: FontWeight.bold,
    letterSpacing: -1,
    color: Color.white,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
  },

  // ── Card ──────────────────────────────────────────────────────────
  card: {
    marginTop: -CARD_OVERLAP,
    marginHorizontal: 16,
    padding: 24,
    paddingTop: 28,
    borderRadius: 24,
    backgroundColor: Color.white,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.8,
    color: INK,
  },
  subheading: {
    marginTop: 4,
    fontSize: 17,
    color: MUTED,
  },
  subheadingStrong: {
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  banner: {
    marginTop: 16,
  },

  // ── Field ─────────────────────────────────────────────────────────
  field: {
    marginTop: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelInRow: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  labelHint: {
    fontSize: 13,
    color: MUTED,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 14,
    backgroundColor: Color.white,
  },
  inputRowFocused: {
    borderColor: LINK,
  },
  inputRowError: {
    borderColor: Color.error,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 16,
    color: INK,
  },
  fieldError: {
    marginTop: 6,
    fontSize: 13,
    color: Color.error,
  },

  // ── Submit ────────────────────────────────────────────────────────
  submit: {
    height: 56,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: LINK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    opacity: 0.88,
  },
  submitLoading: {
    opacity: 0.8,
  },
  submitText: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Footer ────────────────────────────────────────────────────────
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  switchText: {
    fontSize: 16,
    color: INK,
  },
  switchLink: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: LINK,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
  },
  legalText: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  legalDot: {
    fontSize: 14,
    color: Color.textSecondary,
  },
});
