import { StyleSheet } from 'react-native';
import { Color } from '@/utils/Theme';
import { ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  axis: {
    width: 36,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  axisLabel: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'right',
  },
  plot: {
    flex: 1,
    marginLeft: 6,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 42,
  },
  xLabel: {
    flex: 1,
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  emptyCaption: {
    marginTop: 6,
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
