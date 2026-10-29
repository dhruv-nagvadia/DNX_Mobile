import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },

  spinnerWrap: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: Color.primarySoft,
    borderTopColor: Color.primary,
    borderRightColor: Color.primary,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Color.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.4,
  },

  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.xs },
  stepDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Color.border },
  stepDotActive: { backgroundColor: Color.primary, width: 20 },

  note: {
    fontSize: FontSize.xs,
    color: Color.placeholder,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Failure state (nothing could be placed)
  errorBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Color.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { width: '100%', gap: Spacing.sm, marginTop: Spacing.md },
  primaryBtn: {
    paddingVertical: 15,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
    alignItems: 'center',
  },
  primaryBtnText: { color: Color.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  secondaryBtn: {
    paddingVertical: 15,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    alignItems: 'center',
  },
  secondaryBtnText: { color: Color.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
