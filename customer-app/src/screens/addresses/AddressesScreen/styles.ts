import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xl },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  radioBtn: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBtnSelected: { borderColor: Color.primary },
  radioBtnDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Color.primary,
  },

  info: { flex: 1, minWidth: 0, gap: 3 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary },
  defaultTag: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primaryDark,
    backgroundColor: Color.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  line: { fontSize: FontSize.sm, color: Color.textSecondary },

  rowActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.primary,
    borderStyle: 'dashed',
  },
  addBtnText: { color: Color.primary, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Color.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Color.textSecondary, textAlign: 'center' },
});
