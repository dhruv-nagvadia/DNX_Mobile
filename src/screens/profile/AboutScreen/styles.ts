import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, gap: Spacing.lg, alignItems: 'center' },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  logoText: { color: Color.white, fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
  appName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Color.textPrimary },
  version: { fontSize: FontSize.xs, color: Color.textSecondary },
  blurb: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.5,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: Color.border },
  rowLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Color.textPrimary },
});
