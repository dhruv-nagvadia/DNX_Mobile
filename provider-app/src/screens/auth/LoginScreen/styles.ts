import { StyleSheet } from 'react-native';

import { INK, LINK } from '@/utils/modernTheme';
import { FontWeight } from '@/utils/Theme';

/** Login-only styles; the shared auth layout lives in ../shared/styles. */
export const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  keepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  keepText: {
    fontSize: 15,
    color: INK,
  },
  forgotText: {
    fontSize: 15,
    fontWeight: FontWeight.medium,
    color: LINK,
  },
});
