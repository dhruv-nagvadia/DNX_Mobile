import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  ctaLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
    marginTop: Spacing.xs,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tile: {
    position: 'relative',
    width: 130,
    height: 130,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.divider,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  coverTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
  },
  coverTagText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  tileActions: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    gap: 4,
  },
  tileBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  tileBtnDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
  },
});
