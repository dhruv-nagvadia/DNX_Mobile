import { StyleSheet } from 'react-native';
import { FontWeight } from '@/utils/Theme';

export const styles = StyleSheet.create({
  /** Bottom-tab icon slot; gets a soft blue pill when the tab is active. */
  tabIconWrap: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
});
