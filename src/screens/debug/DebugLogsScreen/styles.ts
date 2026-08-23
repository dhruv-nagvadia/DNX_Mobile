import { StyleSheet, Platform } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

const MONO = Platform.select({ ios: 'Courier', android: 'monospace' });

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  count: { fontSize: FontSize.xs, color: Color.textSecondary },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.error },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  empty: { fontSize: FontSize.sm, color: Color.textSecondary, textAlign: 'center' },

  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  row: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  levelChip: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: Radius.sm },
  levelText: { fontSize: 10, fontWeight: FontWeight.bold, color: Color.white },
  time: { fontSize: FontSize.xs, color: Color.textSecondary, fontVariant: ['tabular-nums'] },
  tag: { flex: 1, fontSize: FontSize.xs, color: Color.placeholder },
  message: { marginTop: 3, fontSize: FontSize.sm, color: Color.textPrimary },
  meta: {
    marginTop: 4,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    fontFamily: MONO,
    backgroundColor: Color.surface,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  metaError: { color: Color.error },
  metaToggle: { marginTop: 2, fontSize: 10, fontWeight: FontWeight.bold, color: Color.primary },
});
