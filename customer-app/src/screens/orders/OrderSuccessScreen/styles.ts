import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
    justifyContent: 'center',
  },

  badgeWrap: { alignItems: 'center', gap: Spacing.md },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Color.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Color.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.4,
    paddingHorizontal: Spacing.md,
  },

  card: {
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    paddingHorizontal: Spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  orderRowLast: { borderBottomWidth: 0 },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderMain: { flex: 1, minWidth: 0 },
  orderName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.textPrimary },
  orderMeta: { marginTop: 2, fontSize: FontSize.xs, color: Color.textSecondary },
  orderAmount: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },

  warningCard: {
    borderRadius: Radius.lg,
    backgroundColor: Color.warningSoft,
    borderWidth: 1,
    borderColor: Color.warning,
    padding: Spacing.md,
    gap: 6,
    flexDirection: 'row',
  },
  warningTextWrap: { flex: 1, gap: 2 },
  warningTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  warningText: { fontSize: FontSize.xs, color: Color.textSecondary, lineHeight: FontSize.xs * 1.5 },

  actions: { gap: Spacing.sm },
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
