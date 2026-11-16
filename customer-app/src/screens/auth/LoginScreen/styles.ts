import { StyleSheet } from 'react-native';

import { LINK, ModernType } from '@/utils/modernTheme';
import { FontWeight } from '@/utils/Theme';

/** Login-only styles; the shared auth layout lives in ../shared/styles. */
export const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  forgotText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: LINK,
  },
});
