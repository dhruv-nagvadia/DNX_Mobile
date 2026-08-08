import { StyleSheet, Dimensions } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

const SCREEN_W = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    paddingBottom: 110, // room for the sticky book bar
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
  },

  // Gallery
  gallery: {
    height: 240,
  },
  galleryImg: {
    width: SCREEN_W,
    height: 240,
  },
  galleryFallback: {
    width: SCREEN_W,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  dots: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: Color.white,
    width: 18,
  },
  countBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(6, 11, 24, 0.6)',
  },
  countText: {
    color: Color.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  galleryWrap: {
    position: 'relative',
  },

  body: {
    padding: Spacing.lg,
  },

  // Header
  name: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: Color.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Sections
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  about: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.5,
    color: Color.textPrimary,
  },
  muted: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Service rows
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1.5,
    borderColor: Color.border,
  },
  serviceRowActive: {
    borderColor: Color.primary,
    backgroundColor: Color.primarySoft,
  },
  serviceInfo: { flex: 1, minWidth: 0 },
  serviceName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  serviceMeta: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  servicePrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.primaryDark,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Color.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Color.primary,
  },

  // Day chips
  dayRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  dayChip: {
    minWidth: 64,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  dayChipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  dayChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  dayChipTextActive: {
    color: Color.white,
  },

  // Slots
  slotWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  slot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  slotActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  slotText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  slotTextActive: {
    color: Color.white,
  },

  // Sticky book bar
  bookBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Color.surface,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  bookHint: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  bookBtn: {
    minWidth: 140,
  },
});
