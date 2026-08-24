import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFound: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },

  // Summary
  summary: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  bizName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.primaryDark,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },

  // Details card
  card: {
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  rowValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  priceValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  dueValue: {
    color: Color.warning,
    fontWeight: FontWeight.extrabold,
  },

  // Section title
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },

  reasonBox: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  reasonText: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    lineHeight: FontSize.sm * 1.4,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    marginLeft: 6,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionPrimary: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  actionPrimaryText: {
    color: Color.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  actionGhost: {
    backgroundColor: Color.surface,
    borderColor: Color.border,
  },
  actionGhostText: {
    color: Color.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  actionDanger: {
    backgroundColor: Color.errorSoft,
    borderColor: Color.error,
  },
  actionDangerText: {
    color: Color.error,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },

  // Review modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  modalSub: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 84,
    textAlignVertical: 'top',
    color: Color.textPrimary,
    fontSize: FontSize.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
});
