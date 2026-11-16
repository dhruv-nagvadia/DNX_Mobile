import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';

/** Same gap as Home's grids. */
export const GAP = 10;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    paddingBottom: 32,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  scopeText: {
    fontSize: 12,
    color: Color.textSecondary,
  },
  footer: {
    marginVertical: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: Color.textSecondary,
  },
});
