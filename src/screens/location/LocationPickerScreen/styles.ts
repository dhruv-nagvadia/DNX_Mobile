import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, gap: Spacing.md },

  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
  },
  currentText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.primaryDark },

  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
  },
  gpsBtnText: { color: Color.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: Color.border },
  dividerText: { fontSize: FontSize.xs, color: Color.textSecondary, fontWeight: FontWeight.semibold },

  label: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  manualRow: { flexDirection: 'row', gap: Spacing.sm },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  saveBtn: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: Color.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  hint: { fontSize: FontSize.xs, color: Color.textSecondary, lineHeight: FontSize.xs * 1.5 },

  suggestLoading: { alignItems: 'center', paddingVertical: Spacing.sm },
  suggestList: {
    maxHeight: 280,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    overflow: 'hidden',
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  suggestRowLast: { borderBottomWidth: 0 },
  suggestText: { flex: 1, fontSize: FontSize.sm, color: Color.textPrimary },
  suggestPin: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.textSecondary },
});
