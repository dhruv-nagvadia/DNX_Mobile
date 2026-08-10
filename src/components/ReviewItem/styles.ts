import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    color: Color.primary,
  },
  body: { flex: 1, minWidth: 0, gap: 4 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  date: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
});
