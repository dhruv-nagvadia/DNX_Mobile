import { useWindowDimensions } from 'react-native';

import { ModernSize } from '@/utils/modernTheme';

/** Gap between cards in every grid / rail. */
export const CARD_GAP = 10;

/**
 * One card width for Home's rails AND the "View all" grids — two cards per
 * screen width — so a card is exactly the same size wherever it appears.
 */
export function useCardWidth(): number {
  const { width } = useWindowDimensions();
  return Math.floor((width - ModernSize.gutter * 2 - CARD_GAP) / 2);
}
