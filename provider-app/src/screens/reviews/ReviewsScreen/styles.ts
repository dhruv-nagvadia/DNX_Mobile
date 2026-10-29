import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },

  summaryCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.lg,
    ...Shadow.card,
  },
  summaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAvg: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  summaryStars: {
    fontSize: FontSize.sm,
    color: Color.warning,
  },
  summaryCount: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  distribution: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distLabel: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    width: 10,
  },
  distTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Color.border,
    overflow: 'hidden',
  },
  distFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Color.warning,
  },
  distCount: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    width: 20,
    textAlign: 'right',
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 6,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  date: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  stars: {
    fontSize: FontSize.sm,
    color: Color.warning,
  },
  comment: {
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },

  replyBox: {
    marginTop: 4,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
    gap: 4,
  },
  replyLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  replyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  replyLink: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  replyLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

  editorInput: {
    marginTop: 6,
    minHeight: 70,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    textAlignVertical: 'top',
  },
  editorActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  editorButton: {
    flex: 1,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
