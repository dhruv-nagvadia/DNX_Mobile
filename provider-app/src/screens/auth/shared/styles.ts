import { StyleSheet } from 'react-native';

import { INK, LINK, ModernSize, ModernType, PAGE_BG } from '@/utils/modernTheme';
import { Color, FontWeight } from '@/utils/Theme';

/** Auth-mockup values that have no shared token. */
export const HERO_NAVY = '#0B1A4A';
export const FIELD_ICON = '#334155';
export const PLACEHOLDER = '#8A94A8';
const FIELD_BORDER = '#D6DEEA';
export const MUTED = '#5B6478';
/** How far the card rides up over the hero's bottom edge. */
const CARD_OVERLAP = 64;
/** Logo tile on the hero; BrandMark is drawn at LOGO_MARK inside it. */
export const LOGO_TILE = 76;
export const LOGO_MARK = 48;

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
    paddingBottom: CARD_OVERLAP + 32,
  },
  logoTile: {
    width: LOGO_TILE,
    height: LOGO_TILE,
    borderRadius: 20,
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
    marginTop: 18,
    fontSize: ModernType.authHero,
    lineHeight: 36,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.6,
    color: Color.white,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: ModernType.rowTitle,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
  },

  // ── Card ──────────────────────────────────────────────────────────
  card: {
    marginTop: -CARD_OVERLAP,
    marginHorizontal: ModernSize.gutter,
    padding: 20,
    paddingTop: 24,
    borderRadius: 24,
    backgroundColor: Color.white,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  heading: {
    fontSize: ModernType.authHeading,
    lineHeight: 32,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    color: INK,
  },
  subheading: {
    marginTop: 4,
    fontSize: ModernType.rowTitle,
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
    marginTop: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelInRow: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  labelHint: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: ModernSize.control,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: ModernSize.controlRadius,
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
    fontSize: ModernType.rowTitle,
    color: INK,
  },
  fieldError: {
    marginTop: 6,
    fontSize: ModernType.secondary,
    color: Color.error,
  },

  // ── Submit ────────────────────────────────────────────────────────
  submit: {
    height: ModernSize.control,
    marginTop: 24,
    borderRadius: ModernSize.controlRadius,
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
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Footer ────────────────────────────────────────────────────────
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: ModernType.body,
    color: INK,
  },
  switchLink: {
    fontSize: ModernType.body,
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
    marginTop: 24,
  },
  legalText: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  legalDot: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
});
