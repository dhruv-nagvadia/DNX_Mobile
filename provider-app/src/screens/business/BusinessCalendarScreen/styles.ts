import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: Color.border,
    borderRadius: Radius.md,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.surface,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: Color.textPrimary,
  },

  weekList: {
    gap: Spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm + 2,
  },
  weekRowMuted: {
    opacity: 0.5,
  },
  weekMain: {
    flex: 1,
  },
  weekRange: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  weekCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  weekCountText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  weekEmptyText: {
    fontSize: FontSize.xs,
    color: Color.placeholder,
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  todayBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  periodLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },

  chipStrip: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    width: 56,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    alignItems: 'center',
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    gap: 2,
  },
  chipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  chipDay: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  chipDayActive: {
    color: Color.onDark,
  },
  chipDate: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  chipDateActive: {
    color: Color.white,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Color.accent,
    marginTop: 2,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  overrideTag: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.accent2,
  },
  timesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeField: {
    flex: 1,
  },

  sectionGroup: {
    gap: Spacing.xs,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  sectionCountText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  itemList: {
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm + 2,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  itemMain: {
    flex: 1,
    gap: 1,
  },
  itemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  itemSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  edgeBadge: {
    marginRight: -(Spacing.sm + 2),
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
});
