import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  locationText: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  locationChange: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },

  // What to search for — the one always-visible filter
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    alignItems: 'center',
  },
  typeChipActive: { backgroundColor: Color.primary, borderColor: Color.primary },
  typeChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.textSecondary },
  typeChipTextActive: { color: Color.white },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
  },
  chipActive: { backgroundColor: Color.primarySoft, borderColor: Color.primary },
  chipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.textSecondary },
  chipTextActive: { color: Color.primary },

  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },

  // Recent searches / recently viewed (shown before a search is typed)
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  clearLink: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  info: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    flexShrink: 1,
  },
  meta: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  price: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  // Used where `price` isn't already inside a marginTop'd row (e.g. metaRow).
  standalonePrice: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: FontSize.xs, color: Color.textSecondary },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // Recent-search chip row
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
