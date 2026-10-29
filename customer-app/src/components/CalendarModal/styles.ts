import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Platform_shadow(),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  titleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  titleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Color.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: Color.primary,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: Color.primary,
  },
  dayText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Color.textPrimary,
  },
  dayTextMuted: {
    color: Color.placeholder,
  },
  dayTextSelected: {
    color: Color.white,
    fontWeight: FontWeight.bold,
  },
  dayTextDisabled: {
    color: Color.border,
  },

  // Year picker
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  yearCell: {
    width: `${100 / 3}%`,
    padding: 5,
  },
  yearBtn: {
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearBtnActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  yearText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  yearTextActive: {
    color: Color.white,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  footerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  footerBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  clearText: {
    color: Color.error,
  },
  todayText: {
    color: Color.textSecondary,
  },
});

function Platform_shadow() {
  return {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  };
}
