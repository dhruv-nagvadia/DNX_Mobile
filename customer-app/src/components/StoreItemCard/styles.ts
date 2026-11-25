import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, PILL } from '@/utils/modernTheme';

/** Mockup "designs/customer/mobile/Grocery App Product States Grid.png". */
export const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F4F6FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF2F7',
  },
  placeholderText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: PILL.green.bg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: FontWeight.extrabold,
    color: PILL.green.fg,
  },
  badgeOut: {
    backgroundColor: '#1E293B',
  },
  badgeOutText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  info: {
    paddingTop: 10,
    paddingHorizontal: 2,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  store: {
    fontSize: 12,
    color: '#64748B',
  },
  pack: {
    fontSize: 13,
    color: '#64748B',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 21,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  strike: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  control: {
    paddingTop: 10,
  },
});
