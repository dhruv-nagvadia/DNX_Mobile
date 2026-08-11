import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing, Shadow } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { paddingBottom: Spacing.xl },

  // ── Ink hero ──────────────────────────────────────────────────────
  hero: {
    overflow: 'hidden',
    backgroundColor: Color.ink,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.xl,
  },
  editBtn: {
    position: 'absolute',
    right: Spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Color.glassStrong,
    borderWidth: 1,
    borderColor: Color.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Color.ink,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
  },
  name: {
    color: Color.onDark,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
  },
  email: {
    color: Color.onDarkMuted,
    fontSize: FontSize.sm,
  },
  rolePill: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Color.glassStrong,
    borderWidth: 1,
    borderColor: Color.glassBorder,
  },
  rolePillText: {
    color: Color.onDark,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },

  // ── Stats (overlap the hero) ──────────────────────────────────────
  stats: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: Color.border,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  // ── Menu ──────────────────────────────────────────────────────────
  sectionLabel: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Color.textSecondary,
  },
  section: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Logout ────────────────────────────────────────────────────────
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: 15,
    borderRadius: Radius.lg,
    backgroundColor: Color.errorSoft,
    borderWidth: 1,
    borderColor: Color.error,
  },
  logoutText: {
    color: Color.error,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  version: {
    marginTop: Spacing.lg,
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Color.placeholder,
  },

  // ── Edit modal ────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalBtnGhost: {
    backgroundColor: Color.surface,
    borderColor: Color.border,
  },
  modalBtnGhostText: {
    color: Color.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  modalBtnPrimary: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  modalBtnPrimaryText: {
    color: Color.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
