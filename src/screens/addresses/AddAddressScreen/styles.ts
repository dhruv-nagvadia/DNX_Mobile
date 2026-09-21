import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, gap: Spacing.md },

  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.primary,
    borderStyle: 'dashed',
  },
  gpsBtnText: { color: Color.primary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },

  resolvedHint: {
    marginTop: -Spacing.sm,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  row2: { flexDirection: 'row', gap: Spacing.md },
  field: { flex: 1, minWidth: 0 },

  label: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary, marginBottom: 4 },
  input: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },

  errorText: { fontSize: FontSize.sm, color: Color.error },

  saveBtn: {
    marginTop: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: Color.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
