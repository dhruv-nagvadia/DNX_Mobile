import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  INK,
  LINK,
  ModernSize,
  ModernType,
  PAGE_BG,
  SOFT_FILL,
} from '@/utils/modernTheme';

export const MUTED = '#64748B';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 4,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  stateText: {
    fontSize: ModernType.body,
    color: MUTED,
    textAlign: 'center',
  },

  chipsBleed: {
    marginHorizontal: -ModernSize.gutter,
    marginBottom: 14,
  },
  chips: {
    paddingHorizontal: ModernSize.gutter,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    maxWidth: 220,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  chipText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
