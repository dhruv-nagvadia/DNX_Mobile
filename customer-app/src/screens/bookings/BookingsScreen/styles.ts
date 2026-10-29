import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: Color.textPrimary,
  },

  // Mini header: Bookings / Orders
  segmentBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    padding: 3,
  },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Radius.sm },
  segActive: { backgroundColor: Color.primary },
  segText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textSecondary },
  segTextActive: { color: Color.white },

  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  // Card
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImg: { width: '100%', height: '100%' },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  pay: {
    marginTop: 3,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  orderRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  // Section label between orders / appointments
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Color.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  // Order card lines
  orderItems: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
    gap: 2,
  },
  orderLine: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
  },
  orderMore: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  orderFooterLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    fontWeight: FontWeight.semibold,
  },
  orderTotal: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  actionPrimary: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  actionPrimaryText: {
    color: Color.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  actionGhost: {
    backgroundColor: Color.surface,
    borderColor: Color.border,
  },
  actionGhostText: {
    color: Color.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  actionDanger: {
    backgroundColor: Color.errorSoft,
    borderColor: Color.error,
  },
  actionDangerText: {
    color: Color.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },

  reasonBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Color.background,
    borderWidth: 1,
    borderColor: Color.border,
  },
  reasonLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
    marginBottom: 2,
  },
  reasonText: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    lineHeight: FontSize.sm * 1.4,
  },
  reviewedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.md,
  },
  reviewedText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    marginLeft: 4,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
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
  },
});
