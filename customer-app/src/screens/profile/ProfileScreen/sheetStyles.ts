import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, INK, LINK, ModernSize, PILL, SOFT_FILL } from '@/utils/modernTheme';

const MUTED = '#64748B';

/** Bottom sheets (Edit profile / Change password / Delete account) — mockup right frame. */
export const sheetStyles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdrop: { flex: 1 },
  sheet: {
    maxHeight: '92%',
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Color.white,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 10,
    backgroundColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.4,
    color: INK,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },

  // ── Avatar ──────────────────────────────────────────────────────────────
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: FontWeight.extrabold,
    color: LINK,
  },

  // ── Fields ──────────────────────────────────────────────────────────────
  field: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: ModernSize.control,
    paddingHorizontal: 14,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 15,
    color: INK,
  },
  phoneRow: { flexDirection: 'row', gap: 10 },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: ModernSize.control,
    paddingHorizontal: 14,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: SOFT_FILL,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  phoneInputWrap: { flex: 1 },
  hint: { fontSize: 13, color: MUTED },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  successText: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: Color.success,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: PILL.red.bg,
  },
  warningIcon: { marginTop: 1 },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  errorText: {
    fontSize: 13,
    fontWeight: FontWeight.medium,
    color: Color.error,
  },

  // ── Sticky footer ───────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryWide: { flex: 1.4 },
  btnGhost: {
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  btnPrimary: { backgroundColor: LINK },
  btnDanger: { backgroundColor: '#DC2626' },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
