import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PAGE_BG, SOFT_FILL } from '@/utils/modernTheme';

export const STAR_FILLED = '#FBBF24';
export const STAR_EMPTY = '#E5E7EB';

const AVATAR = 48;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    ...CARD_SHADOW,
  },

  // ── Summary ────────────────────────────────────────────────────────────
  summaryTop: {
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  summaryAvg: {
    fontSize: FontSize.xxxl * 1.3,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  summaryCount: {
    fontSize: FontSize.sm,
    color: INK,
    opacity: 0.8,
  },
  distribution: {
    gap: Spacing.sm + 4,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  distLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 32,
  },
  distLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  distTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: SOFT_FILL,
    overflow: 'hidden',
  },
  distFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: ACTION,
  },
  distPct: {
    width: 40,
    textAlign: 'right',
    fontSize: FontSize.sm,
    color: INK,
  },

  // ── Stars ──────────────────────────────────────────────────────────────
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },

  // ── Review rows ────────────────────────────────────────────────────────
  review: {
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  reviewDivider: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  reviewHead: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  date: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  comment: {
    fontSize: FontSize.sm,
    color: INK,
    lineHeight: FontSize.sm * 1.5,
  },

  replyBox: {
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.box,
    padding: Spacing.sm + 4,
    gap: 4,
  },
  replyLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: ACTION,
  },
  replyText: {
    fontSize: FontSize.sm,
    color: INK,
    lineHeight: FontSize.sm * 1.4,
  },

  replyLink: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  editorInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.box,
    padding: Spacing.sm + 4,
    fontSize: FontSize.sm,
    color: INK,
    textAlignVertical: 'top',
  },
  editorActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  editorButton: {
    flex: 1,
  },
});
