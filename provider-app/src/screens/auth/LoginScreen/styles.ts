import { StyleSheet } from 'react-native';

import { INK, LINK, ModernType } from '@/utils/modernTheme';
import { FontWeight } from '@/utils/Theme';

/** Login-only styles; the shared auth layout lives in ../shared/styles. */
export const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  keepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
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
    fontSize: ModernType.body,
    color: INK,
  },
  forgotText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: LINK,
  },
});
