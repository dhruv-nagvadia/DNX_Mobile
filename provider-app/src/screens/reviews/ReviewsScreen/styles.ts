import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

/** Mockup "Mobile Reviews Dashboard Interface.png": light header with a round
 * filter button, summary card (average + 5→1 bars), business + rating chips,
 * and review cards with inline reply composer. */
export const STAR_FILLED = '#F5B301';
export const STAR_EMPTY = '#E2E6EE';
export const BRAND_BLUE = '#1D4ED8';
export const NEEDS_DOT = '#F97316';
const BAR_TRACK = '#E2E7EF';
const BACKDROP = 'rgba(15,30,74,0.45)';

const AVATAR = 52;
const AVATAR_GAP = Spacing.sm + 6;
const DOT = 10;
const THUMB = 40;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.md - 2,
  },
  loader: {
    marginTop: Spacing.xl,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 6,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  filterDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: NEEDS_DOT,
    borderWidth: 1.5,
    borderColor: Color.white,
  },

  // ── Summary card ────────────────────────────────────────────────────────
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  summaryLeft: {
    width: '36%',
    alignItems: 'center',
    gap: 4,
  },
  summaryAvg: {
    fontSize: FontSize.xxxl * 1.45,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -1,
  },
  summaryCount: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    marginTop: 2,
  },
  summaryNote: {
    fontSize: FontSize.xs - 1,
    color: Color.placeholder,
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: CARD_BORDER,
    marginHorizontal: Spacing.sm + 4,
  },
  distribution: {
    flex: 1,
    gap: Spacing.sm - 1,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distLabel: {
    width: 12,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  distTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: BAR_TRACK,
    overflow: 'hidden',
  },
  distFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_BLUE,
  },
  distPct: {
    minWidth: 68,
    textAlign: 'right',
    fontSize: FontSize.xs + 1,
    color: INK,
  },
  distCount: {
    color: Color.textSecondary,
  },

  // ── Stars ───────────────────────────────────────────────────────────────
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

  // ── Chips ───────────────────────────────────────────────────────────────
  // Bleed chip rows to the screen edges so chips scroll off-screen.
  chipsScroll: {
    marginHorizontal: -Spacing.md,
    flexGrow: 0,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chip: {
    minWidth: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: BRAND_BLUE,
    backgroundColor: BRAND_BLUE,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  dotOnActive: {
    borderWidth: 1,
    borderColor: Color.white,
  },
  needsDot: {
    backgroundColor: NEEDS_DOT,
  },
  countBadge: {
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: ModernRadius.pill,
    alignItems: 'center',
    backgroundColor: SOFT_FILL,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  countBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Review card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md - 2,
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    gap: AVATAR_GAP,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  cardHead: {
    flex: 1,
    gap: 4,
  },
  cardHeadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  nameCol: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  date: {
    fontSize: FontSize.sm - 1,
    color: Color.textSecondary,
    marginTop: 1,
  },
  businessPill: {
    maxWidth: '58%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
  },
  businessPillText: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  productChip: {
    maxWidth: '62%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: 4,
    paddingRight: Spacing.sm + 4,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  productThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 8,
    backgroundColor: SOFT_FILL,
  },
  productThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  // Body aligns with the name column (under the avatar's right edge).
  cardBody: {
    marginLeft: AVATAR + AVATAR_GAP,
    marginTop: Spacing.xs,
    gap: Spacing.sm + 2,
  },
  comment: {
    fontSize: FontSize.sm + 1,
    color: INK,
    lineHeight: (FontSize.sm + 1) * 1.4,
  },
  // Invisible full-length copy used only to count lines.
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
  moreText: {
    marginTop: 2,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.medium,
    color: LINK,
  },

  // Existing reply
  replyBox: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.box,
    padding: Spacing.sm + 4,
  },
  replyContent: {
    flex: 1,
    gap: 2,
  },
  replyHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  replyLabel: {
    flex: 1,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  replyWhen: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.regular,
    color: Color.textSecondary,
  },
  replyText: {
    fontSize: FontSize.sm,
    color: INK,
    lineHeight: FontSize.sm * 1.4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.medium,
    color: LINK,
  },

  // Needs reply
  needsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  needsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm - 1,
    borderRadius: ModernRadius.box - 2,
    backgroundColor: PILL.orange.bg,
  },
  needsPillText: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: PILL.orange.fg,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm - 2,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  replyBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // Composer
  composer: {
    gap: Spacing.sm + 2,
    padding: Spacing.sm,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: SOFT_FILL,
  },
  composerInput: {
    minHeight: 56,
    maxHeight: 160,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    borderRadius: ModernRadius.box - 2,
    paddingHorizontal: Spacing.sm + 4,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.sm + 4,
    fontSize: FontSize.sm + 1,
    color: INK,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  publicNote: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  publicNoteText: {
    flexShrink: 1,
    fontSize: FontSize.sm - 1,
    color: Color.textSecondary,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm - 1,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: INK,
    backgroundColor: Color.white,
  },
  cancelText: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  postBtn: {
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm - 1,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: BRAND_BLUE,
    backgroundColor: BRAND_BLUE,
  },
  postBtnBusy: {
    opacity: 0.8,
  },
  postText: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  removeBtn: {
    alignSelf: 'flex-start',
  },
  removeText: {
    fontSize: FontSize.xs + 1,
    fontWeight: FontWeight.medium,
    color: Color.error,
  },
  errorText: {
    fontSize: FontSize.xs + 1,
    color: Color.error,
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.yellow.bg,
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyBody: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // ── Filter sheet ────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: BACKDROP,
  },
  sheet: {
    backgroundColor: Color.white,
    borderTopLeftRadius: ModernRadius.card + 8,
    borderTopRightRadius: ModernRadius.card + 8,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: CARD_BORDER,
    marginBottom: Spacing.sm,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  sheetLabel: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sheetOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sheetDone: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 6,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
});
