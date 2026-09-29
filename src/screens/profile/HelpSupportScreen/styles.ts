import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  intro: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.5,
    color: Color.textSecondary,
  },
  section: {
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
  rowBorder: { borderTopWidth: 1, borderTopColor: Color.border },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Color.textPrimary },
  rowSub: { marginTop: 2, fontSize: FontSize.xs, color: Color.textSecondary },
});
